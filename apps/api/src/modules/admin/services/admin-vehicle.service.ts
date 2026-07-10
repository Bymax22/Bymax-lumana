import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dtos/vehicle.dto';

@Injectable()
export class AdminVehicleService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVehicleDto & { imageUrl?: string }) {
    return this.prisma.vehicle.create({
      data: {
        ...data,
      },
    });
  }

  async findAll(skip = 0, take = 10) {
    return this.prisma.vehicle.findMany({
      skip,
      take,
      include: { brand: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.vehicle.findUnique({
      where: { id },
      include: { brand: true, category: true },
    });
  }

  async update(id: string, data: UpdateVehicleDto) {
    return this.prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.vehicle.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }
}
