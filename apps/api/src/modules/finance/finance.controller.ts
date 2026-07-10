import { Controller, Get, Param } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finances')
export class FinanceController {
  constructor(private readonly service: FinanceService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
