import { Controller, Get, Param, Query } from '@nestjs/common';
import { BrandService } from './brand.service';

@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  async findAll(@Query('skip') skip = '0', @Query('take') take = '8') {
    return this.brandService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }
}
