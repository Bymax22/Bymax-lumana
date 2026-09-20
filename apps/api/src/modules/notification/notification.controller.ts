import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SessionAuthGuard } from '../auth/session.guard';

@Controller('notifications')
@UseGuards(SessionAuthGuard)
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  getAll(@Req() request: any) {
    return this.service.findAll(request.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
