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
import { AdminBrandService } from '../services/admin-brand.service';
import { CloudinaryService } from '../services/cloudinary.service';

@Controller('admin/brands')
export class AdminBrandController {
  constructor(
    private brandService: AdminBrandService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createBrandDto: { name: string; description?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let logoUrl: string | undefined;

    if (file) {
      try {
        const uploaded = await this.cloudinaryService.uploadImage(file, 'lumana/brands');
        if (uploaded?.url) {
          logoUrl = uploaded.url;
        }
      } catch (error) {
        console.error('Brand logo upload failed, continuing without logo:', error);
      }
    }

    return this.brandService.create({ ...createBrandDto, logoUrl });
  }

  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.brandService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: { name?: string; description?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data: any = { ...updateBrandDto };

    if (file) {
      try {
        const uploaded = await this.cloudinaryService.uploadImage(file, 'lumana/brands');
        if (uploaded?.url) {
          data.logoUrl = uploaded.url;
        }
      } catch (error) {
        console.error('Brand logo update failed, keeping existing logo:', error);
      }
    }

    return this.brandService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.brandService.delete(id);
  }
}
