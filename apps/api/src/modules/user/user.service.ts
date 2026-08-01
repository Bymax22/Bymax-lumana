import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

export interface UserDeletionCleanupStep {
  model: string;
  where?: Record<string, unknown>;
  updateMany?: {
    where: Record<string, unknown>;
    data: Record<string, unknown>;
  };
}

export function buildUserDeletionCleanupPlan(userId: string): UserDeletionCleanupStep[] {
  return [
    { model: 'passwordReset', where: { userId } },
    { model: 'session', where: { userId } },
    { model: 'notification', where: { userId } },
    { model: 'supportMessage', where: { senderId: userId } },
    { model: 'supportTicket', where: { userId } },
    { model: 'supportTicket', updateMany: { where: { assignedToId: userId }, data: { assignedToId: null } } },
    { model: 'review', where: { userId } },
    { model: 'payment', where: { userId } },
    { model: 'financeApplication', where: { userId } },
    { model: 'importQuote', where: { userId } },
    { model: 'inspectionReport', where: { inspectorId: userId } },
    { model: 'blogPost', where: { authorId: userId } },
    { model: 'auditLog', where: { actorId: userId } },
    { model: 'shoppingCart', where: { userId } },
    { model: 'order', where: { userId } },
    { model: 'rentalBooking', where: { userId } },
    { model: 'user', where: { id: userId } },
  ];
}

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

  async deleteOne(id: string) {
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
}
