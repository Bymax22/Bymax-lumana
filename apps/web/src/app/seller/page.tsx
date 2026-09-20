'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, CarFront, CheckCircle2, ChevronRight, ClipboardList, Clock3, DollarSign, PackageCheck, Plus, RefreshCw, ShoppingBag, TrendingUp } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

type Vehicle = { id: string | number; make?: string; model?: string; year?: number; price?: number; status?: string };
type Order = { id: string | number; vehicleId?: string | number; amount?: string | number; createdAt?: string };

export default function SellerDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userName, setUserName] = useState('Seller');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserName(user.name || user.email?.split('@')[0] || 'Seller');
      setOrders(JSON.parse(localStorage.getItem('orders') || '[]'));
    } catch { setUserName('Seller'); setOrders([]); }

    async function load() {
      setLoading(true);
      try {
        const result = await publicApi('/vehicles');
        setVehicles(Array.isArray(result) ? result.slice(0, 20) : []);
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

  const activeListings = vehicles.filter((vehicle) => vehicle.status?.toLowerCase() !== 'sold').length;
  const totalSales = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
  const listedVehicle = vehicles.slice(0, 4);

  return (
    <section className="space-y-6 pb-10">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-yellow-300">Seller overview</p><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Good morning, {userName}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Keep your inventory moving with a quick view of listings, sales, and next actions.</p></div><div className="flex gap-3"><button type="button" onClick={() => window.location.reload()} className="flex items-center gap-2 rounded-xl bg-[#171a1d] px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-[#202428] hover:text-white" title="Refresh dashboard"><RefreshCw size={16} /> <span className="hidden sm:inline">Refresh</span></button><Link href="/seller/vehicles/new" className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-[#111] shadow-lg shadow-yellow-400/10 transition hover:bg-yellow-300"><Plus size={17} /> Add vehicle</Link></div></header>
      {error ? <div className="flex items-center gap-2 rounded-xl bg-[#2b2010] px-4 py-3 text-sm text-amber-200"><Clock3 size={16} /> {error}</div> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Active listings" value={loading ? '...' : activeListings} helper="Vehicles currently visible" icon={<CarFront size={19} />} accent="text-yellow-300" /><MetricCard label="Orders received" value={orders.length} helper="All-time local orders" icon={<ShoppingBag size={19} />} accent="text-sky-300" /><MetricCard label="Sales value" value={totalSales ? `$${totalSales.toLocaleString()}` : '$0'} helper="From recorded orders" icon={<DollarSign size={19} />} accent="text-emerald-300" /><MetricCard label="Profile health" value="80%" helper="Add details to build trust" icon={<TrendingUp size={19} />} accent="text-violet-300" /></div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl bg-[#111416] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-lg font-semibold">Inventory snapshot</p><p className="mt-1 text-sm text-slate-500">Your latest vehicles and their current status.</p></div><Link href="/seller/vehicles" className="flex items-center gap-1 text-sm font-semibold text-yellow-300 hover:text-yellow-200">View all <ArrowUpRight size={15} /></Link></div><div className="mt-5 divide-y divide-white/[0.06]">{loading ? <div className="py-8 text-sm text-slate-500">Loading your inventory...</div> : listedVehicle.length === 0 ? <div className="rounded-xl bg-[#171a1d] px-4 py-8 text-center"><CarFront className="mx-auto mb-3 text-slate-500" size={24} /><p className="text-sm text-slate-300">Your inventory is empty.</p><Link href="/seller/vehicles/new" className="mt-3 inline-flex text-sm font-semibold text-yellow-300">Add your first vehicle <ChevronRight size={15} /></Link></div> : listedVehicle.map((vehicle) => <InventoryRow key={vehicle.id} vehicle={vehicle} />)}</div></div>
        <div className="rounded-2xl bg-[#111416] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-lg font-semibold">Recent activity</p><p className="mt-1 text-sm text-slate-500">Stay close to buyer interest.</p></div><PackageCheck className="text-emerald-300" size={20} /></div><div className="mt-5 space-y-4">{orders.length === 0 ? <div className="rounded-xl bg-[#171a1d] px-4 py-7 text-center text-sm text-slate-500">No orders recorded yet.</div> : orders.slice(0, 4).map((order) => <div key={order.id} className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300"><CheckCircle2 size={17} /></span><div className="min-w-0"><p className="truncate text-sm font-medium text-slate-200">Order #{order.id}</p><p className="text-xs text-slate-500">Vehicle {order.vehicleId || 'listing'}</p></div></div><span className="shrink-0 text-sm font-semibold text-slate-200">{order.amount ? `$${Number(order.amount).toLocaleString()}` : 'Pending'}</span></div>)}</div><Link href="/seller/orders" className="mt-6 flex items-center justify-center gap-1 rounded-xl bg-[#171a1d] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-[#202428] hover:text-white">Open orders <ChevronRight size={15} /></Link></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3"><QuickAction href="/seller/vehicles/new" icon={<Plus size={19} />} title="Add a vehicle" description="Put a new listing in front of buyers." /><QuickAction href="/seller/profile" icon={<CheckCircle2 size={19} />} title="Complete your profile" description="A complete seller profile builds confidence." /><QuickAction href="/seller/orders" icon={<ClipboardList size={19} />} title="Review sales" description="Check order details and follow-ups." /></div>
    </section>
  );
}

function MetricCard({ label, value, helper, icon, accent }: { label: string; value: string | number; helper: string; icon: React.ReactNode; accent: string }) { return <div className="rounded-2xl bg-[#111416] p-5"><div className={`mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] ${accent}`}>{icon}</div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</p><p className="mt-1 text-xs text-slate-600">{helper}</p></div>; }
function InventoryRow({ vehicle }: { vehicle: Vehicle }) { const status = vehicle.status || 'Available'; return <Link href={`/seller/vehicles/${vehicle.id}`} className="flex items-center justify-between gap-4 py-4 transition hover:bg-white/[0.02]"><div className="flex min-w-0 items-center gap-3"><div className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1a1e20] text-slate-500"><CarFront size={20} /></div><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-200">{vehicle.make || 'Vehicle'} {vehicle.model || ''}</p><p className="mt-1 text-xs text-slate-500">{vehicle.year || 'Year not set'} {vehicle.price ? `· $${Number(vehicle.price).toLocaleString()}` : ''}</p></div></div><span className="shrink-0 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">{status}</span></Link>; }
function QuickAction({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) { return <Link href={href} className="group rounded-2xl bg-[#111416] p-5 transition hover:bg-[#171a1d]"><span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-300">{icon}</span><p className="flex items-center gap-1 font-semibold text-slate-200">{title}<ChevronRight size={15} className="transition group-hover:translate-x-1" /></p><p className="mt-2 text-sm leading-5 text-slate-500">{description}</p></Link>; }
