import type { VehicleCondition } from '@prisma/client';

export class CreateVehicleDto {
  make!: string;
  model!: string;
  year!: number;
  price!: number;
  mileage!: number;
  fuelType?: string;
  transmission?: string;
  color?: string;
  vin!: string;
  trim?: string;
  condition?: VehicleCondition;
  engine?: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  brandId!: string;
  categoryId!: string;
  dealerId!: string;
}

export class UpdateVehicleDto {
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  color?: string;
  vin?: string;
  trim?: string;
  condition?: VehicleCondition;
  engine?: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  brandId?: string;
  categoryId?: string;
}
