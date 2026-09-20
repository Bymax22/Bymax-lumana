import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateRentalBookingDto {
  @IsString()
  @IsNotEmpty()
  rentalVehicleId!: string;
  @IsString()
  @IsNotEmpty()
  userId!: string;
  @Type(() => Date)
  @IsDate()
  pickupDate!: Date;
  @Type(() => Date)
  @IsDate()
  returnDate!: Date;
  @IsString()
  @IsNotEmpty()
  pickupLocation!: string;
  @IsString()
  @IsNotEmpty()
  returnLocation!: string;
  @IsOptional()
  @IsString()
  insurancePlanId?: string;
  @IsOptional()
  @IsString()
  paymentMethod?: 'AIRTEL_MONEY' | 'MTN_MONEY' | 'MASTERCARD' | 'BANK_TRANSFER' | 'CASH';
  @IsOptional()
  @IsString()
  notes?: string;
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any> & {
    durationType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
    durationDays?: number;
  };
}
