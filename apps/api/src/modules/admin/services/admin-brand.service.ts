import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

@Injectable()
export class AdminBrandService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; logoUrl?: string; description?: string; slug?: string }) {
    return this.prisma.brand.create({
      data: {
        ...data,
        slug: data.slug ?? slugify(data.name),
      },
    });
  }

  async findAll(skip = 0, take = 10) {
    return this.prisma.brand.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.brand.findUnique({ where: { id } });
  }

  async update(id: string, data: { name?: string; logoUrl?: string; description?: string }) {
    return this.prisma.brand.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.brand.delete({ where: { id } });
  }
}
