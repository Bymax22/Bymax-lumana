import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { VehicleService } from './vehicle.service';
import { CloudinaryService } from '../admin/services/cloudinary.service';
import { SessionAuthGuard } from '../auth/session.guard';

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

  @Post(':id/purchase')
  @UseGuards(SessionAuthGuard)
  purchase(
    @Param('id') id: string,
    @Req() request: any,
    @Body() body: { shippingAddress?: string; paymentMethod?: string },
  ) {
    return this.service.purchase(id, { ...body, userId: request.user.id });
  }

  @Get('saved')
  @UseGuards(SessionAuthGuard)
  getSaved(@Req() request: any) {
    return this.service.findSaved(request.user.id);
  }

  @Get(':id/save-count')
  getSaveCount(@Param('id') id: string) {
    return this.service.getSaveInfo(id);
  }

  @Get(':id/save-status')
  @UseGuards(SessionAuthGuard)
  getSaveStatus(@Param('id') id: string, @Req() request: any) {
    return this.service.getSaveInfo(id, request.user.id);
  }

  @Post(':id/save')
  @UseGuards(SessionAuthGuard)
  toggleSave(@Param('id') id: string, @Req() request: any) {
    return this.service.toggleSave(id, request.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 10 },
    { name: 'image', maxCount: 1 },
  ]))
  async create(@Body() body: any, @UploadedFiles() files?: { images?: Express.Multer.File[]; image?: Express.Multer.File[] }) {
    const uploadedFiles = [...(files?.images || []), ...(files?.image || [])];
    const uploadedUrls = uploadedFiles.length
      ? (
          await Promise.all(
            uploadedFiles.map(async (file) => {
              const result = await this.cloudinaryService.uploadImage(file, 'lumana/vehicles');
              return result?.url ?? null;
            }),
          )
        ).filter((url): url is string => Boolean(url))
      : [];

    return this.service.create({
      ...body,
      ...(uploadedUrls.length ? { images: uploadedUrls } : {}),
      ...(body.imageUrl ? { imageUrl: body.imageUrl } : {}),
    });
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 10 },
    { name: 'image', maxCount: 1 },
  ]))
  async update(@Param('id') id: string, @Body() body: any, @UploadedFiles() files?: { images?: Express.Multer.File[]; image?: Express.Multer.File[] }) {
    const uploadedFiles = [...(files?.images || []), ...(files?.image || [])];
    const uploadedUrls = uploadedFiles.length
      ? (
          await Promise.all(
            uploadedFiles.map(async (file) => {
              const result = await this.cloudinaryService.uploadImage(file, 'lumana/vehicles');
              return result?.url ?? null;
            }),
          )
        ).filter((url): url is string => Boolean(url))
      : [];

    return this.service.update(id, {
      ...body,
      ...(uploadedUrls.length ? { images: uploadedUrls } : {}),
      ...(body.imageUrl ? { imageUrl: body.imageUrl } : {}),
    });
  }
}
