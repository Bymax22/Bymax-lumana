import Link from 'next/link';
import SellerGuard from '@/components/SellerGuard';

export const metadata = { title: 'Seller Portal' };

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <SellerGuard>
      <div className="min-h-screen bg-[#070707] text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex gap-6">
            <aside className="w-64">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Seller</h3>
                <nav className="flex flex-col gap-2 text-sm">
                  <Link href="/seller" className="text-slate-300 hover:text-white">Dashboard</Link>
                  <Link href="/seller/vehicles" className="text-slate-300 hover:text-white">My Vehicles</Link>
                  <Link href="/seller/vehicles/new" className="text-slate-300 hover:text-white">Add Vehicle</Link>
                  <Link href="/seller/orders" className="text-slate-300 hover:text-white">Orders & Sales</Link>
                  <Link href="/seller/profile" className="text-slate-300 hover:text-white">Profile</Link>
                </nav>
              </div>
            </aside>

            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </SellerGuard>
  );
}
