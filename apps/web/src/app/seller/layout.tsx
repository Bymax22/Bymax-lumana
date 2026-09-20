import Link from 'next/link';
import { BarChart3, CarFront, ClipboardList, LayoutDashboard, Plus, UserRound } from 'lucide-react';
import SellerGuard from '@/components/SellerGuard';

export const metadata = { title: 'Seller Portal', robots: { index: false, follow: false } };

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <SellerGuard>
      <div className="min-h-screen bg-[#080a0c] text-white">
        <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col gap-8 px-4 py-5 sm:px-6 lg:flex-row lg:px-8">
          <aside className="flex shrink-0 flex-col justify-between lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:w-64">
            <div>
              <div className="mb-8 flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-[#101010] shadow-lg shadow-yellow-400/10"><CarFront size={21} strokeWidth={2.5} /></div>
                <div><p className="text-sm font-semibold tracking-[0.18em] text-yellow-300">LUMANA</p><p className="text-xs text-slate-500">Seller workspace</p></div>
              </div>
              <nav className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5 lg:grid-cols-1">
                <Link href="/seller" className="flex items-center gap-3 rounded-xl bg-[#171a1d] px-4 py-3 font-medium text-white shadow-lg shadow-black/10 transition hover:bg-[#202428]"><LayoutDashboard size={17} className="text-yellow-300" /> Dashboard</Link>
                <Link href="/seller/vehicles" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-[#171a1d] hover:text-white"><CarFront size={17} /> My Vehicles</Link>
                <Link href="/seller/vehicles/new" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-[#171a1d] hover:text-white"><Plus size={17} /> Add Vehicle</Link>
                <Link href="/seller/orders" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-[#171a1d] hover:text-white"><ClipboardList size={17} /> Orders & Sales</Link>
                <Link href="/seller/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-[#171a1d] hover:text-white"><UserRound size={17} /> Profile</Link>
              </nav>
            </div>
            <div className="mt-6 hidden rounded-2xl bg-[#121619] p-4 lg:block"><div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"><BarChart3 size={14} className="text-yellow-300" /> Seller tip</div><p className="text-sm leading-6 text-slate-300">Detailed photos and complete specifications help listings earn trust faster.</p><Link href="/seller/vehicles/new" className="mt-4 inline-flex text-sm font-semibold text-yellow-300 hover:text-yellow-200">Improve a listing <span className="ml-1">→</span></Link></div>
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
    </SellerGuard>
  );
}
