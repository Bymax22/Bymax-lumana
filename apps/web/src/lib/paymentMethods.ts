export const paymentMethods = [
  { value: 'MASTERCARD', label: 'Mastercard' },
  { value: 'AIRTEL_MONEY', label: 'Airtel Money' },
  { value: 'MTN_MONEY', label: 'MTN Money' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CASH', label: 'Cash Payment' },
] as const;

export type PaymentMethod = (typeof paymentMethods)[number]['value'];

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  MASTERCARD: 'Mastercard',
  AIRTEL_MONEY: 'Airtel Money',
  MTN_MONEY: 'MTN Money',
  BANK_TRANSFER: 'Bank Transfer',
  CASH: 'Cash Payment',
};
