import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { VehicleService } from './vehicle.service';
import { CloudinaryService } from '../admin/services/cloudinary.service';

@Controller('vehicles')
export class VehicleController {
  constructor(
    private service: VehicleService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getAll(
    @Query('make') make?: string,
    @Query('model') model?: string,
    @Query('year') year?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.service.findAll({
      make,
      model,
      year: year ? Number(year) : undefined,
      search,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor(['images', 'image'], 10))
  async create(@Body() body: any, @UploadedFiles() files?: Array<Express.Multer.File>) {
    const uploadedUrls = files?.length
      ? await Promise.all(files.map((file) => this.cloudinaryService.uploadImage(file, 'lumana/vehicles').then((result) => result.url)))
      : [];

    return this.service.create({
      ...body,
      ...(uploadedUrls.length ? { images: uploadedUrls } : {}),
      ...(body.imageUrl ? { imageUrl: body.imageUrl } : {}),
    });
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor(['images', 'image'], 10))
  async update(@Param('id') id: string, @Body() body: any, @UploadedFiles() files?: Array<Express.Multer.File>) {
    const uploadedUrls = files?.length
      ? await Promise.all(files.map((file) => this.cloudinaryService.uploadImage(file, 'lumana/vehicles').then((result) => result.url)))
      : [];

    return this.service.update(id, {
      ...body,
      ...(uploadedUrls.length ? { images: uploadedUrls } : {}),
      ...(body.imageUrl ? { imageUrl: body.imageUrl } : {}),
    });
  }
}
