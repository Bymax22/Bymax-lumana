import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRentalVehicleDto } from './dtos/create-rental-vehicle.dto';
import { CreateRentalBookingDto } from './dtos/create-rental-booking.dto';
import { CreateInsurancePlanDto } from './dtos/create-insurance-plan.dto';
import { ReportDamageDto } from './dtos/report-damage.dto';
import { GPSLocationDto } from './dtos/gps-location.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class HireService {
  constructor(private prisma: PrismaService) {}

  // ==================== RENTAL VEHICLE MANAGEMENT ====================
  
  async createRentalVehicle(dto: CreateRentalVehicleDto) {
    const vehicleExists = await this.prisma.rentalVehicle.findUnique({
      where: { vin: dto.vin },
    });

    if (vehicleExists) {
      throw new BadRequestException('Vehicle with this VIN already exists');
    }

    return this.prisma.rentalVehicle.create({
      data: {
        ...dto,
        status: 'AVAILABLE',
      },
    });
  }

  async getAllRentalVehicles(skip = 0, take = 10) {
    const [vehicles, total] = await Promise.all([
      this.prisma.rentalVehicle.findMany({
        skip,
        take,
        include: {
          bookings: true,
          pricing: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rentalVehicle.count(),
    ]);

    return {
      data: vehicles,
      total,
      skip,
      take,
    };
  }

  async getRentalVehicleById(id: string) {
    const vehicle = await this.prisma.rentalVehicle.findUnique({
      where: { id },
      include: {
        bookings: {
          include: { customer: true, insurance: true },
        },
        gpsTracking: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
        damageReports: true,
        pricing: true,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Rental vehicle not found');
    }

    return vehicle;
  }

  async updateRentalVehicle(id: string, data: Partial<CreateRentalVehicleDto>) {
    const vehicle = await this.prisma.rentalVehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Rental vehicle not found');
    }

    return this.prisma.rentalVehicle.update({
      where: { id },
      data,
    });
  }

  async getAvailableVehicles(pickupDate: Date, returnDate: Date) {
    // Get all vehicles that don't have bookings overlapping the requested dates
    const bookedVehicles = await this.prisma.rentalBooking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
        pickupDate: { lt: returnDate },
        returnDate: { gt: pickupDate },
      },
      select: { rentalVehicleId: true },
    });

    const bookedIds = bookedVehicles.map((b) => b.rentalVehicleId);

    return this.prisma.rentalVehicle.findMany({
      where: {
        status: 'AVAILABLE',
        id: { notIn: bookedIds },
      },
      include: { pricing: true },
    });
  }

  // ==================== RENTAL BOOKING MANAGEMENT ====================

  async createRentalBooking(dto: CreateRentalBookingDto) {
    const { paymentMethod, ...bookingPayload } = dto;
    const vehicle = await this.prisma.rentalVehicle.findUnique({
      where: { id: dto.rentalVehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Rental vehicle not found');
    }

    // Check availability
    const conflictingBooking = await this.prisma.rentalBooking.findFirst({
      where: {
        rentalVehicleId: dto.rentalVehicleId,
        status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
        pickupDate: { lt: dto.returnDate },
        returnDate: { gt: dto.pickupDate },
      },
    });

    if (conflictingBooking) {
      throw new BadRequestException('Vehicle is not available for the selected dates');
    }

    // Calculate total price using admin-selected rental duration options
    const durationType = (dto.metadata?.durationType || 'DAILY').toUpperCase();
    const requestedDays = Number(dto.metadata?.durationDays || 0);
    const daysDiff = Math.max(1, Math.ceil(
      (dto.returnDate.getTime() - dto.pickupDate.getTime()) / (1000 * 60 * 60 * 24)
    ));

    const durationMultipliers: Record<string, number> = {
      DAILY: 1,
      WEEKLY: 7,
      MONTHLY: 30,
      CUSTOM: 1,
    };

    const normalizedDays = requestedDays > 0 ? requestedDays : daysDiff;
    const effectiveDays = durationType === 'CUSTOM'
      ? normalizedDays
      : normalizedDays * (durationMultipliers[durationType] || 1);

    let totalPrice = vehicle.basePrice * effectiveDays;

    if (dto.insurancePlanId) {
      const insurance = await this.prisma.insurancePlan.findUnique({
        where: { id: dto.insurancePlanId },
      });
      if (insurance) {
        totalPrice += insurance.dailyPrice * effectiveDays;
      }
    }

    const bookingRef = `RENT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const paymentStatus = ['BANK_TRANSFER', 'CASH'].includes(dto.paymentMethod || '') ? 'PENDING' : 'COMPLETED';

    const booking = await this.prisma.rentalBooking.create({
      data: {
        ...bookingPayload,
        bookingRef,
        totalPrice,
        status: 'PENDING',
        metadata: {
          ...dto.metadata,
          durationType,
          requestedDays: normalizedDays,
          effectiveDays,
          pricingBasis: durationType === 'CUSTOM' ? 'CUSTOM_DAYS' : `${durationType.toLowerCase()}_rate`,
        },
      },
      include: {
        vehicle: true,
        customer: true,
        insurance: true,
      },
    });

    if (dto.paymentMethod) {
      await this.prisma.payment.create({
        data: {
          userId: dto.userId,
          amount: totalPrice,
          currency: 'USD',
          provider: dto.paymentMethod,
          providerRef: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: paymentStatus as $Enums.PaymentStatus,
          rentalBookingId: booking.id,
          metadata: {
            paymentMethod: dto.paymentMethod,
            rentalVehicleId: dto.rentalVehicleId,
          },
        },
      });
    }

    return booking;
  }

  async getRentalBookings(userId?: string, skip = 0, take = 10) {
    const where = userId ? { userId } : {};

    const [bookings, total] = await Promise.all([
      this.prisma.rentalBooking.findMany({
        where,
        skip,
        take,
        include: {
          vehicle: true,
          customer: true,
          insurance: true,
          damageReport: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rentalBooking.count({ where }),
    ]);

    return {
      data: bookings,
      total,
      skip,
      take,
    };
  }

  async getAllRentalBookings(skip = 0, take = 20) {
    return this.getRentalBookings(undefined, skip, take);
  }

  async getRentalBookingById(id: string) {
    const booking = await this.prisma.rentalBooking.findUnique({
      where: { id },
      include: {
        vehicle: true,
        customer: true,
        insurance: true,
        damageReport: true,
        payments: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Rental booking not found');
    }

    return booking;
  }

  async updateBookingStatus(id: string, status: string) {
    const booking = await this.prisma.rentalBooking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Rental booking not found');
    }

    const rentalStatus = status === 'CONFIRMED' || status === 'IN_PROGRESS' || status === 'ACTIVE'
      ? 'BOOKED'
      : status === 'COMPLETED' || status === 'CANCELLED' || status === 'NO_SHOW'
        ? 'AVAILABLE'
        : 'AVAILABLE';

    await this.prisma.rentalVehicle.update({
      where: { id: booking.rentalVehicleId },
      data: { status: rentalStatus as $Enums.RentalVehicleStatus },
    });

    return this.prisma.rentalBooking.update({
      where: { id },
      data: { status: status as $Enums.BookingStatus },
      include: {
        vehicle: true,
        customer: true,
      },
    });
  }

  async completeBooking(id: string) {
    return this.updateBookingStatus(id, 'COMPLETED');
  }

  async cancelBooking(id: string) {
    return this.updateBookingStatus(id, 'CANCELLED');
  }

  // ==================== INSURANCE PLANS ====================

  async createInsurancePlan(dto: CreateInsurancePlanDto) {
    return this.prisma.insurancePlan.create({
      data: {
        ...dto,
        active: true,
      },
    });
  }

  async getInsurancePlans() {
    return this.prisma.insurancePlan.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInsurancePlanById(id: string) {
    const plan = await this.prisma.insurancePlan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Insurance plan not found');
    }

    return plan;
  }

  // ==================== GPS TRACKING ====================

  async recordGPSLocation(dto: GPSLocationDto) {
    const vehicle = await this.prisma.rentalVehicle.findUnique({
      where: { id: dto.rentalVehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Rental vehicle not found');
    }

    return this.prisma.gPSTracking.create({
      data: {
        ...dto,
        timestamp: new Date(),
      },
    });
  }

  async getVehicleGPSHistory(vehicleId: string, limit = 50) {
    return this.prisma.gPSTracking.findMany({
      where: { rentalVehicleId: vehicleId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async getLatestGPSLocation(vehicleId: string) {
    return this.prisma.gPSTracking.findFirst({
      where: { rentalVehicleId: vehicleId },
      orderBy: { timestamp: 'desc' },
    });
  }

  // ==================== DAMAGE REPORTS ====================

  async reportDamage(dto: ReportDamageDto) {
    const vehicle = await this.prisma.rentalVehicle.findUnique({
      where: { id: dto.rentalVehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Rental vehicle not found');
    }

    return this.prisma.damageReport.create({
      data: {
        ...dto,
        status: 'PENDING',
      },
      include: {
        vehicle: true,
        booking: true,
      },
    });
  }

  async getDamageReports(vehicleId?: string, skip = 0, take = 10) {
    const where = vehicleId ? { rentalVehicleId: vehicleId } : {};

    const [reports, total] = await Promise.all([
      this.prisma.damageReport.findMany({
        where,
        skip,
        take,
        include: {
          vehicle: true,
          booking: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.damageReport.count({ where }),
    ]);

    return {
      data: reports,
      total,
      skip,
      take,
    };
  }

  async approveDamageReport(id: string) {
    return this.prisma.damageReport.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async rejectDamageReport(id: string) {
    return this.prisma.damageReport.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  // ==================== PRICING ====================

  async setSeasonalPricing(vehicleId: string, startDate: Date, endDate: Date, dailyRate: number) {
    const vehicle = await this.prisma.rentalVehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Rental vehicle not found');
    }

    return this.prisma.rentalPricing.create({
      data: {
        rentalVehicleId: vehicleId,
        startDate,
        endDate,
        dailyRate,
        reason: 'SEASONAL',
      },
    });
  }

  async getPricingForVehicle(vehicleId: string) {
    return this.prisma.rentalPricing.findMany({
      where: { rentalVehicleId: vehicleId },
      orderBy: { startDate: 'desc' },
    });
  }
}
