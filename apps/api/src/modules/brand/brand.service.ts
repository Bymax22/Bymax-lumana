import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 10) {
    try {
      return await Promise.race([
        this.prisma.brand.findMany({
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        new Promise<never>((_, reject) => {
          setTimeout(
            () => reject(new Error('Brand query timed out after 15 seconds')),
            15_000,
          );
        }),
      ]);
    } catch (error) {
      throw new ServiceUnavailableException('Brand service is unavailable');
    }
  }

  async findOne(id: string) {
    return this.prisma.brand.findUnique({ where: { id } });
  }
}
