export class CreatePaymentDto {
  userId!: string;
  amount!: number;
  currency?: string;
  provider!: 'AIRTEL_MONEY' | 'MTN_MONEY' | 'MASTERCARD' | 'BANK_TRANSFER' | 'CASH';
  providerRef?: string;
  orderId?: string;
  rentalBookingId?: string;
  metadata?: Record<string, any>;
}
