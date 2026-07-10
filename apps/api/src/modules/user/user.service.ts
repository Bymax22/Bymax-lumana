import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        dealerId: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        dealerId: true,
      },
    });
  }

  async create(data: { email: string; name?: string; role?: UserRole; password?: string }) {
    const password = data.password ? await bcrypt.hash(data.password, 10) : undefined;
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
        password,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        dealerId: true,
      },
    });
  }
}
