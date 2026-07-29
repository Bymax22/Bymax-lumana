'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/publicApi';
import { getCurrentUserId, getStoredUser } from '@/lib/auth';

export default function BuyerDashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
    const userId = getCurrentUserId();

    async function load() {
      setLoading(true);
      try {
        const [vehicleRes, auctionRes, orderRes, bookingRes] = await Promise.all([
          publicApi('/vehicles').catch(() => []),
          publicApi('/auctions').catch(() => []),
          userId ? publicApi(`/shop/orders/${userId}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          userId ? publicApi(`/hire/bookings?userId=${userId}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);

        setVehicles(Array.isArray(vehicleRes) ? vehicleRes : []);
        setAuctions(Array.isArray(auctionRes) ? auctionRes : []);
        setOrders(Array.isArray(orderRes?.data) ? orderRes.data : []);
        setBookings(Array.isArray(bookingRes?.data) ? bookingRes.data : []);
      } catch {
        setVehicles([]);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const vehicleCount = vehicles.length;
  const liveAuctions = auctions.filter((a: any) => a.status === 'LIVE').length;
  const upcomingBookings = bookings.filter((b: any) => b.status !== 'CANCELLED').length;

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] bg-[#0d0d0d] p-6 shadow-lg">
        <p className="text-sm uppercase text-red-400">Buyer Portal</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Welcome back{user?.name ? `, ${user.name}` : ''}</h2>
        <p className="mt-2 text-slate-400">Keep track of your marketplace activity, orders, and rental bookings in one place.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[18px] bg-[#121212] p-4">
            <div className="text-sm text-slate-400">Vehicles</div>
            <div className="text-xl font-bold text-white">{vehicleCount}</div>
          </div>
          <div className="rounded-[18px] bg-[#121212] p-4">
            <div className="text-sm text-slate-400">Live Auctions</div>
            <div className="text-xl font-bold text-white">{liveAuctions}</div>
          </div>
          <div className="rounded-[18px] bg-[#121212] p-4">
            <div className="text-sm text-slate-400">Orders</div>
            <div className="text-xl font-bold text-white">{orders.length}</div>
          </div>
          <div className="rounded-[18px] bg-[#121212] p-4">
            <div className="text-sm text-slate-400">Active Hire Bookings</div>
            <div className="text-xl font-bold text-white">{upcomingBookings}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[20px] bg-[#121212] p-4">
            <h3 className="text-lg font-semibold text-white">Hire Services</h3>
            <p className="mt-2 text-sm text-slate-400">Book rentals, track your requests, and share extra driver details for a smoother experience.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/hire" className="rounded bg-red-600 px-4 py-2 text-sm text-white">Browse Rentals</Link>
              <Link href="/buyer/bookings" className="rounded bg-gray-800 px-4 py-2 text-sm text-white">My Bookings</Link>
            </div>
          </div>
          <div className="rounded-[20px] bg-[#121212] p-4">
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/buyer/vehicles" className="rounded bg-yellow-500 px-4 py-2 text-sm text-[#0b0b0b]">Marketplace</Link>
              <Link href="/buyer/orders" className="rounded bg-gray-800 px-4 py-2 text-sm text-white">Orders</Link>
              <Link href="/buyer/profile" className="rounded bg-gray-800 px-4 py-2 text-sm text-white">Profile</Link>
            </div>
          </div>
        </div>

        {loading ? <div className="mt-6 text-sm text-slate-400">Loading your dashboard…</div> : null}
      </div>
    </section>
  );
}
