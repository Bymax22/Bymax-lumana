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
import { AdminCategoryService } from '../services/admin-category.service';

@Controller('admin/categories')
export class AdminCategoryController {
  constructor(private categoryService: AdminCategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: { name: string; description?: string }) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.categoryService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: { name?: string; description?: string },
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
