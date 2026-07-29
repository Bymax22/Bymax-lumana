'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Car, ClipboardList, ShieldCheck } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

type RentalVehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  basePrice: number;
  location?: string;
  description?: string;
  status?: string;
  isAvailable?: boolean;
};

type RentalBooking = {
  id: string;
  status: string;
  totalAmount?: number;
  vehicle?: { make: string; model: string };
  customer?: { name?: string; email?: string };
};

type InsurancePlan = {
  id: string;
  name: string;
  price: number;
};

export default function RentalsAdminPage() {
  const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
  const [bookings, setBookings] = useState<RentalBooking[]>([]);
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    make: '',
    model: '',
    year: '2025',
    basePrice: '120',
    location: 'Lagos',
    licensePlate: '',
    description: '',
  });

  async function loadData() {
    try {
      const [vehiclesRes, bookingsRes, plansRes] = await Promise.all([
        publicApi('/hire/vehicles?take=20'),
        publicApi('/hire/bookings/admin?take=20'),
        publicApi('/hire/insurance-plans'),
      ]);

      setVehicles(normalizeList(vehiclesRes));
      setBookings(normalizeList(bookingsRes?.data || bookingsRes));
      setPlans(normalizeList(plansRes));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load rental data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleCreateVehicle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        vin: `VIN-${Date.now()}`,
        make: form.make,
        model: form.model,
        year: Number(form.year),
        mileage: 0,
        licensePlate: form.licensePlate,
        basePrice: Number(form.basePrice),
        insuranceIncluded: true,
        images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80'],
        description: form.description,
        location: form.location,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        seatingCapacity: 5,
      };

      const created = await publicApi('/hire/vehicles', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setVehicles((current) => [created, ...current]);
      setForm({
        make: '',
        model: '',
        year: '2025',
        basePrice: '120',
        location: 'Lagos',
        licensePlate: '',
        description: '',
      });
      setMessage('Rental vehicle created successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create rental vehicle.');
    } finally {
      setSaving(false);
    }
  }

  async function handleBookingStatus(id: string, status: string) {
    try {
      const updated = await publicApi(`/hire/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setBookings((current) => current.map((booking) => (booking.id === id ? { ...booking, status: updated.status } : booking)));
      setMessage('Booking status updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update booking status.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to admin
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-red-400">Rental operations</p>
              <h1 className="mt-2 text-3xl font-semibold">Manage rental inventory and bookings</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">Create vehicles, monitor live bookings, and manage insurance plans from one place.</p>
            </div>
          </div>
        </div>

        {message ? <div className="rounded-2xl border border-red-700/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{message}</div> : null}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Car className="h-5 w-5 text-red-400" />
              Add rental vehicle
            </div>

            <form onSubmit={handleCreateVehicle} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Make" required />
                <input value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Model" required />
                <input value={form.year} type="number" onChange={(event) => setForm({ ...form, year: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Year" required />
                <input value={form.basePrice} type="number" onChange={(event) => setForm({ ...form, basePrice: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Base price" required />
                <input value={form.licensePlate} onChange={(event) => setForm({ ...form, licensePlate: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="License plate" required />
                <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Location" required />
              </div>
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-[100px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Description" />
              <button type="submit" disabled={saving} className="rounded-2xl bg-red-500 px-5 py-3 font-medium text-white disabled:opacity-60">
                {saving ? 'Creating…' : 'Create vehicle'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <ShieldCheck className="h-5 w-5 text-red-400" />
              Insurance plans
            </div>
            <div className="mt-6 space-y-3">
              {plans.length === 0 ? <p className="text-sm text-slate-400">No insurance plans available yet.</p> : plans.map((plan) => (
                <div key={plan.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-100">{plan.name}</p>
                      <p className="text-sm text-slate-400">Admin-managed coverage package</p>
                    </div>
                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-300">${plan.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Car className="h-5 w-5 text-red-400" />
              Rental inventory
            </div>
            {loading ? <p className="mt-6 text-sm text-slate-400">Loading vehicles…</p> : null}
            <div className="mt-6 space-y-3">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-100">{vehicle.make} {vehicle.model}</p>
                      <p className="text-sm text-slate-400">{vehicle.location || 'Location not set'} • ${vehicle.basePrice}/day</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm ${vehicle.isAvailable === false ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'}`}>
                      {vehicle.isAvailable === false ? 'Unavailable' : 'Available'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <ClipboardList className="h-5 w-5 text-red-400" />
              Booking queue
            </div>
            <div className="mt-6 space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-100">{booking.vehicle?.make || 'Rental'} {booking.vehicle?.model || ''}</p>
                      <p className="text-sm text-slate-400">{booking.customer?.name || 'Customer'} • {booking.customer?.email || 'No email'}</p>
                    </div>
                    <select value={booking.status} onChange={(event) => void handleBookingStatus(booking.id, event.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeList(payload: any): any[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
}
