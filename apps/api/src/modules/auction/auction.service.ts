import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuctionStatus } from '@prisma/client';

@Injectable()
export class AuctionService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const now = new Date();
    await this.prisma.auction.updateMany({
      where: { status: AuctionStatus.SCHEDULED, startAt: { lte: now }, endAt: { gt: now } },
      data: { status: AuctionStatus.LIVE },
    });
    await this.prisma.auction.updateMany({
      where: { status: { in: [AuctionStatus.LIVE, AuctionStatus.SCHEDULED] }, endAt: { lte: now } },
      data: { status: AuctionStatus.ENDED },
    });

    return this.prisma.auction.findMany({
      where: { status: { in: [AuctionStatus.SCHEDULED, AuctionStatus.LIVE] } },
      include: { vehicle: true, bids: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { startAt: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.auction.findUnique({
      where: { id },
      include: { vehicle: true, bids: { include: { bidder: true }, orderBy: { createdAt: 'desc' } } },
    });
  }

  async create(data: any) {
    return this.prisma.auction.create({ data });
  }

  async placeBid(auctionId: string, bidderId: string, amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('A valid bid amount is required.');
    }

    return this.prisma.$transaction(async (transaction) => {
      const auction = await transaction.auction.findUnique({ where: { id: auctionId } });
      if (!auction) throw new NotFoundException('Auction not found.');

      const now = new Date();
      if (auction.endAt <= now || auction.status === AuctionStatus.ENDED || auction.status === AuctionStatus.CANCELLED) {
        throw new BadRequestException('This auction is no longer accepting bids.');
      }
      if (auction.startAt > now || (auction.status !== AuctionStatus.LIVE && auction.status !== AuctionStatus.SCHEDULED)) {
        throw new BadRequestException('This auction is not open yet.');
      }

      const minimum = auction.currentPrice ?? auction.startingPrice;
      if (amount <= minimum) {
        throw new BadRequestException(`Your bid must be greater than ${minimum}.`);
      }

      const updated = await transaction.auction.updateMany({
        where: { id: auctionId, currentPrice: auction.currentPrice },
        data: { currentPrice: amount, status: AuctionStatus.LIVE },
      });
      if (updated.count !== 1) throw new BadRequestException('The auction changed. Please submit your bid again.');

      return transaction.bid.create({
        data: { auctionId, bidderId, amount },
        include: { bidder: true },
      });
    });
  }
}
