import { Type, Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { RentalVehicleStatus } from '@prisma/client';

export class CreateRentalVehicleDto {
  @IsString()
  @IsNotEmpty()
  vin!: string;
  @IsString()
  @IsNotEmpty()
  make!: string;
  @IsString()
  @IsNotEmpty()
  model!: string;
  @Type(() => Number)
  @IsNumber()
  year!: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mileage?: number;
  @IsString()
  @IsNotEmpty()
  licensePlate!: string;
  @IsOptional()
  @IsString()
  color?: string;
  @IsOptional()
  @IsString()
  transmission?: string;
  @IsOptional()
  @IsString()
  engine?: string;
  @IsOptional()
  @IsString()
  fuelType?: string;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  seatingCapacity?: number;
  @IsOptional()
  @IsEnum(RentalVehicleStatus)
  status?: RentalVehicleStatus;
  @Type(() => Number)
  @IsNumber()
  basePrice!: number;
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === '1')
  @IsBoolean()
  insuranceIncluded?: boolean;
  @IsOptional()
  @IsString({ each: true })
  images?: string[];
  @IsOptional()
  @IsString()
  existingImages?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  location?: string;
  @IsOptional()
  @IsString()
  gpsDeviceId?: string;
}
