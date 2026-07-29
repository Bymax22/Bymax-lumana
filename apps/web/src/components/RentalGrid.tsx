"use client";

import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';

interface RentalGridProps {
  vehicles: any[];
  errorMessage?: string;
}

export default function RentalGrid({ vehicles, errorMessage }: RentalGridProps) {
  const { formatAmount } = useCurrency();

  if (errorMessage) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load rentals: {errorMessage}</div>;
  }

  if (!vehicles || vehicles.length === 0) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No rental vehicles available.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((v) => (
        <div key={v.id} className="rounded-[24px] bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="mt-2 text-xl font-semibold text-white">{v.make} {v.model}</h2>
              <p className="text-sm text-slate-400">{v.year}</p>
            </div>
            <span className="rounded-full bg-amber-600 px-3 py-1 text-xs uppercase text-white">Hire</span>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p><span className="font-semibold text-white">VIN:</span> {v.vin || 'N/A'}</p>
            <p><span className="font-semibold text-white">Mileage:</span> {v.mileage ?? 'N/A'}</p>
            <p><span className="font-semibold text-white">Base Price:</span> {v.basePrice ? formatAmount(v.basePrice) : '—'}</p>
            <p className="mt-2">{v.description ? v.description.slice(0, 120) : ''}</p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Link href={`/hire/${v.id}`} className="rounded bg-gray-800 px-4 py-2 text-sm">View</Link>
            <button
              onClick={() => alert('Proceed to booking on the vehicle page')}
              className="ml-2 rounded bg-emerald-600 px-4 py-2 text-sm text-white"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
