import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuctionService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.auction.findMany({ include: { vehicle: true } });
  }

  async findOne(id: string) {
    return this.prisma.auction.findUnique({ where: { id }, include: { vehicle: true } });
  }

  async create(data: any) {
    return this.prisma.auction.create({ data });
  }
}
