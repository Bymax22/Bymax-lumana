import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [users, vehicles, auctions, brands, categories, blogs, supportTickets, pages] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.vehicle.count(),
      this.prisma.auction.count(),
      this.prisma.brand.count(),
      this.prisma.category.count(),
      this.prisma.blogPost.count(),
      this.prisma.supportTicket.count(),
      this.prisma.page.count(),
    ]);

    return {
      users,
      vehicles,
      auctions,
      brands,
      categories,
      blogs,
      support: supportTickets,
      pages,
    };
  }
}
