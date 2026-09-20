import Link from 'next/link';
import { Bookmark, CarFront, ClipboardList, Compass, Gavel, LayoutDashboard, UserRound } from 'lucide-react';
import BuyerGuard from '@/components/BuyerGuard';

export const metadata = { title: 'Buyer Portal', robots: { index: false, follow: false } };

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <BuyerGuard>
      <div className="min-h-screen bg-[#080a0c] text-white">
        <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col gap-8 px-4 py-5 sm:px-6 lg:flex-row lg:px-8">
          <aside className="flex shrink-0 flex-col justify-between lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:w-64">
            <div>
              <div className="mb-8 flex items-center gap-3 px-2"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/10"><CarFront size={21} strokeWidth={2.5} /></div><div><p className="text-sm font-semibold tracking-[0.18em] text-red-300">LUMANA</p><p className="text-xs text-slate-500">Buyer workspace</p></div></div>
              <nav className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-1">
                <Link href="/buyer" className="flex items-center gap-3 rounded-xl bg-[#171a1d] px-4 py-3 font-medium text-white shadow-lg shadow-black/10 transition hover:bg-[#202428]"><LayoutDashboard size={17} className="text-red-300" /> Dashboard</Link>
                <Link href="/buyer/vehicles" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-[#171a1d] hover:text-white"><Compass size={17} /> Marketplace</Link>
                <Link href="/buyer/saved" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-[#171a1d] hover:text-white"><Bookmark size={17} /> Saved</Link>
                <Link href="/buyer/orders" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-[#171a1d] hover:text-white"><ClipboardList size={17} /> Orders</Link>
                <Link href="/buyer/bookings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-[#171a1d] hover:text-white"><CarFront size={17} /> Bookings</Link>
                <Link href="/buyer/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-[#171a1d] hover:text-white"><UserRound size={17} /> Profile</Link>
              </nav>
            </div>
            <div className="mt-6 hidden rounded-2xl bg-[#121619] p-4 lg:block"><div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"><Gavel size={14} className="text-red-300" /> Buyer tip</div><p className="text-sm leading-6 text-slate-300">Save vehicles you like so you can compare them when you are ready.</p><Link href="/buyer/vehicles" className="mt-4 inline-flex text-sm font-semibold text-red-300 hover:text-red-200">Explore vehicles <span className="ml-1">→</span></Link></div>
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
    </BuyerGuard>
  );
}
