'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicApi } from '@/lib/publicApi';
import { getCurrentUserId } from '@/lib/auth';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    publicApi(`/hire/bookings?userId=${userId}`)
      .then((res: any) => setBookings(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">Loading bookings…</div>;
  }

  if (!bookings.length) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No bookings found.</div>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold text-white">Your Bookings</h2>
        <div className="mt-4 space-y-4">
          {bookings.map((b: any) => (
            <div key={b.id} className="flex items-center justify-between rounded-[14px] bg-[#121212] p-4">
              <div>
                <div className="font-semibold text-white">{b.bookingRef}</div>
                <div className="text-sm text-slate-400">{new Date(b.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-300">{b.status}</div>
                <Link href={`/buyer/bookings/${b.id}`} className="mt-2 inline-block rounded bg-gray-800 px-3 py-1 text-sm">View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
