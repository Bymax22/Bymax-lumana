'use client';

import { useEffect, useMemo, useState, type ElementType } from 'react';
import Link from 'next/link';
import {
  Boxes,
  CarFront,
  FileText,
  MessageCircle,
  Package,
  RefreshCcw,
  ShoppingCart,
  Sparkles,
  Store,
  Tag,
  Users,
  Activity,
  ShieldCheck,
  Folder,
  CircleDollarSign,
} from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

interface QuickAction {
  href: string;
  label: string;
  icon: ElementType;
  description: string;
}

interface MetricCard {
  label: string;
  value: string;
  description: string;
  icon: ElementType;
  accent: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('—');

  const quickActions: QuickAction[] = [
    { href: '/admin/rentals', label: 'Rental operations', description: 'Fleet and booking queue', icon: CarFront },
    { href: '/admin/shop', label: 'Shop management', description: 'Products, categories, orders', icon: Store },
    { href: '/admin/vehicles', label: 'Vehicle admin', description: 'Inventory and status', icon: Boxes },
    { href: '/admin/auctions', label: 'Auction center', description: 'Live auction review', icon: Sparkles },
  ];

  const metricCards = useMemo<MetricCard[]>(() => [
    { label: 'Users', value: String(stats.users ?? 0), description: 'Registered accounts', icon: Users, accent: 'from-cyan-500 to-blue-600' },
    { label: 'Vehicles', value: String(stats.vehicles ?? 0), description: 'Inventory records', icon: Boxes, accent: 'from-violet-500 to-fuchsia-600' },
    { label: 'Auctions', value: String(stats.auctions ?? 0), description: 'Open & pending', icon: Sparkles, accent: 'from-amber-500 to-orange-600' },
    { label: 'Support', value: String(stats.support ?? 0), description: 'Open tickets', icon: MessageCircle, accent: 'from-rose-500 to-red-600' },
  ], [stats]);

  const loadStats = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const [statsResponse, usersResponse, vehiclesResponse, auctionsResponse, brandsResponse, categoriesResponse, blogsResponse, supportResponse, pagesResponse] = await Promise.allSettled([
        adminApi('/admin/dashboard/stats').catch(() => null),
        adminApi('/admin/users?skip=0&take=1000'),
        adminApi('/admin/vehicles?skip=0&take=1000'),
        adminApi('/admin/auctions?skip=0&take=1000'),
        adminApi('/admin/brands?skip=0&take=1000'),
        adminApi('/admin/categories?skip=0&take=1000'),
        adminApi('/admin/blogs?skip=0&take=1000'),
        adminApi('/admin/support/tickets?skip=0&take=1000'),
        adminApi('/admin/pages?skip=0&take=1000'),
      ]);

      const nextStats: Record<string, number> = {};
      const statsPayload = statsResponse.status === 'fulfilled' && statsResponse.value ? statsResponse.value : null;

      if (statsPayload && typeof statsPayload === 'object') {
        nextStats.users = Number((statsPayload as Record<string, unknown>).users ?? 0);
        nextStats.vehicles = Number((statsPayload as Record<string, unknown>).vehicles ?? 0);
        nextStats.auctions = Number((statsPayload as Record<string, unknown>).auctions ?? 0);
        nextStats.brands = Number((statsPayload as Record<string, unknown>).brands ?? 0);
        nextStats.categories = Number((statsPayload as Record<string, unknown>).categories ?? 0);
        nextStats.blogs = Number((statsPayload as Record<string, unknown>).blogs ?? 0);
        nextStats.support = Number((statsPayload as Record<string, unknown>).support ?? 0);
        nextStats.pages = Number((statsPayload as Record<string, unknown>).pages ?? 0);
      }

      nextStats.users = nextStats.users ?? toCount(usersResponse);
      nextStats.vehicles = nextStats.vehicles ?? toCount(vehiclesResponse);
      nextStats.auctions = nextStats.auctions ?? toCount(auctionsResponse);
      nextStats.brands = nextStats.brands ?? toCount(brandsResponse);
      nextStats.categories = nextStats.categories ?? toCount(categoriesResponse);
      nextStats.blogs = nextStats.blogs ?? toCount(blogsResponse);
      nextStats.support = nextStats.support ?? toCount(supportResponse);
      nextStats.pages = nextStats.pages ?? toCount(pagesResponse);

      setStats(nextStats);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error('Failed to load admin stats', error);
      setStats((current) => current);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void loadStats(true);
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-red-400">Control center</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Admin dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">Monitor customers, vehicles, auctions, rentals, shop activity, and content from one live control panel.</p>
          </div>
          <button onClick={() => void loadStats(false)} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500 hover:text-white">
            <RefreshCcw className="h-4 w-4" />
            Refresh now
          </button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
            <Activity className="h-4 w-4" />
            Manual refresh only
          </span>
          <span>Last refreshed: {lastUpdated}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-3xl bg-slate-900/80 p-5 shadow-lg shadow-black/20">
              <div className={`inline-flex rounded-2xl bg-gradient-to-r ${card.accent} p-3 text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm text-slate-400">{card.label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold text-white">{loading ? '…' : card.value}</p>
                <p className="text-xs text-slate-500">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="rounded-3xl bg-slate-900/80 p-5 transition hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-red-500/10 p-2 text-red-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-100">{action.label}</p>
                  <p className="text-sm text-slate-500">{action.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-900/80 p-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <ShieldCheck className="h-5 w-5 text-red-400" />
            Commerce & operations
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-400">
            <div className="flex items-center justify-between rounded-2xl bg-slate-950/70 px-4 py-3">
              <span>Rental bookings</span>
              <span className="font-semibold text-slate-100">Managed live</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-950/70 px-4 py-3">
              <span>Shop orders</span>
              <span className="font-semibold text-slate-100">Tracked in real time</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-950/70 px-4 py-3">
              <span>Content hub</span>
              <span className="font-semibold text-slate-100">Blogs & pages synced</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 p-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <FileText className="h-5 w-5 text-red-400" />
            Schema-backed modules
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Users', value: stats.users ?? 0, icon: Users },
              { label: 'Brands', value: stats.brands ?? 0, icon: Tag },
              { label: 'Categories', value: stats.categories ?? 0, icon: Folder },
              { label: 'Blog posts', value: stats.blogs ?? 0, icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl bg-slate-950/70 p-4">
                  <div className="flex items-center gap-3 text-slate-100">
                    <Icon className="h-4 w-4 text-red-400" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function toCount(result: PromiseSettledResult<unknown>): number {
  if (result.status !== 'fulfilled') return 0;

  const value = result.value as { data?: unknown[]; items?: unknown[] } | unknown[] | null | undefined;
  if (Array.isArray(value)) {
    return value.length;
  }

  if (value && typeof value === 'object') {
    if (Array.isArray((value as { data?: unknown[] }).data)) {
      return (value as { data: unknown[] }).data.length;
    }

    if (Array.isArray((value as { items?: unknown[] }).items)) {
      return (value as { items: unknown[] }).items.length;
    }
  }

  return 0;
}

