"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicApi } from '@/lib/publicApi';

export default function SavedPage() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    publicApi('/vehicles/saved').then((vehicles) => setList(Array.isArray(vehicles) ? vehicles : [])).catch(() => setList([]));
  }, []);

  async function remove(id: string) {
    try {
      await publicApi(`/vehicles/${id}/save`, { method: 'POST' });
      setList((current) => current.filter((vehicle) => vehicle.id !== id));
    } catch {
      // Keep the saved list visible if the request fails.
    }
  }

  return (
    <section className="p-6">
      <div className="rounded bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold">Saved Vehicles</h2>
        <p className="text-slate-400">Your favorites will appear here.</p>

        <div className="mt-6 space-y-3">
          {list.length === 0 ? (
            <div className="text-sm text-slate-400">No saved vehicles yet.</div>
          ) : (
            list.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between rounded bg-[#0b0b0b] p-3">
                <Link href={`/vehicles/${vehicle.id}`} className="text-white">{vehicle.make} {vehicle.model}</Link>
                <button onClick={() => void remove(vehicle.id)} className="text-sm text-red-400">Remove</button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
