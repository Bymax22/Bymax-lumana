import { Controller, Get, Param } from '@nestjs/common';
import { DealerService } from './dealer.service';

@Controller('dealers')
export class DealerController {
  constructor(private readonly service: DealerService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
