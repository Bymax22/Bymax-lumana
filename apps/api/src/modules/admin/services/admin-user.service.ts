import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { buildUserDeletionCleanupPlan } from '../../user/user.service';

@Injectable()
export class AdminUserService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip = 0, take = 10) {
    return this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('User not found.');
    }

    return this.prisma.$transaction(async (tx) => {
      const txClient = tx as any;
      const cleanupPlan = buildUserDeletionCleanupPlan(id);

      for (const step of cleanupPlan) {
        if (step.updateMany) {
          await txClient[step.model].updateMany(step.updateMany);
          continue;
        }

        if (step.model === 'user') {
          await txClient.user.delete({ where: step.where });
          continue;
        }

        await txClient[step.model].deleteMany({ where: step.where });
      }

      const sellerAuctions = await txClient.auction.findMany({ where: { sellerId: id }, select: { id: true } });
      if (sellerAuctions.length > 0) {
        const auctionIds = sellerAuctions.map((auction: { id: string }) => auction.id);
        await txClient.bid.deleteMany({ where: { auctionId: { in: auctionIds } } });
      }

      await txClient.auction.deleteMany({ where: { sellerId: id } });
      await txClient.bid.deleteMany({ where: { bidderId: id } });

      const rentalBookings = await txClient.rentalBooking.findMany({ where: { userId: id }, select: { id: true } });
      if (rentalBookings.length > 0) {
        const bookingIds = rentalBookings.map((booking: { id: string }) => booking.id);
        await txClient.damageReport.deleteMany({ where: { bookingId: { in: bookingIds } } });
      }

      await txClient.rentalBooking.deleteMany({ where: { userId: id } });
      await txClient.shoppingCart.deleteMany({ where: { userId: id } });
      await txClient.order.deleteMany({ where: { userId: id } });
      await txClient.payment.deleteMany({ where: { userId: id } });
      await txClient.notification.deleteMany({ where: { userId: id } });

      return { success: true, deletedUserId: id };
    });
  }

  async updateRole(id: string, role: string) {
    return this.prisma.user.update({
      where: { id },
      data: { role: role.toUpperCase() as UserRole },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
