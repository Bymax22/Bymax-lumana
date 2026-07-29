export class ReportDamageDto {
  rentalVehicleId: string;
  bookingId?: string;
  damageLevel: 'MINOR' | 'MODERATE' | 'SEVERE' | 'TOTAL_LOSS';
  description: string;
  location?: string;
  photos?: string[];
  estimatedCost?: number;
}
