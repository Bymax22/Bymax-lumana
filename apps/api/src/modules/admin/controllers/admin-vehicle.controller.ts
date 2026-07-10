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
import { AdminVehicleService } from '../services/admin-vehicle.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dtos/vehicle.dto';
import type { Multer } from 'multer';

@Controller('admin/vehicles')
export class AdminVehicleController {
  constructor(
    private vehicleService: AdminVehicleService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @UploadedFile() file?: Multer.File,
  ) {
    let imageUrl = createVehicleDto.imageUrl;
    if (file) {
      const uploaded = await this.cloudinaryService.uploadImage(file, 'lumana/vehicles');
      imageUrl = uploaded.url;
    }
    return this.vehicleService.create({ ...createVehicleDto, imageUrl });
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
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @UploadedFile() file?: Multer.File,
  ) {
    let data = { ...updateVehicleDto };
    if (file) {
      const uploaded = await this.cloudinaryService.uploadImage(file, 'lumana/vehicles');
      data.imageUrl = uploaded.url;
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
