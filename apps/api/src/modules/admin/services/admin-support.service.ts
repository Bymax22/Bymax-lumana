import { Injectable } from '@nestjs/common';
import { SupportStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminSupportService {
  constructor(private prisma: PrismaService) {}

  async findAllTickets(skip = 0, take = 10) {
    return this.prisma.supportTicket.findMany({
      skip,
      take,
      include: { user: true, messages: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneTicket(id: string) {
    return this.prisma.supportTicket.findUnique({
      where: { id },
      include: { user: true, messages: true },
    });
  }

  async updateTicketStatus(id: string, status: string) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status: status.toUpperCase() as SupportStatus },
    });
  }

  async addMessage(ticketId: string, userId: string, message: string, isAdmin = true) {
    return this.prisma.supportMessage.create({
      data: {
        ticketId,
        senderId: userId,
        content: message,
      },
    });
  }

  async findAllInquiries(skip = 0, take = 10) {
    return this.prisma.contactInquiry.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteTicket(id: string) {
    return this.prisma.supportTicket.delete({ where: { id } });
  }
}
