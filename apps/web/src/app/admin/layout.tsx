'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import {
  BarChart3,
  Car,
  Trophy,
  Tag,
  Folder,
  FileText,
  Users,
  MessageCircle,
  Store,
  ShieldCheck,
  Home,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3, description: 'Live overview' },
    { href: '/admin/users', label: 'Users', icon: Users, description: 'Accounts & roles' },
    { href: '/admin/vehicles', label: 'Vehicles', icon: Car, description: 'Inventory' },
    { href: '/admin/auctions', label: 'Auctions', icon: Trophy, description: 'Live bidding' },
    { href: '/admin/rentals', label: 'Rentals', icon: ShieldCheck, description: 'Bookings & fleet' },
    { href: '/admin/shop', label: 'Shop', icon: Store, description: 'Products & orders' },
    { href: '/admin/brands', label: 'Brands', icon: Tag, description: 'Brand catalog' },
    { href: '/admin/categories', label: 'Categories', icon: Folder, description: 'Taxonomy' },
    { href: '/admin/blogs', label: 'Blog Posts', icon: FileText, description: 'Content' },
    { href: '/admin/support', label: 'Support', icon: MessageCircle, description: 'Tickets & inquiries' },
    { href: '/admin/pages', label: 'Pages', icon: Home, description: 'Website pages' },
  ];

  return (
    <AdminGuard>
      <meta name="robots" content="noindex,nofollow,noarchive" />
      <div className="admin-theme flex min-h-screen bg-[#050505] text-slate-100">
      <aside className="hidden w-72 flex-shrink-0 bg-[#090d0d] px-4 py-6 lg:flex lg:flex-col">
        <div className="rounded-2xl bg-[#121918] p-4 shadow-lg shadow-black/20">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Lumana</p>
          <h1 className="mt-2 text-xl font-semibold">Admin control center</h1>
          <p className="mt-2 text-sm text-slate-400">Operations, content, and commerce in one place.</p>
        </div>

        <nav className="mt-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-2xl border px-3 py-3 transition ${
                  active
                    ? 'bg-cyan-400/10 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-[#111817] text-slate-300 hover:bg-[#192321]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-cyan-300" />
                  <span>
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="block text-xs text-slate-500">{item.description}</span>
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 rounded-2xl bg-[#121918] p-4">
          <Link href="/" className="flex items-center justify-between rounded-xl bg-[#090d0d] px-3 py-2 text-sm text-slate-300 transition hover:bg-[#192321] hover:text-white">
            <span className="flex items-center gap-2">
              <Home className="h-4 w-4 text-cyan-300" />
              Back to website
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-sm font-medium text-slate-100">Live dashboard</p>
          <p className="text-sm text-slate-400">Dashboard metrics refresh automatically every 30 seconds.</p>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-[#090d0d]">
        <div className="bg-[#121918] px-4 py-4 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Lumana</p>
              <p className="text-sm font-medium text-slate-100">Admin control center</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="rounded-full bg-[#090d0d] p-2 text-slate-300 transition hover:bg-[#192321] hover:text-white">
                <Home className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="rounded-full bg-[#090d0d] p-2 text-slate-300 transition hover:bg-[#192321] hover:text-white"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mobileOpen ? (
            <div className="mt-4 space-y-2 rounded-2xl bg-[#090d0d] p-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                      active ? 'bg-cyan-400/10 text-white' : 'text-slate-300 hover:bg-[#192321]'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-cyan-300" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
      </div>
    </AdminGuard>
  );
};

export default AdminLayout;
