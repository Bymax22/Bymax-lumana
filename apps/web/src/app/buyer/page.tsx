import Link from 'next/link';
import { publicApi } from '@/lib/publicApi';

export default async function BuyerDashboard() {
  const [vehicles, auctions] = await Promise.all([
    publicApi('/vehicles').catch(() => []),
    publicApi('/auctions').catch(() => []),
  ]);

  const vehicleCount = Array.isArray(vehicles) ? vehicles.length : 0;
  const liveAuctions = Array.isArray(auctions) ? auctions.filter((a: any) => a.status === 'LIVE').length : 0;

  return (
    <section className="space-y-6">
      <div className="rounded bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold">Welcome to Buyer Portal</h2>
        <p className="text-slate-400">Quick stats</p>
        <div className="mt-4 flex gap-4">
          <div className="rounded bg-[#121212] p-4">
            <div className="text-sm text-slate-400">Vehicles</div>
            <div className="text-xl font-bold">{vehicleCount}</div>
          </div>
          <div className="rounded bg-[#121212] p-4">
            <div className="text-sm text-slate-400">Live Auctions</div>
            <div className="text-xl font-bold">{liveAuctions}</div>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/buyer/vehicles" className="rounded bg-red-600 px-4 py-2 text-white">Go to Marketplace</Link>
        </div>
      </div>
    </section>
  );
}
