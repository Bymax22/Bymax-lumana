'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ConvertedAmount from '@/components/ConvertedAmount';
import { publicApi } from '@/lib/publicApi';
import { getStoredSessionToken } from '@/lib/auth';

type VehicleCardProps = {
  vehicle: any;
  compact?: boolean;
};

function getImages(vehicle: any): string[] {
  const gallery = Array.isArray(vehicle?.images) ? vehicle.images : [];
  return gallery
    .map((image: any) => typeof image === 'string' ? image : image?.url || image?.secure_url || image?.src)
    .filter((url: unknown): url is string => typeof url === 'string' && Boolean(url.trim()));
}

export default function VehicleCard({ vehicle, compact = false }: VehicleCardProps) {
  const images = useMemo(() => getImages(vehicle), [vehicle]);
  const [activeImage, setActiveImage] = useState(images[0] || '');
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setActiveImage(images[0] || '');
  }, [images]);

  useEffect(() => {
    const syncSavedState = async () => {
      try {
        const endpoint = getStoredSessionToken() ? `/vehicles/${vehicle.id}/save-status` : `/vehicles/${vehicle.id}/save-count`;
        const result = await publicApi<{ count: number; saved?: boolean }>(endpoint);
        setSaveCount(result.count);
        if (typeof result.saved === 'boolean') setSaved(result.saved);
      } catch {
        // Counts remain at their last known value if the API is unavailable.
      }
    };

    syncSavedState();
    window.addEventListener('storage', syncSavedState);
    window.addEventListener('vehicle-saved', syncSavedState);
    return () => {
      window.removeEventListener('storage', syncSavedState);
      window.removeEventListener('vehicle-saved', syncSavedState);
    };
  }, [vehicle.id]);

  async function toggleSaved(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!getStoredSessionToken()) {
      setSaveMessage('Log in to save');
      window.setTimeout(() => setSaveMessage(''), 2200);
      return;
    }

    try {
      const result = await publicApi<{ count: number; saved: boolean }>(`/vehicles/${vehicle.id}/save`, { method: 'POST' });
      setSaved(result.saved);
      setSaveCount(result.count);
      setSaveMessage(result.saved ? 'Saved' : 'Removed');
      window.setTimeout(() => setSaveMessage(''), 1800);
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : 'Unable to save');
      window.setTimeout(() => setSaveMessage(''), 2200);
    }
  }

  const coverImage = activeImage || images[0];
  const price = vehicle.price ? <ConvertedAmount amountUsd={Number(vehicle.price)} /> : 'Contact';

  return (
    <article className={`group overflow-hidden rounded-[20px] bg-[#111111] shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-1 ${compact ? 'w-48 flex-shrink-0' : ''}`}>
      <Link href={`/vehicles/${vehicle.id}`} className="block">
        <div className={`relative overflow-hidden bg-[#0d0d0d] ${compact ? 'h-24' : 'h-48'}`}>
          {coverImage ? <img src={coverImage} alt={`${vehicle.make || 'Vehicle'} ${vehicle.model || ''}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-slate-500">No Image</div>}
          <div className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ${vehicle.status === 'SOLD' ? 'bg-slate-700/95' : 'bg-red-600/90'}`}>{vehicle.status === 'SOLD' ? 'Sold' : vehicle.condition || 'Featured'}</div>
        </div>
        {images.length > 1 && !compact ? <div className="flex gap-1.5 bg-[#0d0d0d] p-2">{images.slice(0, 4).map((image) => <button key={image} type="button" onClick={(event) => { event.preventDefault(); setActiveImage(image); }} className={`h-10 w-12 overflow-hidden rounded-md ${activeImage === image ? 'opacity-100' : 'opacity-55 hover:opacity-90'}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div> : null}
        <div className={compact ? 'p-3' : 'p-4'}>
          <div className="flex items-start justify-between gap-2"><div><h3 className="text-base font-semibold text-white">{vehicle.make} {vehicle.model}</h3><p className="text-sm text-slate-400">{vehicle.year || '—'} {vehicle.mileage ? `· ${Number(vehicle.mileage).toLocaleString()} km` : ''}</p></div><span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-yellow-400">View</span></div>
          <div className="mt-3 flex items-center justify-between"><p className={`text-sm font-semibold ${vehicle.status === 'SOLD' ? 'text-slate-500' : 'text-red-400'}`}>{vehicle.status === 'SOLD' ? 'Sold' : price}</p><span className="text-xs text-slate-500">{saveCount} saved</span></div>
        </div>
      </Link>
      <div className="flex items-center justify-between bg-[#0d0d0d] px-4 py-2"><button type="button" onClick={(event) => void toggleSaved(event)} className={`flex items-center gap-1.5 text-xs transition ${saved ? 'text-red-300' : 'text-slate-500 hover:text-white'}`} aria-label={saved ? 'Remove from saved vehicles' : 'Save vehicle'}><Heart size={15} fill={saved ? 'currentColor' : 'none'} /> {saveMessage || (saved ? 'Saved' : 'Save')}</button><span className="text-[11px] text-slate-600">{saveCount} {saveCount === 1 ? 'save' : 'saves'}</span></div>
    </article>
  );
}