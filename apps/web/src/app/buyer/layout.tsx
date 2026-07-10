import Link from 'next/link';
import BuyerGuard from '@/components/BuyerGuard';

export const metadata = { title: 'Buyer Portal' };

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <BuyerGuard>
      <div className="min-h-screen bg-[#0b0b0b] text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex gap-6">
            <aside className="w-64">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Buyer</h3>
                <nav className="flex flex-col gap-2 text-sm">
                  <Link href="/buyer" className="text-slate-300 hover:text-white">Dashboard</Link>
                  <Link href="/buyer/vehicles" className="text-slate-300 hover:text-white">Marketplace</Link>
                  <Link href="/buyer/saved" className="text-slate-300 hover:text-white">Saved</Link>
                  <Link href="/buyer/orders" className="text-slate-300 hover:text-white">Orders</Link>
                  <Link href="/buyer/profile" className="text-slate-300 hover:text-white">Profile</Link>
                </nav>
              </div>
            </aside>

            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </BuyerGuard>
  );
}
