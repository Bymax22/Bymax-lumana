import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DealerService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.dealer.findMany();
  }

  findOne(id: string) {
    return this.prisma.dealer.findUnique({ where: { id } });
  }
}
