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

  private async syncImages(vehicleId: string, urls: string[]) {
    await this.prisma.vehicleImage.deleteMany({ where: { vehicleId } });

    if (urls.length) {
      await this.prisma.vehicleImage.createMany({
        data: urls.map((url: string) => ({ vehicleId, url })),
      });
    }
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
        price: rest.price !== undefined ? Number(rest.price) : undefined,
        vin: rest.vin || `VIN-${Date.now()}`,
      },
    });

    const urls = [...(Array.isArray(images) ? images : []), ...(imageUrl ? [imageUrl] : [])].filter(Boolean);

    if (urls.length) {
      await this.syncImages(vehicle.id, urls);
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

  async update(id: string, data: UpdateVehicleDto & { imageUrl?: string; images?: string[] }) {
    const { imageUrl, images, year, mileage, ...rest } = data;

    const updateData: Record<string, unknown> = { ...rest };
    if (year !== undefined) {
      updateData.year = Number(year);
    }
    if (mileage !== undefined) {
      updateData.mileage = Number(mileage);
    }
    if ((rest as any).price !== undefined) {
      updateData.price = Number((rest as any).price);
    }

    await this.prisma.vehicle.update({
      where: { id },
      data: updateData,
    });

    const urls = [...(Array.isArray(images) ? images : []), ...(imageUrl ? [imageUrl] : [])].filter(Boolean);

    if (images !== undefined || imageUrl !== undefined) {
      await this.syncImages(id, urls);
    }

    return this.prisma.vehicle.findUnique({
      where: { id },
      include: { brand: true, category: true, images: true },
    });
  }

  async delete(id: string) {
    await this.prisma.vehicleImage.deleteMany({ where: { vehicleId: id } });

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }
}
