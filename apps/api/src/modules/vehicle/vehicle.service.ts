import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface VehicleFilter {
  make?: string;
  model?: string;
  year?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable()
export class VehicleService {
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

  async findAll(filter: VehicleFilter = {}) {
    const where: any = {};

    if (filter.make) {
      where.make = { contains: filter.make, mode: 'insensitive' };
    }

    if (filter.model) {
      where.model = { contains: filter.model, mode: 'insensitive' };
    }

    if (filter.year) {
      where.year = filter.year;
    }

    if (filter.search) {
      where.AND = where.AND || [];
      where.AND.push({
        OR: [
          { make: { contains: filter.search, mode: 'insensitive' } },
          { model: { contains: filter.search, mode: 'insensitive' } },
          { vin: { contains: filter.search, mode: 'insensitive' } },
          { color: { contains: filter.search, mode: 'insensitive' } },
          { transmission: { contains: filter.search, mode: 'insensitive' } },
        ],
      });
    }

    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      const priceFilter: any = {};
      if (filter.minPrice !== undefined) {
        priceFilter.gte = filter.minPrice;
      }
      if (filter.maxPrice !== undefined) {
        priceFilter.lte = filter.maxPrice;
      }

      where.AND = where.AND || [];
      where.AND.push({
        auctions: {
          some: {
            currentPrice: priceFilter,
          },
        },
      });
    }

    return this.prisma.vehicle.findMany({
      where,
      include: {
        dealer: true,
        auctions: {
          take: 1,
        },
        images: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.vehicle.findUnique({
      where: { id },
      include: { dealer: true, auctions: { take: 1 }, images: true },
    });
  }

  async create(data: any) {
    const { dealerId, images, imageUrl, year, mileage, ...rest } = data;
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
      include: { dealer: true, auctions: { take: 1 }, images: true },
    });
  }

  async update(id: string, data: any) {
    const { year, mileage, ...rest } = data;

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        ...rest,
        ...(year !== undefined ? { year: Number(year) } : {}),
        ...(mileage !== undefined ? { mileage: Number(mileage) } : {}),
      },
    });
  }
}
