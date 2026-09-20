import Link from 'next/link';
import { publicApi } from '@/lib/publicApi';
import VehicleGrid from '@/components/VehicleGrid';

export default async function VehiclesPage() {
  const vehicles = await publicApi('/vehicles').catch(() => []);

  return (
    <section className="space-y-6">
      <div className="rounded bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold">Marketplace</h2>
        <p className="text-slate-400">Browse available vehicles</p>

        <div className="mt-6"><VehicleGrid vehicles={vehicles} errorMessage="" /></div>
      </div>
    </section>
  );
}
