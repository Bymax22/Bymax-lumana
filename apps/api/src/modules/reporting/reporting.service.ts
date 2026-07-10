import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportingService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.report.findMany();
  }

  findOne(id: string) {
    return this.prisma.report.findUnique({ where: { id } });
  }
}
