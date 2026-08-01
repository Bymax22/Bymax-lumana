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
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminVehicleService } from '../services/admin-vehicle.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dtos/vehicle.dto';

@Controller('admin/vehicles')
export class AdminVehicleController {
  constructor(
    private vehicleService: AdminVehicleService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    const uploadedFiles = files ?? [];
    const uploadedImages = uploadedFiles.length
      ? await this.cloudinaryService.uploadMultiple(uploadedFiles, 'lumana/vehicles')
      : [];

    return this.vehicleService.create({
      ...createVehicleDto,
      ...(uploadedImages.length ? { images: uploadedImages.map(({ url }) => url) } : {}),
    });
  }

  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.vehicleService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    const uploadedFiles = files ?? [];
    const uploadedImages = uploadedFiles.length
      ? await this.cloudinaryService.uploadMultiple(uploadedFiles, 'lumana/vehicles')
      : [];

    const data: UpdateVehicleDto & { images?: string[] } = { ...updateVehicleDto };
    if (uploadedImages.length) {
      data.images = uploadedImages.map(({ url }) => url);
    }

    return this.vehicleService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.vehicleService.delete(id);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.vehicleService.updateStatus(id, status);
  }
}
