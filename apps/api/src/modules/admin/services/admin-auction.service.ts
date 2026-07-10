import { Injectable } from '@nestjs/common';
import { AuctionStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAuctionDto, UpdateAuctionDto } from '../dtos/auction.dto';

@Injectable()
export class AdminAuctionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAuctionDto) {
    return this.prisma.auction.create({
      data: {
        title: data.title ?? `Auction for ${data.vehicleId}`,
        description: data.description,
        vehicleId: data.vehicleId,
        sellerId: data.sellerId,
        startingPrice: data.startPrice,
        reservePrice: data.reservePrice,
        startAt: data.startTime,
        endAt: data.endTime,
        status: data.status
          ? (data.status.toUpperCase() as AuctionStatus)
          : AuctionStatus.DRAFT,
      },
      include: { vehicle: true, seller: true },
    });
  }

  async findAll(skip = 0, take = 10) {
    return this.prisma.auction.findMany({
      skip,
      take,
      include: { vehicle: true, seller: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.auction.findUnique({
      where: { id },
      include: { vehicle: true, seller: true, bids: true },
    });
  }

  async update(id: string, data: UpdateAuctionDto) {
    const payload: Record<string, unknown> = {};
    if (data.startPrice !== undefined) payload.startingPrice = data.startPrice;
    if (data.reservePrice !== undefined) payload.reservePrice = data.reservePrice;
    if (data.startTime !== undefined) payload.startAt = data.startTime;
    if (data.endTime !== undefined) payload.endAt = data.endTime;
    if (data.description !== undefined) payload.description = data.description;
    if (data.status !== undefined)
      payload.status = data.status.toUpperCase() as AuctionStatus;

    return this.prisma.auction.update({
      where: { id },
      data: payload,
    });
  }

  async delete(id: string) {
    return this.prisma.auction.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.auction.update({
      where: { id },
      data: { status: status.toUpperCase() as AuctionStatus },
    });
  }

  async approve(id: string) {
    return this.prisma.auction.update({
      where: { id },
      data: { status: AuctionStatus.LIVE },
    });
  }

  async reject(id: string) {
    return this.prisma.auction.update({
      where: { id },
      data: { status: AuctionStatus.CANCELLED },
    });
  }
}
