"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { publicApi } from '@/lib/publicApi';
import ShareButton from '@/components/ShareButton';
import { getFirstMediaUrl } from '@/lib/media';

interface RentalGridProps {
  vehicles: any[];
  errorMessage?: string;
}

export default function RentalGrid({ vehicles, errorMessage }: RentalGridProps) {
  const { formatAmount } = useCurrency();
  const [liveVehicles, setLiveVehicles] = useState(vehicles);

  useEffect(() => {
    setLiveVehicles(vehicles);
  }, [vehicles]);

  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await publicApi('/hire/vehicles?take=24');
        const nextVehicles = Array.isArray(response) ? response : response?.data || [];
        setLiveVehicles(nextVehicles);
      } catch {
        // Keep the last successful fleet list visible when a refresh fails.
      }
    };
    const intervalId = window.setInterval(() => void refresh(), 15000);
    return () => window.clearInterval(intervalId);
  }, []);

  if (errorMessage) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load rentals: {errorMessage}</div>;
  }

  if (!liveVehicles || liveVehicles.length === 0) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No rental vehicles available.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {liveVehicles.map((v) => {
        const imageUrl = getFirstMediaUrl(v);
        return <div key={v.id} className="min-w-0 overflow-hidden rounded-[24px] bg-[#121212] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-6">
          <div className="mb-5 h-44 w-full overflow-hidden rounded-[18px] bg-[#0d0d0d]">
            {imageUrl ? <img src={imageUrl} alt={`${v.make} ${v.model}`} className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center text-sm text-slate-500">No image available</div>}
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="mt-2 text-xl font-semibold text-white">{v.make} {v.model}</h2>
              <p className="text-sm text-slate-400">{v.year}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs uppercase text-white ${v.status === 'AVAILABLE' ? 'bg-emerald-600' : 'bg-slate-700'}`}>{v.status === 'AVAILABLE' ? 'Available' : v.status || 'Unavailable'}</span>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p><span className="font-semibold text-white">VIN:</span> {v.vin || 'N/A'}</p>
            <p><span className="font-semibold text-white">Mileage:</span> {v.mileage ?? 'N/A'}</p>
            <p><span className="font-semibold text-white">Base Price:</span> {v.basePrice ? formatAmount(v.basePrice) : '—'}</p>
            <p className="mt-2">{v.description ? v.description.slice(0, 120) : ''}</p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <ShareButton title={`${v.make} ${v.model} rental`} description={`${v.year || ''} rental vehicle available in ${v.location || 'Lusaka'}.`} details={[`Mileage: ${v.mileage ?? 'Not specified'}`, `Location: ${v.location || 'Lusaka'}`, `Base price: ${v.basePrice ?? 'Contact Lumana'}/day`, `Status: ${v.status || 'Available'}`]} imageUrl={imageUrl || undefined} url={`/hire/${v.id}`} />
              <div className="flex flex-wrap items-center justify-end gap-3">
            <Link href={`/hire/${v.id}`} className="rounded bg-gray-800 px-4 py-2 text-sm">View</Link>
            <Link href={`/hire/${v.id}`} className="ml-2 rounded bg-emerald-600 px-4 py-2 text-sm text-white">Book Now</Link>
            </div>
          </div>
        </div>;
      })}
    </div>
  );
}
