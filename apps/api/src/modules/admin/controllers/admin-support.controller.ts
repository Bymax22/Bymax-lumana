import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AdminSupportService } from '../services/admin-support.service';

@Controller('admin/support')
export class AdminSupportController {
  constructor(private supportService: AdminSupportService) {}

  @Get('tickets')
  async findAllTickets(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.supportService.findAllTickets(Number(skip), Number(take));
  }

  @Get('tickets/:id')
  async findOneTicket(@Param('id') id: string) {
    return this.supportService.findOneTicket(id);
  }

  @Put('tickets/:id/status')
  async updateTicketStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.supportService.updateTicketStatus(id, status);
  }

  @Post('tickets/:id/messages')
  async addMessage(
    @Param('id') ticketId: string,
    @Body() { userId, message }: { userId: string; message: string },
  ) {
    return this.supportService.addMessage(ticketId, userId, message, true);
  }

  @Delete('tickets/:id')
  async deleteTicket(@Param('id') id: string) {
    return this.supportService.deleteTicket(id);
  }

  @Get('inquiries')
  async findAllInquiries(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.supportService.findAllInquiries(Number(skip), Number(take));
  }
}
