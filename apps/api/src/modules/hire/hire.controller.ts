import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { HireService } from './hire.service';
import { CreateRentalVehicleDto } from './dtos/create-rental-vehicle.dto';
import { CreateRentalBookingDto } from './dtos/create-rental-booking.dto';
import { CreateInsurancePlanDto } from './dtos/create-insurance-plan.dto';
import { ReportDamageDto } from './dtos/report-damage.dto';
import { GPSLocationDto } from './dtos/gps-location.dto';
import { CloudinaryService } from '../admin/services/cloudinary.service';

@Controller(['hire', 'api/hire'])
export class HireController {
  constructor(
    private hireService: HireService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ==================== RENTAL VEHICLES ====================

  @Post('vehicles')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 10 },
    { name: 'image', maxCount: 1 },
  ]))
  async createVehicle(@Body() dto: CreateRentalVehicleDto, @UploadedFiles() files?: { images?: Express.Multer.File[]; image?: Express.Multer.File[] }) {
    const uploadedFiles = [...(files?.images || []), ...(files?.image || [])];
    const uploadedUrls = uploadedFiles.length
      ? await Promise.all(uploadedFiles.map((file) => this.cloudinaryService.uploadImage(file, 'lumana/rental-vehicles').then((result) => result.url)))
      : [];

    return this.hireService.createRentalVehicle({
      ...dto,
      ...(uploadedUrls.length ? { images: uploadedUrls } : {}),
    });
  }

  @Get('vehicles')
  getAllVehicles(@Query('skip') skip: string, @Query('take') take: string) {
    return this.hireService.getAllRentalVehicles(+skip || 0, +take || 10);
  }

  @Get('vehicles/available')
  getAvailableVehicles(
    @Query('pickupDate') pickupDate: string,
    @Query('returnDate') returnDate: string,
  ) {
    return this.hireService.getAvailableVehicles(
      new Date(pickupDate),
      new Date(returnDate),
    );
  }

  @Get('vehicles/:id')
  getVehicleById(@Param('id') id: string) {
    return this.hireService.getRentalVehicleById(id);
  }

  @Put('vehicles/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 10 },
    { name: 'image', maxCount: 1 },
  ]))
  async updateVehicle(@Param('id') id: string, @Body() dto: Partial<CreateRentalVehicleDto>, @UploadedFiles() files?: { images?: Express.Multer.File[]; image?: Express.Multer.File[] }) {
    const uploadedFiles = [...(files?.images || []), ...(files?.image || [])];
    const uploadedUrls = uploadedFiles.length
      ? await Promise.all(uploadedFiles.map((file) => this.cloudinaryService.uploadImage(file, 'lumana/rental-vehicles').then((result) => result.url)))
      : [];

    return this.hireService.updateRentalVehicle(id, {
      ...dto,
      ...(uploadedUrls.length ? { images: uploadedUrls } : {}),
    });
  }

  // ==================== RENTAL BOOKINGS ====================

  @Post('bookings')
  @HttpCode(HttpStatus.CREATED)
  createBooking(@Body() dto: CreateRentalBookingDto) {
    return this.hireService.createRentalBooking(dto);
  }

  @Get('bookings')
  getBookings(@Query('userId') userId: string, @Query('skip') skip: string, @Query('take') take: string) {
    return this.hireService.getRentalBookings(userId, +skip || 0, +take || 10);
  }

  @Get('bookings/admin')
  getAllBookings(@Query('skip') skip: string, @Query('take') take: string) {
    return this.hireService.getAllRentalBookings(+skip || 0, +take || 20);
  }

  @Get('bookings/:id')
  getBookingById(@Param('id') id: string) {
    return this.hireService.getRentalBookingById(id);
  }

  @Put('bookings/:id/status')
  updateBookingStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.hireService.updateBookingStatus(id, status);
  }

  @Put('bookings/:id/complete')
  completeBooking(@Param('id') id: string) {
    return this.hireService.completeBooking(id);
  }

  @Put('bookings/:id/cancel')
  cancelBooking(@Param('id') id: string) {
    return this.hireService.cancelBooking(id);
  }

  // ==================== INSURANCE PLANS ====================

  @Post('insurance-plans')
  @HttpCode(HttpStatus.CREATED)
  createInsurancePlan(@Body() dto: CreateInsurancePlanDto) {
    return this.hireService.createInsurancePlan(dto);
  }

  @Get('insurance-plans')
  getInsurancePlans() {
    return this.hireService.getInsurancePlans();
  }

  @Get('insurance-plans/:id')
  getInsurancePlanById(@Param('id') id: string) {
    return this.hireService.getInsurancePlanById(id);
  }

  // ==================== GPS TRACKING ====================

  @Post('gps/track')
  @HttpCode(HttpStatus.CREATED)
  recordGPSLocation(@Body() dto: GPSLocationDto) {
    return this.hireService.recordGPSLocation(dto);
  }

  @Get('gps/:vehicleId/history')
  getGPSHistory(@Param('vehicleId') vehicleId: string, @Query('limit') limit: string) {
    return this.hireService.getVehicleGPSHistory(vehicleId, +limit || 50);
  }

  @Get('gps/:vehicleId/latest')
  getLatestLocation(@Param('vehicleId') vehicleId: string) {
    return this.hireService.getLatestGPSLocation(vehicleId);
  }

  // ==================== DAMAGE REPORTS ====================

  @Post('damage-reports')
  @HttpCode(HttpStatus.CREATED)
  reportDamage(@Body() dto: ReportDamageDto) {
    return this.hireService.reportDamage(dto);
  }

  @Get('damage-reports')
  getDamageReports(@Query('vehicleId') vehicleId: string, @Query('skip') skip: string, @Query('take') take: string) {
    return this.hireService.getDamageReports(vehicleId, +skip || 0, +take || 10);
  }

  @Put('damage-reports/:id/approve')
  approveDamageReport(@Param('id') id: string) {
    return this.hireService.approveDamageReport(id);
  }

  @Put('damage-reports/:id/reject')
  rejectDamageReport(@Param('id') id: string) {
    return this.hireService.rejectDamageReport(id);
  }

  // ==================== PRICING ====================

  @Post('pricing/seasonal')
  @HttpCode(HttpStatus.CREATED)
  setSeasonalPricing(
    @Body('vehicleId') vehicleId: string,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
    @Body('dailyRate') dailyRate: number,
  ) {
    return this.hireService.setSeasonalPricing(
      vehicleId,
      new Date(startDate),
      new Date(endDate),
      dailyRate,
    );
  }

  @Get('pricing/:vehicleId')
  getPricing(@Param('vehicleId') vehicleId: string) {
    return this.hireService.getPricingForVehicle(vehicleId);
  }
}
