'use client';

import type { ElementType } from 'react';
import Link from 'next/link';
import { Boxes, CarFront, Package, ShoppingCart, Sparkles, Store, Truck } from 'lucide-react';

interface QuickAction {
  href: string;
  label: string;
  icon: ElementType;
}

export default function AdminDashboard() {
  const stats = [
    { label: 'Rental fleet', value: 'Live', color: 'bg-blue-500' },
    { label: 'Shop catalog', value: 'Managed', color: 'bg-green-500' },
    { label: 'Orders', value: 'Tracked', color: 'bg-purple-500' },
    { label: 'Bookings', value: 'Monitored', color: 'bg-orange-500' },
  ];

  const quickActions: QuickAction[] = [
    { href: '/admin/rentals', label: 'Rental operations', icon: CarFront },
    { href: '/admin/shop', label: 'Shop management', icon: Store },
    { href: '/admin/vehicles', label: 'Vehicle admin', icon: Boxes },
    { href: '/admin/auctions', label: 'Auction center', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <p className="text-sm uppercase tracking-[0.3em] text-red-400">Control center</p>
          <h1 className="mt-2 text-3xl font-semibold">Admin dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">Manage hire, shop, and inventory from one streamlined admin experience.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-3xl p-6 text-white shadow-lg`}>
              <p className="text-sm text-slate-100">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-red-500 hover:bg-slate-800">
                <Icon className="h-5 w-5 text-red-400" />
                <span className="font-medium text-slate-100">{action.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center gap-2">
              <CarFront className="h-5 w-5 text-red-400" />
              <h2 className="text-xl font-semibold">Rental management</h2>
            </div>
            <p className="mt-3 text-sm text-slate-400">Create rental vehicles, review active bookings, and adjust booking status from the operations view.</p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-red-400" />
              <h2 className="text-xl font-semibold">Shop management</h2>
            </div>
            <p className="mt-3 text-sm text-slate-400">Add product categories, publish products, and update orders quickly without leaving the dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
