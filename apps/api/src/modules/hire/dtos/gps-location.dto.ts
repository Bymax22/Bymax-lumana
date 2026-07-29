export class GPSLocationDto {
  rentalVehicleId!: string;
  latitude!: number;
  longitude!: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
}
