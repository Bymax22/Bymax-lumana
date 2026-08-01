export class CreateRentalBookingDto {
  rentalVehicleId!: string;
  userId!: string;
  pickupDate!: Date;
  returnDate!: Date;
  pickupLocation!: string;
  returnLocation!: string;
  insurancePlanId?: string;
  paymentMethod?: 'AIRTEL_MONEY' | 'MTN_MONEY' | 'MASTERCARD' | 'BANK_TRANSFER' | 'CASH';
  notes?: string;
  metadata?: Record<string, any> & {
    durationType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
    durationDays?: number;
  };
}
