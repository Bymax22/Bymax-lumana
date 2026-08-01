'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Edit3, RefreshCcw, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  createdAt: string;
  brand?: { name: string } | null;
  category?: { name: string } | null;
  images?: Array<{ url: string }> | null;
}

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchVehicles();
    const timer = window.setInterval(() => {
      void fetchVehicles();
    }, 15000);

    return () => window.clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const total = vehicles.length;
    const avgPrice = total
      ? Math.round(vehicles.reduce((sum, vehicle) => sum + Number(vehicle.price || 0), 0) / total)
      : 0;

    return {
      total,
      avgPrice,
      newest: vehicles[0],
    };
  }, [vehicles]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await adminApi('/admin/vehicles?skip=0&take=50');
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await adminApi(`/admin/vehicles/${id}`, { method: 'DELETE' });
      setVehicles((current) => current.filter((vehicle) => vehicle.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vehicle');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">Vehicle management</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Inventory overview</h1>
            <p className="mt-2 text-sm text-slate-400">Review listings, inspect the latest stock, and keep the catalog looking polished.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => void fetchVehicles()} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500 hover:text-white">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
            <Link href="/admin/vehicles/new" className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
              + Add vehicle
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Total vehicles</p>
          <p className="mt-3 text-3xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Average listing price</p>
          <p className="mt-3 text-3xl font-semibold text-white">${stats.avgPrice.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Newest addition</p>
          <p className="mt-3 text-lg font-semibold text-white">
            {stats.newest ? `${stats.newest.make} ${stats.newest.model}` : 'No vehicles yet'}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">Loading vehicles…</div>
      ) : vehicles.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">No vehicles found.</div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-950/80">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Brand / Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Mileage</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-800/60">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/70 text-xs text-slate-400">
                        {vehicle.images?.[0]?.url ? (
                          <img src={vehicle.images[0].url} alt={`${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" />
                        ) : (
                          'IMG'
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{vehicle.make} {vehicle.model}</p>
                        <p className="text-sm text-slate-400">{vehicle.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    <div>{vehicle.brand?.name || 'Unassigned'}</div>
                    <div>{vehicle.category?.name || 'Unassigned'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">${Number(vehicle.price || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{Number(vehicle.mileage || 0).toLocaleString()} mi</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/vehicles/${vehicle.id}`} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 transition hover:border-red-500 hover:text-white">
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Link>
                      <button onClick={() => void handleDelete(vehicle.id)} className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/20">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
