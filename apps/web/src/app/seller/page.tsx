import Link from 'next/link';
import { publicApi } from '@/lib/publicApi';

export default async function SellerDashboard() {
  const vehicles = await publicApi('/vehicles').catch(() => []);
  const myVehicles = Array.isArray(vehicles) ? vehicles.slice(0, 10) : [];

  return (
    <section className="space-y-6">
      <div className="rounded bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold">Seller Dashboard</h2>
        <p className="text-slate-400">Quick overview</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded bg-[#121212] p-4">
            <div className="text-sm text-slate-400">My Vehicles</div>
            <div className="text-xl font-bold">{myVehicles.length}</div>
          </div>
          <div className="rounded bg-[#121212] p-4">
            <div className="text-sm text-slate-400">Recent Orders</div>
            <div className="text-xl font-bold">0</div>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/seller/vehicles" className="rounded bg-yellow-500 px-4 py-2 text-black">Manage Vehicles</Link>
        </div>
      </div>
    </section>
  );
}
