export class CreateRentalBookingDto {
  rentalVehicleId!: string;
  userId!: string;
  pickupDate!: Date;
  returnDate!: Date;
  pickupLocation!: string;
  returnLocation!: string;
  insurancePlanId?: string;
  notes?: string;
  metadata?: Record<string, any>;
}
