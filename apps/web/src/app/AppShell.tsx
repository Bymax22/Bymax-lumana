'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Bell, ChevronDown, Menu, X } from 'lucide-react';
import { CurrencyProvider, useCurrency, CurrencyCode } from '@/context/CurrencyContext';

const navItems = [
  { href: '/', label: 'Home', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11.5L12 4l9 7.5v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8z" />
      </svg>
    ) },
  { href: '/vehicles', label: 'Vehicles', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h2l1.5-4.5A1.5 1.5 0 0 1 8 6h8a1.5 1.5 0 0 1 1.5 1.5L19 12h2" />
        <circle cx="7.5" cy="17.5" r="2" />
        <circle cx="16.5" cy="17.5" r="2" />
      </svg>
    ) },
  { href: '/auctions', label: 'Live Auctions', badge: 'LIVE', icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v8l-3-3" />
        <path d="M12 21V13l3 3" />
        <path d="M6.5 8L3 12.5l3.5 4" />
      </svg>
    ) },
  { href: '/dealers', label: 'Car Dealers', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9h18" />
        <path d="M5 9V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
        <path d="M5 20h2V14H5v6zM17 20h2V14h-2v6z" />
      </svg>
    ) },
  { href: '/shipping-calculator', label: 'Shipping Calculator', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="11" rx="2" />
        <path d="M3 11h18" />
        <path d="M7 7v-2" />
        <path d="M17 7v-2" />
      </svg>
    ) },
  { href: '/import-calculator', label: 'Import Calculator', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8v8H8z" />
        <path d="M12 4v4" />
      </svg>
    ) },
  { href: '/services', label: 'Services', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ) },
  { href: '/finance', label: 'Finance', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v22" />
        <path d="M7 6h10" />
        <path d="M7 18h10" />
        <path d="M12 6a3 3 0 0 0 0 6 3 3 0 0 1 0 6" />
      </svg>
    ) },
  { href: '/track-shipment', label: 'Track Shipment', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
        <circle cx="12" cy="9" r="2" />
      </svg>
    ) },
  { href: '/blog', label: 'Blog & News', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16" />
        <path d="M4 10h16" />
        <path d="M8 15h8" />
        <path d="M4 19h16" />
      </svg>
    ) },
  { href: '/about', label: 'About Us', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ) },
  { href: '/contact', label: 'Contact Us', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92V21a1 1 0 0 1-1.11 1 19.86 19.86 0 0 1-8.63-3.08 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2 3.11 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75 12.48 12.48 0 0 0 .7 2.22 1 1 0 0 1-.22 1L7.16 7.91a16 16 0 0 0 6 6l1.94-1.94a1 1 0 0 1 1-.22 12.48 12.48 0 0 0 2.22.7 1 1 0 0 1 .75 1V16.92z" />
      </svg>
    ) },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <CurrencyProvider>
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="overflow-hidden bg-yellow-400 px-3 py-2 text-sm text-[#0b0b0b] sm:px-4">
          <div className="mx-auto max-w-[1660px]">
            <div className="relative overflow-hidden">
              <div className="animate-[marquee_25s_linear_infinite] whitespace-nowrap font-medium">
                <span className="mr-12">Lumana AutoPlanet by Lumana Investment Ltd...........</span>
                <span className="mr-12">We are still setting up your premium experience.</span>
                <span className="mr-12">Order any car from Lumana with just 30% down payment.</span>
                <span className="mr-12">For more info click to chat with us on WhatsApp +260977635060.</span>
                <span className="mr-12">Lumana AutoPlanet by Lumana Investment Ltd...........</span>
                <span className="mr-12">We are still setting up your premium experience.</span>
                <span className="mr-12">Order any car from Lumana with just 30% down payment.</span>
                <span className="mr-12">For more info click to chat with us on WhatsApp +260977635060.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto flex min-h-screen max-w-[1660px] gap-3 px-3 py-3 sm:px-4 lg:gap-6 lg:px-8 lg:py-6">
        <aside className="hidden w-[280px] flex-col gap-6 rounded-[26px] bg-[#0b0b0b] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.45)] lg:flex">
          <div className="flex items-center gap-3 rounded-[22px] bg-[#101010] px-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-red-600 text-white">L</div>
            <div>
              <p className="text-xs uppercase text-slate-400">Lumana</p>
              <h1 className="text-lg font-bold text-white">AutoPlanet</h1>
            </div>
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    'flex w-full items-center justify-between rounded-[18px] px-2 py-1 text-left text-sm transition ' +
                    (active ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-slate-300 hover:bg-white/5')
                  }
                >
                  <span className="flex items-center gap-2 font-medium">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-[14px] bg-transparent text-red-400">
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                  {item.badge ? (
                    <span className="rounded-[14px] bg-red-600 px-2 py-1 text-[11px] font-semibold uppercase text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-4 rounded-[24px] bg-[#101010] p-4">
            <p className="text-sm uppercase text-yellow-400">Need Help?</p>
            <p className="text-sm text-slate-300">Our support team is ready to assist you 24/7.</p>
            <Link href="/contact" className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-yellow-500 px-2 py-1 text-sm font-semibold text-[#0b0b0b] transition hover:bg-yellow-400">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600/10 text-red-500">?</span>
              Chat With Us
            </Link>
          </div>

          <div className="space-y-4 rounded-[24px] bg-[#101010] p-5">
            <h2 className="text-sm uppercase text-slate-400">Popular Brands</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-[18px] bg-[#121212] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">T</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Toyota</p>
                    <p className="text-[11px] text-slate-500">12,458 Vehicles</p>
                  </div>
                </div>
                <span className="text-xs text-red-400">›</span>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-[#121212] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">N</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Nissan</p>
                    <p className="text-[11px] text-slate-500">8,256 Vehicles</p>
                  </div>
                </div>
                <span className="text-xs text-red-400">›</span>
              </div>
            </div>
            <Link href="/dealers" className="text-sm font-semibold text-yellow-400 hover:text-white">View All Brands</Link>
          </div>

          <div className="space-y-4 rounded-[24px] bg-[#101010] p-5">
            <div className="rounded-[20px] bg-[#111111] p-4">
              <div className="h-44 rounded-[20px] bg-[#121212] p-4">
                <div className="mb-4 flex items-center justify-between text-[11px] uppercase text-slate-500">
                  <span>Google Play</span>
                  <span>App Store</span>
                </div>
                <div className="h-full rounded-[16px] bg-[#0f0f0f]" />
              </div>
            </div>
            <div>
              <p className="text-sm uppercase text-slate-400">Download Our App</p>
              <p className="text-sm text-slate-300">Buy, track and manage vehicles on the go.</p>
            </div>
          </div>

          <div className="rounded-[24px] bg-[#101010] p-5 text-sm text-slate-400">
            <p className="font-semibold text-white">Lumana AutoPlanet</p>
            <p className="mt-2 text-sm">Your all-in-one platform to buy, import, and manage vehicles worldwide.</p>
            <div className="mt-4 space-y-1 text-xs text-slate-500">
              <p>Email</p>
              <p className="text-slate-300">info@lumanaautoplanet.com</p>
              <p>Phone</p>
              <p className="text-slate-300">+260 123 456 789</p>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 gap-3">
          {mobileNavOpen ? (
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[1px] lg:hidden"
            />
          ) : null}

          <nav className={`fixed left-0 top-0 z-50 h-full w-[74vw] max-w-[240px] transform overflow-y-auto rounded-r-[24px] border-r border-white/10 bg-[#0b0b0b] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.55)] transition-transform duration-300 lg:hidden ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between rounded-[22px] bg-[#101010] px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-red-600 text-sm font-bold text-white">L</div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Lumana</p>
                  <p className="text-sm font-semibold text-white">AutoPlanet</p>
                </div>
              </div>
              <button type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/5 text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-1.5">
              {navItems.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={
                      'flex items-center gap-2.5 rounded-[16px] px-2.5 py-2.5 text-sm transition ' +
                      (active ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-slate-300 hover:bg-white/5')
                    }
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-[12px] text-red-400">
                      {item.icon}
                    </span>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-[12px] bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 rounded-[20px] bg-[#101010] p-4 text-sm text-slate-300">
              <p className="text-sm uppercase text-yellow-400">Need Help?</p>
              <p className="mt-2">Our support team is ready to assist you 24/7.</p>
            </div>
          </nav>

          <section className="flex-1 space-y-6 pb-24 lg:pb-0">
            <div className="rounded-[24px] bg-[#0d0d0d] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open navigation"
                  onClick={() => setMobileNavOpen(true)}
                  className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#121212] text-slate-100 lg:hidden"
                >
                  {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                <SearchBox />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <CurrencySwitcher />
                <button className="rounded-[18px] bg-[#121212] px-2 py-1 text-sm text-slate-300">♡</button>
                <button className="rounded-[18px] bg-[#121212] px-2 py-1 text-sm text-slate-300"><Bell className="h-4 w-4" /></button>
                <Link href="/auth/login" className="rounded-[18px] bg-[#141414] px-2 py-1 text-sm text-white">Login</Link>
                <Link href="/auth/signup" className="rounded-[18px] bg-yellow-500 px-3 py-1 text-sm font-semibold text-[#0b0b0b]">Sign Up</Link>
              </div>
            </div>
          </div>

            {children}
          </section>
        </div>
      </div>
    </main>
    </CurrencyProvider>
  );
}

function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const options: CurrencyCode[] = ['ZMW', 'USD', 'EUR', 'GBP', 'JPY', 'AUD'];

  return (
    <div className="relative rounded-[18px] bg-[#121212] px-3 py-1 text-sm text-slate-300">
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
        className="w-full appearance-none bg-transparent pr-10 text-slate-200 outline-none"
        aria-label="Currency selector"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#101010] text-white">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return router.push('/vehicles');
    router.push(`/vehicles?search=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-3 rounded-[18px] bg-[#121212] px-3 py-2 text-sm text-slate-300">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search vehicles, make, model, VIN..."
        className="w-full bg-transparent outline-none text-slate-200"
        aria-label="Search vehicles"
      />
      <button type="submit" className="rounded-[12px] bg-red-600 px-3 py-1 text-sm text-white">Search</button>
    </form>
  );
}
