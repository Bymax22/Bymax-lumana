'use client';

import { useCurrency } from '@/context/CurrencyContext';

interface ConvertedAmountProps {
  amountUsd: number;
}

export default function ConvertedAmount({ amountUsd }: ConvertedAmountProps) {
  const { formatAmount } = useCurrency();

  return <>{formatAmount(amountUsd)}</>;
}
