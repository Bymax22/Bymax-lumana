'use client';

import { useCurrency } from '@/context/CurrencyContext';

interface VehicleGridProps {
  vehicles: any[];
  errorMessage: string;
}

export default function VehicleGrid({ vehicles, errorMessage }: VehicleGridProps) {
  const { formatAmount } = useCurrency();

  if (errorMessage) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load vehicles: {errorMessage}</div>;
  }

  if (vehicles.length === 0) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No vehicles found yet. Add vehicles in the admin panel to see them here.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle) => {
        const price = vehicle.auctions?.[0]?.currentPrice;
        return (
          <div key={vehicle.id} className="rounded-[24px] bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase text-slate-500">{vehicle.condition || 'Unknown'}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{vehicle.year || '—'} {vehicle.make || 'Unknown'} {vehicle.model || ''}</h2>
              </div>
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs uppercase text-white">Vehicle</span>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p><span className="font-semibold text-white">VIN:</span> {vehicle.vin || 'N/A'}</p>
              <p><span className="font-semibold text-white">Mileage:</span> {vehicle.mileage ?? 'N/A'}</p>
              <p><span className="font-semibold text-white">Color:</span> {vehicle.color || 'N/A'}</p>
              <p><span className="font-semibold text-white">Price:</span> {price ? formatAmount(price) : 'N/A'}</p>
              <p><span className="font-semibold text-white">Dealer:</span> {vehicle.dealer?.name || 'Unassigned'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
