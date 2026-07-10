import { Controller, Get } from '@nestjs/common';
import { CustomsService } from './customs.service';

@Controller('customs')
export class CustomsController {
  constructor(private readonly service: CustomsService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }
}
