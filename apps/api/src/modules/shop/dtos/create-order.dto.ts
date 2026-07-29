export class CreateOrderDto {
  userId!: string;
  shippingAddress!: string;
  paymentMethod?: 'AIRTEL_MONEY' | 'MTN_MONEY' | 'MASTERCARD' | 'BANK_TRANSFER' | 'CASH';
  notes?: string;
}
