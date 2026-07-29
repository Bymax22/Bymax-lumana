'use client';

import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/publicApi';

interface Props { params: { id: string } }

export default function BookingDetailPage({ params }: Props) {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi(`/hire/bookings/${params.id}`)
      .then((res) => setBooking(res))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">Loading booking…</div>;
  }

  if (!booking) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">Booking not found.</div>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold text-white">Booking {booking.bookingRef}</h2>
        <div className="mt-4 text-slate-300">
          <p>Pickup: {new Date(booking.pickupDate).toLocaleString()}</p>
          <p>Return: {new Date(booking.returnDate).toLocaleString()}</p>
          <p>Status: {booking.status}</p>
          <p className="mt-2">Total: {booking.totalPrice ?? '—'}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white">Vehicle</h3>
          <div className="mt-3 rounded-[12px] bg-[#121212] p-3">
            <div className="font-semibold text-white">{booking.vehicle?.make} {booking.vehicle?.model}</div>
            <div className="text-sm text-slate-400">VIN: {booking.vehicle?.vin}</div>
          </div>
        </div>

        {booking.metadata ? (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white">Customer Details</h3>
            <div className="mt-3 rounded-[12px] bg-[#121212] p-3 text-sm text-slate-300">
              <p>Driver: {booking.metadata.driverName || '—'}</p>
              <p>License: {booking.metadata.driverLicense || '—'}</p>
              <p>Phone: {booking.metadata.driverPhone || '—'}</p>
              <p>Emergency Contact: {booking.metadata.emergencyContact || '—'}</p>
              <p>Special Requests: {booking.metadata.specialRequirements || '—'}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
