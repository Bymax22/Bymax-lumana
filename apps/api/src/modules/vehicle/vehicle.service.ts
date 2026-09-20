import { Injectable } from '@nestjs/common';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
        OR: [
          { price: priceFilter },
          {
            auctions: {
              some: {
                currentPrice: priceFilter,
              },
            },
          },
        ],
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

  async getSaveInfo(vehicleId: string, userId?: string) {
    const [count, saved] = await Promise.all([
      this.prisma.vehicleSave.count({ where: { vehicleId } }),
      userId ? this.prisma.vehicleSave.findUnique({ where: { vehicleId_userId: { vehicleId, userId } } }) : Promise.resolve(null),
    ]);

    return { count, saved: Boolean(saved) };
  }

  async findSaved(userId: string) {
    const saves = await this.prisma.vehicleSave.findMany({
      where: { userId },
      include: { vehicle: { include: { images: true, brand: true, category: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return saves.map((save) => save.vehicle);
  }

  async toggleSave(vehicleId: string, userId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { id: true } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const existing = await this.prisma.vehicleSave.findUnique({ where: { vehicleId_userId: { vehicleId, userId } } });
    if (existing) {
      await this.prisma.vehicleSave.delete({ where: { id: existing.id } });
    } else {
      await this.prisma.vehicleSave.create({ data: { vehicleId, userId } });
    }

    return this.getSaveInfo(vehicleId, userId);
  }

  async purchase(id: string, data: { userId?: string; shippingAddress?: string; paymentMethod?: string }) {
    if (!data.userId) {
      throw new Error('A logged-in buyer is required to purchase a vehicle');
    }

    const vehicle = await this.prisma.vehicle.findUnique({ where: { id }, include: { images: true } });

    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.status === 'SOLD') throw new ConflictException('This vehicle has already been sold');

    const amount = vehicle.price ?? 0;
    const order = await this.prisma.$transaction(async (transaction) => {
      const updatedVehicle = await transaction.vehicle.updateMany({ where: { id, status: 'AVAILABLE' }, data: { status: 'SOLD' } });
      if (updatedVehicle.count !== 1) throw new ConflictException('This vehicle has already been sold');

      return transaction.order.create({
        data: {
          orderRef: `VEH-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          userId: data.userId,
          subtotal: amount,
          tax: 0,
          shippingCost: 0,
          totalAmount: amount,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          shippingAddress: data.shippingAddress || 'To be confirmed',
          metadata: { type: 'VEHICLE_PURCHASE', vehicleId: vehicle.id, vehicle: `${vehicle.make} ${vehicle.model}`, paymentMethod: data.paymentMethod || null },
        },
      });
    });

    return { ...order, vehicle };
  }

  async create(data: any) {
    const { dealerId, images, imageUrl, year, mileage, fuelType: _fuelType, ...rest } = data;
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
    const { year, mileage, fuelType: _fuelType, images: _images, imageUrl: _imageUrl, ...rest } = data;

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
