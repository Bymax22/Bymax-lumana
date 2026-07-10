import Link from 'next/link';
import { publicApi } from '@/lib/publicApi';

export default async function VehiclesPage() {
  const vehicles = await publicApi('/vehicles').catch(() => []);

  return (
    <section className="space-y-6">
      <div className="rounded bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold">Marketplace</h2>
        <p className="text-slate-400">Browse available vehicles</p>

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v: any) => (
            <Link key={v.id} href={`/buyer/vehicles/${v.id}`} className="block rounded bg-[#121212] p-4">
              <div className="h-40 w-full rounded-md bg-[#0d0d0d]" />
              <h3 className="mt-3 text-lg font-semibold text-white">{v.make} {v.model}</h3>
              <p className="text-sm text-slate-400">{v.year}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
