import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dtos/vehicle.dto';

@Injectable()
export class AdminVehicleService {
  constructor(private prisma: PrismaService) {}

  private async resolveDealerId(dealerId?: string) {
    if (dealerId?.trim()) {
      return dealerId;
    }

    const existingDealer = await this.prisma.dealer.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    if (existingDealer) {
      return existingDealer.id;
    }

    const createdDealer = await this.prisma.dealer.create({
      data: {
        name: 'Default Dealer',
        code: `DEFAULT-${Date.now()}`,
      },
    });

    return createdDealer.id;
  }

  async create(data: CreateVehicleDto & { imageUrl?: string; images?: string[] }) {
    const { imageUrl, images, dealerId, year, mileage, ...rest } = data;
    const resolvedDealerId = await this.resolveDealerId(dealerId);

    const vehicle = await this.prisma.vehicle.create({
      data: {
        ...rest,
        dealerId: resolvedDealerId,
        year: year !== undefined ? Number(year) : new Date().getFullYear(),
        mileage: mileage !== undefined ? Number(mileage) : undefined,
        vin: rest.vin || `VIN-${Date.now()}`,
      },
    });

    const urls = [...(Array.isArray(images) ? images : []), ...(imageUrl ? [imageUrl] : [])].filter(Boolean);

    if (urls.length) {
      await this.prisma.vehicleImage.createMany({
        data: urls.map((url: string) => ({ vehicleId: vehicle.id, url })),
      });
    }

    return this.prisma.vehicle.findUnique({
      where: { id: vehicle.id },
      include: { brand: true, category: true, images: true },
    });
  }

  async findAll(skip = 0, take = 10) {
    return this.prisma.vehicle.findMany({
      skip,
      take,
      include: { brand: true, category: true, images: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.vehicle.findUnique({
      where: { id },
      include: { brand: true, category: true, images: true },
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
