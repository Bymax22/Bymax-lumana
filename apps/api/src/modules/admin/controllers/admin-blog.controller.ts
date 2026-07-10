import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminBlogService } from '../services/admin-blog.service';
import { CloudinaryService } from '../services/cloudinary.service';

@Controller('admin/blogs')
export class AdminBlogController {
  constructor(
    private blogService: AdminBlogService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createBlogDto: { title: string; content: string; authorId: string; status?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;
    if (file) {
      const uploaded = await this.cloudinaryService.uploadImage(file, 'lumana/blogs');
      imageUrl = uploaded.url;
    }
    return this.blogService.create({ ...createBlogDto, imageUrl });
  }

  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.blogService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let data = { ...updateBlogDto };
    if (file) {
      const uploaded = await this.cloudinaryService.uploadImage(file, 'lumana/blogs');
      data.imageUrl = uploaded.url;
    }
    return this.blogService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.blogService.delete(id);
  }

  @Put(':id/publish')
  async publish(@Param('id') id: string) {
    return this.blogService.publish(id);
  }
}
