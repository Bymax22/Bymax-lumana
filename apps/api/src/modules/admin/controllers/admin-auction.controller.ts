import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AdminAuctionService } from '../services/admin-auction.service';
import { CreateAuctionDto, UpdateAuctionDto } from '../dtos/auction.dto';

@Controller('admin/auctions')
export class AdminAuctionController {
  constructor(private auctionService: AdminAuctionService) {}

  @Post()
  async create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionService.create(createAuctionDto);
  }

  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.auctionService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.auctionService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
  ) {
    return this.auctionService.update(id, updateAuctionDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.auctionService.delete(id);
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string) {
    return this.auctionService.approve(id);
  }

  @Put(':id/reject')
  async reject(@Param('id') id: string) {
    return this.auctionService.reject(id);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.auctionService.updateStatus(id, status);
  }
}
