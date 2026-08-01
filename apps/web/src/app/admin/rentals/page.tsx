'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Car, ClipboardList, MapPinned, ShieldCheck } from 'lucide-react';
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
  licensePlate?: string;
  vin?: string;
  isAvailable?: boolean;
};

type RentalBooking = {
  id: string;
  status: string;
  totalPrice?: number;
  vehicle?: { make: string; model: string; id?: string };
  customer?: { name?: string; email?: string };
  pickupDate?: string;
  returnDate?: string;
  metadata?: Record<string, any>;
};

type InsurancePlan = {
  id: string;
  name: string;
  dailyPrice?: number;
  price?: number;
};

type UserOption = {
  id: string;
  name?: string;
  email?: string;
};

export default function RentalsAdminPage() {
  const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
  const [bookings, setBookings] = useState<RentalBooking[]>([]);
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [trackingVehicleId, setTrackingVehicleId] = useState<string>('');
  const [trackingLocation, setTrackingLocation] = useState<any>(null);
  const [vehicleEditingId, setVehicleEditingId] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: '2025',
    basePrice: '120',
    location: 'Lagos',
    licensePlate: '',
    description: '',
    status: 'AVAILABLE',
  });
  const [bookingForm, setBookingForm] = useState({
    vehicleId: '',
    userId: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: 'Lagos HQ',
    returnLocation: 'Lagos HQ',
    insurancePlanId: '',
    paymentMethod: 'BANK_TRANSFER',
    notes: '',
    durationType: 'DAILY',
    durationDays: '1',
  });

  const fleetSummary = useMemo(() => {
    const activeCount = vehicles.filter((vehicle) => vehicle.status === 'AVAILABLE' || vehicle.status === 'BOOKED').length;
    const maintenanceCount = vehicles.filter((vehicle) => vehicle.status === 'MAINTENANCE').length;
    const bookedCount = vehicles.filter((vehicle) => vehicle.status === 'BOOKED').length;
    return { total: vehicles.length, active: activeCount, booked: bookedCount, maintenance: maintenanceCount };
  }, [vehicles]);

  async function loadData() {
    try {
      const [vehiclesRes, bookingsRes, plansRes, usersRes] = await Promise.all([
        publicApi('/hire/vehicles?take=20'),
        publicApi('/hire/bookings/admin?take=20'),
        publicApi('/hire/insurance-plans'),
        publicApi('/admin/users?take=20').catch(() => ({ data: [] })),
      ]);

      const normalizedVehicles = normalizeList(vehiclesRes);
      const normalizedBookings = normalizeList(bookingsRes?.data || bookingsRes);
      const normalizedPlans = normalizeList(plansRes);
      const normalizedUsers = normalizeList(usersRes?.data || usersRes);

      setVehicles(normalizedVehicles);
      setBookings(normalizedBookings);
      setPlans(normalizedPlans);
      setUsers(normalizedUsers);
      if (!bookingForm.userId && normalizedUsers[0]?.id) {
        setBookingForm((current) => ({ ...current, userId: normalizedUsers[0].id }));
      }
      if (!trackingVehicleId && normalizedVehicles[0]?.id) {
        setTrackingVehicleId(normalizedVehicles[0].id);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load rental data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function loadTracking(vehicleId: string) {
    try {
      const tracking = await publicApi(`/hire/gps/${vehicleId}/latest`);
      setTrackingLocation(tracking);
    } catch {
      setTrackingLocation(null);
    }
  }

  async function handleCreateVehicle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('vin', `VIN-${Date.now()}`);
      formData.append('make', vehicleForm.make);
      formData.append('model', vehicleForm.model);
      formData.append('year', String(Number(vehicleForm.year)));
      formData.append('mileage', '0');
      formData.append('licensePlate', vehicleForm.licensePlate);
      formData.append('basePrice', String(Number(vehicleForm.basePrice)));
      formData.append('insuranceIncluded', 'true');
      formData.append('description', vehicleForm.description);
      formData.append('location', vehicleForm.location);
      formData.append('fuelType', 'Petrol');
      formData.append('transmission', 'Automatic');
      formData.append('seatingCapacity', '5');
      formData.append('status', vehicleForm.status);
      images.forEach((image) => formData.append('images', image));

      let created: RentalVehicle;
      if (vehicleEditingId) {
        created = await publicApi(`/hire/vehicles/${vehicleEditingId}`, {
          method: 'PUT',
          body: formData,
        });
        setVehicles((current) => current.map((vehicle) => (vehicle.id === vehicleEditingId ? { ...vehicle, ...created } : vehicle)));
      } else {
        created = await publicApi('/hire/vehicles', {
          method: 'POST',
          body: formData,
        });
        setVehicles((current) => [created, ...current]);
      }

      resetVehicleForm();
      setMessage(vehicleEditingId ? 'Fleet vehicle updated successfully.' : 'Fleet vehicle created successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save fleet vehicle.');
    } finally {
      setSaving(false);
    }
  }

  async function handleBookingCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        rentalVehicleId: bookingForm.vehicleId,
        userId: bookingForm.userId || users[0]?.id,
        pickupDate: new Date(bookingForm.pickupDate).toISOString(),
        returnDate: new Date(bookingForm.returnDate).toISOString(),
        pickupLocation: bookingForm.pickupLocation,
        returnLocation: bookingForm.returnLocation,
        insurancePlanId: bookingForm.insurancePlanId || undefined,
        paymentMethod: bookingForm.paymentMethod,
        notes: bookingForm.notes,
        metadata: {
          durationType: bookingForm.durationType,
          durationDays: Number(bookingForm.durationDays || 1),
        },
      };

      const created = await publicApi('/hire/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setBookings((current) => [created, ...current]);
      setMessage(`Booking ${created.bookingRef || 'created'} for ${bookingForm.durationType.toLowerCase()} rental.`);
      setBookingForm((current) => ({ ...current, pickupDate: '', returnDate: '', notes: '' }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create booking.');
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

  function resetVehicleForm() {
    setVehicleForm({ make: '', model: '', year: '2025', basePrice: '120', location: 'Lagos', licensePlate: '', description: '', status: 'AVAILABLE' });
    setVehicleEditingId(null);
    setImages([]);
  }

  function startEditVehicle(vehicle: RentalVehicle) {
    setVehicleEditingId(vehicle.id);
    setVehicleForm({
      make: vehicle.make,
      model: vehicle.model,
      year: String(vehicle.year || 2025),
      basePrice: String(vehicle.basePrice || 0),
      location: vehicle.location || 'Lagos',
      licensePlate: vehicle.licensePlate || '',
      description: vehicle.description || '',
      status: vehicle.status || 'AVAILABLE',
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to admin
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <p className="text-sm uppercase tracking-[0.3em] text-red-400">Rental operations</p>
          <h1 className="mt-2 text-3xl font-semibold">Professional fleet and booking control</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-400">Create and edit fleet vehicles, assign booking durations in daily, weekly, monthly, or custom packages, and monitor live GPS tracking from the admin panel.</p>
        </div>

        {message ? <div className="rounded-2xl border border-red-700/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{message}</div> : null}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Total fleet</p>
            <p className="mt-2 text-3xl font-semibold text-slate-100">{fleetSummary.total}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Available / active</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-300">{fleetSummary.active}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Maintenance</p>
            <p className="mt-2 text-3xl font-semibold text-amber-300">{fleetSummary.maintenance}</p>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Car className="h-5 w-5 text-red-400" />
                {vehicleEditingId ? 'Edit fleet vehicle' : 'Add fleet vehicle'}
              </div>

              <form onSubmit={handleCreateVehicle} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input value={vehicleForm.make} onChange={(event) => setVehicleForm({ ...vehicleForm, make: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Make" required />
                  <input value={vehicleForm.model} onChange={(event) => setVehicleForm({ ...vehicleForm, model: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Model" required />
                  <input value={vehicleForm.year} type="number" onChange={(event) => setVehicleForm({ ...vehicleForm, year: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Year" required />
                  <input value={vehicleForm.basePrice} type="number" onChange={(event) => setVehicleForm({ ...vehicleForm, basePrice: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Base price" required />
                  <input value={vehicleForm.licensePlate} onChange={(event) => setVehicleForm({ ...vehicleForm, licensePlate: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="License plate" required />
                  <input value={vehicleForm.location} onChange={(event) => setVehicleForm({ ...vehicleForm, location: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Location" required />
                </div>
                <textarea value={vehicleForm.description} onChange={(event) => setVehicleForm({ ...vehicleForm, description: event.target.value })} className="min-h-[100px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Description" />
                <div className="grid gap-4 md:grid-cols-2">
                  <select value={vehicleForm.status} onChange={(event) => setVehicleForm({ ...vehicleForm, status: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="BOOKED">BOOKED</option>
                    <option value="IN_USE">IN_USE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="DAMAGED">DAMAGED</option>
                    <option value="RETIRED">RETIRED</option>
                  </select>
                  <input type="file" multiple accept="image/*" onChange={(event) => setImages(Array.from(event.target.files || []))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={saving} className="rounded-2xl bg-red-500 px-5 py-3 font-medium text-white disabled:opacity-60">
                    {saving ? 'Saving…' : vehicleEditingId ? 'Save vehicle' : 'Create vehicle'}
                  </button>
                  {vehicleEditingId ? <button type="button" onClick={resetVehicleForm} className="rounded-2xl border border-slate-700 px-5 py-3 text-sm text-slate-300">Cancel</button> : null}
                </div>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <MapPinned className="h-5 w-5 text-red-400" />
                Fleet tracking
              </div>
              <div className="mt-4">
                <select value={trackingVehicleId} onChange={(event) => {
                  const vehicleId = event.target.value;
                  setTrackingVehicleId(vehicleId);
                  if (vehicleId) void loadTracking(vehicleId);
                }} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>{vehicle.make} {vehicle.model}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
                {trackingLocation ? (
                  <>
                    <p><span className="font-semibold text-white">Latest signal:</span> {trackingLocation.latitude}, {trackingLocation.longitude}</p>
                    <p className="mt-2 text-slate-400">Recorded {trackingLocation.timestamp ? new Date(trackingLocation.timestamp).toLocaleString() : 'recently'}</p>
                  </>
                ) : (
                  <p className="text-slate-400">No tracking signal available yet for this vehicle.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <ClipboardList className="h-5 w-5 text-red-400" />
                Create booking with package duration
              </div>
              <form onSubmit={handleBookingCreate} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <select value={bookingForm.vehicleId} onChange={(event) => setBookingForm({ ...bookingForm, vehicleId: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" required>
                    <option value="">Select vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>{vehicle.make} {vehicle.model}</option>
                    ))}
                  </select>
                  <select value={bookingForm.userId} onChange={(event) => setBookingForm({ ...bookingForm, userId: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" required>
                    <option value="">Select customer</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>{user.name || user.email || user.id}</option>
                    ))}
                  </select>
                  <input value={bookingForm.pickupDate} type="datetime-local" onChange={(event) => setBookingForm({ ...bookingForm, pickupDate: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" required />
                  <input value={bookingForm.returnDate} type="datetime-local" onChange={(event) => setBookingForm({ ...bookingForm, returnDate: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" required />
                  <input value={bookingForm.pickupLocation} onChange={(event) => setBookingForm({ ...bookingForm, pickupLocation: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Pickup location" />
                  <input value={bookingForm.returnLocation} onChange={(event) => setBookingForm({ ...bookingForm, returnLocation: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Return location" />
                  <select value={bookingForm.durationType} onChange={(event) => setBookingForm({ ...bookingForm, durationType: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="CUSTOM">Custom days</option>
                  </select>
                  <input value={bookingForm.durationDays} type="number" min="1" onChange={(event) => setBookingForm({ ...bookingForm, durationDays: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Days / weeks / months" />
                </div>
                <select value={bookingForm.insurancePlanId} onChange={(event) => setBookingForm({ ...bookingForm, insurancePlanId: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                  <option value="">No insurance</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
                </select>
                <textarea value={bookingForm.notes} onChange={(event) => setBookingForm({ ...bookingForm, notes: event.target.value })} className="min-h-[100px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" placeholder="Notes" />
                <button type="submit" disabled={saving} className="rounded-2xl bg-red-500 px-5 py-3 font-medium text-white disabled:opacity-60">
                  {saving ? 'Creating…' : 'Create booking'}
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
                        <p className="text-sm text-slate-400">Added by the admin team</p>
                      </div>
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-300">${plan.dailyPrice ?? plan.price ?? 0}/day</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Car className="h-5 w-5 text-red-400" />
            Fleet inventory
          </div>
          <div className="mt-6 space-y-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-100">{vehicle.make} {vehicle.model}</p>
                    <p className="text-sm text-slate-400">{vehicle.location || 'Location not set'} • {vehicle.licensePlate || 'No plate'} • ${vehicle.basePrice}/day</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-sm ${vehicle.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-300' : vehicle.status === 'BOOKED' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-700/70 text-slate-200'}`}>
                      {vehicle.status || 'AVAILABLE'}
                    </span>
                    <button onClick={() => startEditVehicle(vehicle)} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">Edit</button>
                    <button onClick={() => {
                      setTrackingVehicleId(vehicle.id);
                      void loadTracking(vehicle.id);
                    }} className="rounded-full border border-red-700/50 px-3 py-1 text-sm text-red-300">Track</button>
                  </div>
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
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-100">{booking.vehicle?.make || 'Rental'} {booking.vehicle?.model || ''}</p>
                    <p className="text-sm text-slate-400">{booking.customer?.name || 'Customer'} • {booking.customer?.email || 'No email'}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">{booking.metadata?.durationType || 'DAILY'} • {booking.metadata?.effectiveDays || booking.metadata?.durationDays || 'n/a'} days</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-300">${booking.totalPrice || 0}</span>
                    <select value={booking.status} onChange={(event) => void handleBookingStatus(booking.id, event.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
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
