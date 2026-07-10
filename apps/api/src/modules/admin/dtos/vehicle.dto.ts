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
  imageUrl?: string;
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
  imageUrl?: string;
  brandId?: string;
  categoryId?: string;
}
