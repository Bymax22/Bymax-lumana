import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminPageService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; slug: string; content: string; status?: string }) {
    return this.prisma.page.create({
      data: {
        ...data,
        status: data.status
          ? (data.status.toUpperCase() as ContentStatus)
          : ContentStatus.DRAFT,
      },
    });
  }

  async findAll(skip = 0, take = 10) {
    return this.prisma.page.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.page.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.page.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.page.delete({ where: { id } });
  }

  async publish(id: string) {
    return this.prisma.page.update({
      where: { id },
      data: { status: ContentStatus.PUBLISHED },
    });
  }
}
