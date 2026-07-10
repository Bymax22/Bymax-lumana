import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.financeApplication.findMany();
  }

  findOne(id: string) {
    return this.prisma.financeApplication.findUnique({ where: { id } });
  }
}
