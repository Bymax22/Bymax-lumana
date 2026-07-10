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
import { AdminPageService } from '../services/admin-page.service';

@Controller('admin/pages')
export class AdminPageController {
  constructor(private pageService: AdminPageService) {}

  @Post()
  async create(@Body() createPageDto: { title: string; slug: string; content: string; status?: string }) {
    return this.pageService.create(createPageDto);
  }

  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.pageService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pageService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePageDto: any,
  ) {
    return this.pageService.update(id, updatePageDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.pageService.delete(id);
  }

  @Put(':id/publish')
  async publish(@Param('id') id: string) {
    return this.pageService.publish(id);
  }
}
