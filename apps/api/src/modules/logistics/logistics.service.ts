import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LogisticsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.shipment.findMany();
  }

  findOne(id: string) {
    return this.prisma.shipment.findUnique({ where: { id } });
  }
}
