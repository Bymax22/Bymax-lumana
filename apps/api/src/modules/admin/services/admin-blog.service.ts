import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

@Injectable()
export class AdminBlogService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    content: string;
    authorId: string;
    status?: string;
    imageUrl?: string;
  }) {
    return this.prisma.blogPost.create({
      data: {
        title: data.title,
        slug: slugify(data.title),
        authorId: data.authorId,
        content: data.content,
        status: data.status
          ? (data.status.toUpperCase() as ContentStatus)
          : ContentStatus.DRAFT,
      },
      include: { author: true },
    });
  }

  async findAll(skip = 0, take = 10) {
    return this.prisma.blogPost.findMany({
      skip,
      take,
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.blogPost.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  async update(id: string, data: any) {
    const updateData: any = { ...data };
    delete updateData.imageUrl;

    if (updateData.status) {
      updateData.status = updateData.status.toUpperCase() as ContentStatus;
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: { author: true },
    });
  }

  async delete(id: string) {
    return this.prisma.blogPost.delete({ where: { id } });
  }

  async publish(id: string) {
    return this.prisma.blogPost.update({
      where: { id },
      data: { status: ContentStatus.PUBLISHED },
    });
  }
}
