'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/publicApi';

export default function SellerDashboard() {
  const [vehicleCount, setVehicleCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const vehicles = await publicApi('/vehicles');
        setVehicleCount(Array.isArray(vehicles) ? Math.min(vehicles.length, 10) : 0);
        setError('');
      } catch (loadError) {
        console.error('Failed to load seller dashboard', loadError);
        setError('Dashboard data could not be refreshed.');
      } finally {
        setLoading(false);
      }
    }

    void load();
    const intervalId = window.setInterval(() => void load(), 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold">Seller Dashboard</h2>
        <p className="text-slate-400">Live overview</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded bg-[#121212] p-4">
            <div className="text-sm text-slate-400">My Vehicles</div>
            <div className="text-xl font-bold">{loading ? '...' : vehicleCount}</div>
          </div>
          <div className="rounded bg-[#121212] p-4">
            <div className="text-sm text-slate-400">Recent Orders</div>
            <div className="text-xl font-bold">0</div>
          </div>
        </div>

        {error ? <p className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{error}</p> : null}
        <div className="mt-6">
          <Link href="/seller/vehicles" className="rounded bg-yellow-500 px-4 py-2 text-black">Manage Vehicles</Link>
        </div>
      </div>
    </section>
  );
}import Link from 'next/link';
import { publicApi } from '@/lib/publicApi';

export default async function SellerDashboard() {
  const vehicles = await publicApi('/vehicles').catch(() => []);
  const myVehicles = Array.isArray(vehicles) ? vehicles.slice(0, 10) : [];

  return (
    <section className="space-y-6">
      <div className="rounded bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold">Seller Dashboard</h2>
        <p className="text-slate-400">Quick overview</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded bg-[#121212] p-4">
            <div className="text-sm text-slate-400">My Vehicles</div>
            <div className="text-xl font-bold">{myVehicles.length}</div>
          </div>
          <div className="rounded bg-[#121212] p-4">
            <div className="text-sm text-slate-400">Recent Orders</div>
            <div className="text-xl font-bold">0</div>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/seller/vehicles" className="rounded bg-yellow-500 px-4 py-2 text-black">Manage Vehicles</Link>
        </div>
      </div>
    </section>
  );
}
