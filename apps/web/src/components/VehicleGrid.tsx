'use client';

import { useCurrency } from '@/context/CurrencyContext';

interface VehicleGridProps {
  vehicles: any[];
  errorMessage: string;
}

function normalizeVehiclePayload(payload: unknown): any[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as Record<string, unknown>;
    const nested = candidate.data ?? candidate.items ?? candidate.results;
    if (Array.isArray(nested)) {
      return nested;
    }
  }

  return [];
}

function getVehicleImageUrl(vehicle: any): string | null {
  if (!vehicle) {
    return null;
  }

  const direct = vehicle.imageUrl ?? vehicle.thumbnail ?? vehicle.coverImage ?? vehicle.image ?? vehicle.mainImage;
  if (typeof direct === 'string' && direct.trim()) {
    return direct;
  }

  if (direct && typeof direct === 'object') {
    const nestedUrl = direct.url ?? direct.secure_url ?? direct.src;
    if (typeof nestedUrl === 'string' && nestedUrl.trim()) {
      return nestedUrl;
    }
  }

  const gallery = vehicle.images ?? vehicle.imageUrls ?? vehicle.gallery ?? [];
  if (Array.isArray(gallery)) {
    const first = gallery[0];
    if (typeof first === 'string' && first.trim()) {
      return first;
    }
    if (first && typeof first === 'object') {
      const nestedUrl = first.url ?? first.secure_url ?? first.src;
      if (typeof nestedUrl === 'string' && nestedUrl.trim()) {
        return nestedUrl;
      }
    }
  }

  return null;
}

export default function VehicleGrid({ vehicles, errorMessage }: VehicleGridProps) {
  const { formatAmount } = useCurrency();
  const normalizedVehicles = normalizeVehiclePayload(vehicles);

  if (errorMessage) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load vehicles: {errorMessage}</div>;
  }

  if (normalizedVehicles.length === 0) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No vehicles found yet.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {normalizedVehicles.map((vehicle) => {
        const price = vehicle.auctions?.[0]?.currentPrice;
        const imageUrl = getVehicleImageUrl(vehicle);

        return (
          <div key={vehicle.id} className="overflow-hidden rounded-[24px] bg-[#121212] shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            <div className="relative h-48 overflow-hidden bg-[#0d0d0d]">
              {imageUrl ? (
                <img src={imageUrl} alt={`${vehicle.make || 'Vehicle'} ${vehicle.model || ''}`} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1f1f1f] via-[#111] to-[#0d0d0d] text-sm uppercase tracking-[0.2em] text-slate-500">
                  No Image
                </div>
              )}
            </div>

            <div className="p-6">
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
          </div>
        );
      })}
    </div>
  );
}
