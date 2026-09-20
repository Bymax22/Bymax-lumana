'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Bookmark, CarFront, CheckCircle2, ChevronRight, Clock3, Compass, Gavel, PackageCheck, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';
import { getCurrentUserId, getStoredUser } from '@/lib/auth';
import { getFirstMediaUrl } from '@/lib/media';

export default function BuyerDashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
    const userId = getCurrentUserId();
    try { setSavedCount(JSON.parse(localStorage.getItem('savedVehicles') || '[]').length); } catch { setSavedCount(0); }

    async function load() {
      setLoading(true);
      try {
        const [vehicleRes, auctionRes, orderRes, bookingRes, notificationRes] = await Promise.all([
          publicApi('/vehicles').catch(() => []),
          publicApi('/auctions').catch(() => []),
          userId ? publicApi(`/shop/orders/${userId}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          userId ? publicApi(`/hire/bookings?userId=${userId}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          publicApi('/notifications').catch(() => []),
        ]);

        setVehicles(Array.isArray(vehicleRes) ? vehicleRes : []);
        setAuctions(Array.isArray(auctionRes) ? auctionRes : []);
        setOrders(Array.isArray(orderRes?.data) ? orderRes.data : []);
        setBookings(Array.isArray(bookingRes?.data) ? bookingRes.data : []);
        setNotifications(Array.isArray(notificationRes) ? notificationRes : []);
        setError('');
      } catch (loadError) {
        console.error('Failed to load buyer dashboard', loadError);
        setError('Dashboard data could not be refreshed.');
      } finally {
        setLoading(false);
      }
    }

    load();
    const intervalId = window.setInterval(load, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  const vehicleCount = vehicles.length;
  const liveAuctions = auctions.filter((a: any) => a.status === 'LIVE').length;
  const upcomingBookings = bookings.filter((b: any) => b.status !== 'CANCELLED').length;
  const featuredVehicles = vehicles.slice(0, 3);
  const recentOrders = orders.slice(0, 3);

  return (
    <section className="space-y-6 pb-10">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-300">Buyer overview</p><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Welcome back{user?.name ? `, ${user.name}` : ''}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Find your next vehicle, keep an eye on auctions, and stay on top of every purchase.</p></div><div className="flex gap-3"><button type="button" onClick={() => window.location.reload()} className="flex items-center gap-2 rounded-xl bg-[#171a1d] px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-[#202428] hover:text-white" title="Refresh dashboard"><RefreshCw size={16} /><span className="hidden sm:inline">Refresh</span></button><Link href="/buyer/vehicles" className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/10 transition hover:bg-red-400"><Compass size={17} /> Browse cars</Link></div></header>
      {loading ? <div className="flex items-center gap-2 rounded-xl bg-[#15191c] px-4 py-3 text-sm text-slate-400"><RefreshCw className="animate-spin" size={15} /> Updating your activity...</div> : null}
      {error ? <div className="flex items-center gap-2 rounded-xl bg-[#2b2010] px-4 py-3 text-sm text-amber-200"><Clock3 size={16} /> {error}</div> : null}
      {notifications.length > 0 ? <div className="rounded-2xl bg-[#111416] p-5"><div className="flex items-center gap-2"><Sparkles className="text-yellow-300" size={18} /><p className="font-semibold">Account updates</p></div><div className="mt-4 space-y-3">{notifications.slice(0, 3).map((notification: any) => <div key={notification.id} className="rounded-xl bg-[#171a1d] p-4"><p className="text-sm font-semibold text-white">{notification.payload?.title || 'Notification'}</p><p className="mt-1 text-sm text-slate-400">{notification.payload?.message || 'You have a new account update.'}</p></div>)}</div></div> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Marketplace" value={vehicleCount} helper="Vehicles to explore" icon={<CarFront size={19} />} tone="text-red-300" /><Stat label="Live auctions" value={liveAuctions} helper="Auctions happening now" icon={<Gavel size={19} />} tone="text-amber-300" /><Stat label="Saved vehicles" value={savedCount} helper="Your shortlist" icon={<Bookmark size={19} />} tone="text-sky-300" /><Stat label="Active bookings" value={upcomingBookings} helper="Rental trips ahead" icon={<ShoppingBag size={19} />} tone="text-emerald-300" /></div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl bg-[#111416] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-lg font-semibold">Vehicles you may like</p><p className="mt-1 text-sm text-slate-500">A fresh look at what is available now.</p></div><Link href="/buyer/vehicles" className="flex items-center gap-1 text-sm font-semibold text-red-300 hover:text-red-200">Explore all <ArrowUpRight size={15} /></Link></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{featuredVehicles.length === 0 ? <div className="rounded-xl bg-[#171a1d] px-4 py-8 text-center text-sm text-slate-500 sm:col-span-3">No vehicles are available right now.</div> : featuredVehicles.map((vehicle: any) => { const imageUrl = getFirstMediaUrl(vehicle); return <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`} className="group min-w-0 overflow-hidden rounded-xl bg-[#171a1d] p-3 transition hover:bg-[#202428]"><div className="flex h-24 items-center justify-center overflow-hidden rounded-lg bg-[#202428] text-slate-500">{imageUrl ? <img src={imageUrl} alt={`${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" loading="lazy" /> : <CarFront size={28} />}</div><p className="mt-3 truncate text-sm font-semibold text-slate-200">{vehicle.make} {vehicle.model}</p><p className="mt-1 text-xs text-slate-500">{vehicle.year || 'Year not set'} <ChevronRight size={13} className="inline transition group-hover:translate-x-1" /></p></Link>; })}</div></div>
        <div className="rounded-2xl bg-[#111416] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-lg font-semibold">Recent orders</p><p className="mt-1 text-sm text-slate-500">Your latest purchase activity.</p></div><PackageCheck className="text-emerald-300" size={20} /></div><div className="mt-5 space-y-4">{recentOrders.length === 0 ? <div className="rounded-xl bg-[#171a1d] px-4 py-7 text-center text-sm text-slate-500">No orders yet. Your next one starts here.</div> : recentOrders.map((order: any) => <div key={order.id} className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300"><CheckCircle2 size={17} /></span><div className="min-w-0"><p className="truncate text-sm font-medium text-slate-200">Order #{order.id}</p><p className="text-xs text-slate-500">{order.status || 'Processing'}</p></div></div><span className="shrink-0 text-sm font-semibold text-slate-200">{order.total ? `$${Number(order.total).toLocaleString()}` : 'View'}</span></div>)}</div><Link href="/buyer/orders" className="mt-6 flex items-center justify-center gap-1 rounded-xl bg-[#171a1d] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-[#202428] hover:text-white">View orders <ChevronRight size={15} /></Link></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3"><Action href="/hire" icon={<CarFront size={19} />} title="Plan a rental" description="Choose a car for your next trip." /><Action href="/buyer/saved" icon={<Bookmark size={19} />} title="Review saved cars" description={`${savedCount} vehicle${savedCount === 1 ? '' : 's'} waiting in your shortlist.`} /><Action href="/auctions" icon={<Gavel size={19} />} title="Watch live auctions" description={`${liveAuctions} auction${liveAuctions === 1 ? '' : 's'} are live right now.`} /></div>
    </section>
  );
}

function Stat({ label, value, helper, icon, tone }: { label: string; value: number; helper: string; icon: React.ReactNode; tone: string }) { return <div className="rounded-2xl bg-[#111416] p-5"><div className={`mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] ${tone}`}>{icon}</div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</p><p className="mt-1 text-xs text-slate-600">{helper}</p></div>; }
function Action({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) { return <Link href={href} className="group rounded-2xl bg-[#111416] p-5 transition hover:bg-[#171a1d]"><span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-red-400/10 text-red-300">{icon}</span><p className="flex items-center gap-1 font-semibold text-slate-200">{title}<ChevronRight size={15} className="transition group-hover:translate-x-1" /></p><p className="mt-2 text-sm leading-5 text-slate-500">{description}</p></Link>; }
