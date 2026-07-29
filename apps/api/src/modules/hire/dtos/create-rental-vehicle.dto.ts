export class CreateRentalVehicleDto {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  licensePlate: string;
  color?: string;
  transmission?: string;
  engine?: string;
  fuelType?: string;
  seatingCapacity?: number;
  basePrice: number;
  insuranceIncluded?: boolean;
  images?: string[];
  description?: string;
  location?: string;
  gpsDeviceId?: string;
}
