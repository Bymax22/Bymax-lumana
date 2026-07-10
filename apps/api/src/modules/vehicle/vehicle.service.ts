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
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.vehicle.create({ data });
  }
}
