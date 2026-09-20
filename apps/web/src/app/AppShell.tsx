'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, UserRound, X } from 'lucide-react';
import { CurrencyProvider, useCurrency, CurrencyCode } from '@/context/CurrencyContext';
import { publicApi } from '@/lib/publicApi';
import { AppUser, getStoredUser } from '@/lib/auth';

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
  { href: '/hire', label: 'Vehicle Hire', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18" />
        <path d="M5 12V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
        <rect x="5" y="12" width="14" height="6" rx="2" />
      </svg>
    ) },
  { href: '/shop', label: 'Auto Spares', badge: null, icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h16" />
        <path d="M6 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
        <path d="M9 11h6" />
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

function normalizeBrandPayload(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as Record<string, unknown>;
    const nested = candidate.data ?? candidate.items ?? candidate.results;
    if (Array.isArray(nested)) {
      return nested;
    }
  }

  return [];
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [popularBrands, setPopularBrands] = useState<any[]>([]);
  const [user, setUser] = useState<AppUser | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showSessionOffer, setShowSessionOffer] = useState(false);

  useEffect(() => {
    const offerKey = 'lumana-session-offer-seen';
    if (window.sessionStorage.getItem(offerKey)) return;

    window.sessionStorage.setItem(offerKey, 'true');
    setShowSessionOffer(true);
    const timeoutId = window.setTimeout(() => setShowSessionOffer(false), 6200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('lumana-auth-change', syncUser);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('lumana-auth-change', syncUser);
    };
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setAccountMenuOpen(false);
    window.dispatchEvent(new Event('lumana-auth-change'));
    router.push('/');
  }

  useEffect(() => {
    let active = true;

    publicApi('/brands?take=6')
      .then((response) => {
        if (!active) return;
        setPopularBrands(normalizeBrandPayload(response));
      })
      .catch(() => {
        if (active) {
          setPopularBrands([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <CurrencyProvider>
      <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
        {showSessionOffer ? (
          <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center px-6 text-center animate-[sessionOfferFade_6.2s_ease-out_forwards]" aria-live="polite">
            <div className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
              <p className="text-[clamp(5rem,24vw,13rem)] font-black leading-none tracking-tight text-yellow-400">30%</p>
              <p className="mt-3 max-w-xl text-base font-semibold leading-6 text-white sm:text-xl">Downpayment gets you any car you want with Lumana.</p>
            </div>
          </div>
        ) : null}
        <div className="px-3 py-2.5 sm:px-4">
          <div className="mx-auto max-w-[1660px]">
            <div className="relative overflow-hidden rounded-full bg-[#0d0d0d] px-3 py-2 text-sm text-white">
              <div className="flex w-max animate-[marquee_24s_linear_infinite] items-center whitespace-nowrap font-bold tracking-[0.02em]">
                <span className="px-3 sm:text-[15px]">Did you know that you can buy any vehicle of your choice from Lumana with just 30% downpayment and the balance only paid when your vehicle reaches the PORT?</span>
                <span className="px-12 sm:text-[15px]" aria-hidden="true">Did you know that you can buy any vehicle of your choice from Lumana with just 30% downpayment and the balance only paid when your vehicle reaches the PORT?</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto flex min-h-screen w-full max-w-[1660px] min-w-0 gap-3 overflow-x-hidden px-3 py-3 sm:px-4 lg:gap-6 lg:px-8 lg:py-6">
        <aside className="hidden w-[280px] flex-col gap-6 rounded-[26px] bg-[#0b0b0b] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.45)] lg:flex">
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
              {popularBrands.length > 0 ? (
                popularBrands.slice(0, 4).map((brand: any) => {
                  const logoUrl = typeof brand?.logoUrl === 'string' ? brand.logoUrl.trim() : '';
                  const title = brand?.name || brand?.brand?.name || 'Brand';
                  const countText = brand?.vehicleCount ? `${brand.vehicleCount} Vehicles` : '';
                  const brandHref = `/vehicles?make=${encodeURIComponent(String(title))}`;

                  return (
                    <Link key={brand?.id || title} href={brandHref} className="flex items-center justify-between rounded-[18px] bg-[#121212] px-4 py-3 transition hover:bg-[#171717]">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-red-600 text-sm font-bold text-white">
                          {!logoUrl ? (
                            <span>{String(title).charAt(0).toUpperCase()}</span>
                          ) : (
                            <img src={logoUrl} alt={`${title} logo`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{title}</p>
                          {countText ? <p className="text-[11px] text-slate-500">{countText}</p> : null}
                        </div>
                      </div>
                      <span className="text-xs text-red-400">›</span>
                    </Link>
                  );
                })
              ) : (
                <div className="rounded-[18px] bg-[#121212] px-4 py-3 text-sm text-slate-400">
                  No brands available right now.
                </div>
              )}
            </div>
            <Link href="/vehicles" className="text-sm font-semibold text-yellow-400 hover:text-white">View All Brands</Link>
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
              <p className="text-slate-300">+260 977635060</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 gap-3">
          {mobileNavOpen ? (
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[1px] lg:hidden"
            />
          ) : null}

          <nav className={`fixed left-0 top-0 z-50 flex h-full w-[72vw] max-w-[220px] flex-col transform overflow-hidden rounded-r-[20px] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.55)] transition-transform duration-300 lg:hidden ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="bg-black p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Lumana AutoPlanet</p>
                    <p className="text-xs text-slate-400">Premium marketplace</p>
                  </div>
                </div>
                <button type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white/5 text-slate-200 transition hover:bg-white/10">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/vehicles" onClick={() => setMobileNavOpen(false)} className="rounded-[14px] bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white">
                  Browse Cars
                </Link>
                <Link href="/contact" onClick={() => setMobileNavOpen(false)} className="rounded-[14px] bg-[#161b24] px-3 py-2 text-center text-sm font-semibold text-slate-200">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
              <div className="rounded-[16px] bg-black p-2">
                <div className="space-y-1.5">
                  {navItems.map((item) => {
                    const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={
                          'flex items-center gap-2.5 rounded-[14px] px-2.5 py-2.5 text-sm transition ' +
                          (active ? 'bg-red-600/90 text-white shadow-sm' : 'text-slate-300 hover:bg-white/5')
                        }
                      >
                        <span className={'flex h-8 w-8 items-center justify-center rounded-[12px] ' + (active ? 'bg-white/15 text-white' : 'bg-[#191f2a] text-red-400')}>
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
              </div>

              <div className="mt-3 rounded-[16px] bg-black p-3 text-sm text-slate-300">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Need Help?</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Speak to our team for vehicle sourcing, import support, and account help.</p>
                <Link href="/contact" onClick={() => setMobileNavOpen(false)} className="mt-3 inline-flex items-center justify-center rounded-[14px] bg-yellow-500 px-3 py-2 text-sm font-semibold text-[#0b0b0b]">
                  Contact Support
                </Link>
              </div>
            </div>
          </nav>

          <section className="flex-1 min-w-0 space-y-6 pb-24 lg:pb-0">
            <div className="rounded-[24px] bg-[#0d0d0d] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.35)] sm:p-6">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex w-full flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 lg:hidden">
                    <Link href="/" aria-label="Lumana AutoPlanet home" className="flex items-center">
                      <img src="/lumana-logo.png" alt="Lumana AutoPlanet" className="h-14 w-auto max-w-[180px] object-contain" />
                    </Link>
                    <button
                      type="button"
                      aria-label="Open navigation"
                      onClick={() => setMobileNavOpen(true)}
                      className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#121212] text-slate-100"
                    >
                      {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="w-full">
                    <SearchBox />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <CurrencySwitcher />
                  <button className="rounded-[18px] bg-[#121212] px-2 py-1 text-sm text-slate-300">♡</button>
                  <button className="rounded-[18px] bg-[#121212] px-2 py-1 text-sm text-slate-300"><Bell className="h-4 w-4" /></button>
                  {user ? (
                    <div className="relative">
                      <button
                        type="button"
                        aria-expanded={accountMenuOpen}
                        aria-haspopup="menu"
                        onClick={() => setAccountMenuOpen((open) => !open)}
                        className="flex items-center gap-2 rounded-[18px] bg-[#141414] px-2 py-1 text-left text-sm text-white transition hover:bg-[#1d1d1d]"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                          {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                        </span>
                        <span className="hidden max-w-28 truncate sm:inline">{user.name || user.email}</span>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </button>
                      {accountMenuOpen ? (
                        <div role="menu" className="absolute right-0 top-full z-30 mt-2 w-56 rounded-[18px] border border-white/10 bg-[#151515] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                          <div className="border-b border-white/10 px-3 pb-2">
                            <p className="truncate text-sm font-semibold text-white">{user.name || 'Your account'}</p>
                            <p className="truncate text-xs text-slate-400">{user.email}</p>
                          </div>
                          <AccountLink href={user.role === 'ADMIN' ? '/admin' : user.role === 'DEALER' ? '/seller' : '/buyer'} label="Dashboard" icon={<UserRound className="h-4 w-4" />} onClick={() => setAccountMenuOpen(false)} />
                          <AccountLink href={user.role === 'DEALER' ? '/seller/profile' : '/buyer/profile'} label="Profile" icon={<UserRound className="h-4 w-4" />} onClick={() => setAccountMenuOpen(false)} />
                          <AccountLink href={user.role === 'DEALER' ? '/seller/orders' : '/buyer/orders'} label="Orders" icon={<span className="text-sm">▣</span>} onClick={() => setAccountMenuOpen(false)} />
                          {user.role !== 'DEALER' && user.role !== 'ADMIN' ? <AccountLink href="/buyer/saved" label="Saved vehicles" icon={<span className="text-sm">♡</span>} onClick={() => setAccountMenuOpen(false)} /> : null}
                          <button type="button" role="menuitem" onClick={handleLogout} className="mt-1 flex w-full items-center gap-3 rounded-[12px] px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10">
                            <LogOut className="h-4 w-4" />
                            Log out
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <Link href="/auth/login" className="rounded-[18px] bg-[#141414] px-2 py-1 text-sm text-white">Login</Link>
                      <Link href="/auth/signup" className="rounded-[18px] bg-yellow-500 px-3 py-1 text-sm font-semibold text-[#0b0b0b]">Sign Up</Link>
                    </>
                  )}
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

function AccountLink({ href, label, icon, onClick }: { href: string; label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} role="menuitem" onClick={onClick} className="flex items-center gap-3 rounded-[12px] px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5">
      {icon}
      {label}
    </Link>
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
    <form onSubmit={onSubmit} className="flex w-full items-center gap-2 rounded-[18px] bg-[#121212] px-3 py-2 text-sm text-slate-300">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search vehicles, make, model, VIN..."
        className="min-w-0 flex-1 bg-transparent outline-none text-slate-200"
        aria-label="Search vehicles"
      />
      <button type="submit" className="shrink-0 rounded-[12px] bg-red-600 px-3 py-1 text-sm text-white">Search</button>
    </form>
  );
}
