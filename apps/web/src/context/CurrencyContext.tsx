'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'ZMW';

const currencyRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 148,
  AUD: 1.51,
  ZMW: 22.5,
};

const currencySymbols: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  ZMW: 'K',
};

const currencyNames: Record<CurrencyCode, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  ZMW: 'Zambian Kwacha',
};

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatAmount: (amountUsd: number) => string;
  convertAmount: (amountUsd: number) => number;
  currencyNames: Record<CurrencyCode, string>;
  currencySymbols: Record<CurrencyCode, string>;
  currencyRates: Record<CurrencyCode, number>;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('ZMW');

  useEffect(() => {
    const saved = localStorage.getItem('lumanaCurrency') as CurrencyCode | null;
    if (saved && currencyRates[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (next: CurrencyCode) => {
    setCurrencyState(next);
    localStorage.setItem('lumanaCurrency', next);
  };

  const convertAmount = (amountUsd: number) => {
    return amountUsd * currencyRates[currency];
  };

  const formatAmount = (amountUsd: number) => {
    const converted = convertAmount(amountUsd);
    const digits = currency === 'JPY' ? 0 : 2;
    const formatted = converted.toLocaleString(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });

    return `${currencySymbols[currency]}${formatted}`;
  };

  const value = useMemo(
    () => ({ currency, setCurrency, formatAmount, convertAmount, currencyNames, currencySymbols, currencyRates }),
    [currency],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}
