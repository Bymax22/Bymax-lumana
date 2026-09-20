import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { SessionAuthGuard } from '../auth/session.guard';

@Controller('auctions')
export class AuctionController {
  constructor(private service: AuctionService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Post(':id/bids')
  @UseGuards(SessionAuthGuard)
  placeBid(@Param('id') id: string, @Body('amount') amount: number, @Req() request: any) {
    return this.service.placeBid(id, request.user.id, Number(amount));
  }
}
