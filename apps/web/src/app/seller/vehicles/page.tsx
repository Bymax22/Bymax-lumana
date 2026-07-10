import Link from 'next/link';
import { publicApi } from '@/lib/publicApi';

export default async function SellerVehiclesPage() {
  const vehicles = await publicApi('/vehicles').catch(() => []);
  const my = Array.isArray(vehicles) ? vehicles.slice(0, 20) : [];

  return (
    <section className="p-6">
      <div className="rounded bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold">My Vehicles</h2>
        <p className="text-slate-400">Manage your inventory</p>

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {my.map((v: any) => (
            <div key={v.id} className="block rounded bg-[#121212] p-4">
              <div className="h-40 w-full rounded-md bg-[#0d0d0d]" />
              <h3 className="mt-3 text-lg font-semibold text-white">{v.make} {v.model}</h3>
              <p className="text-sm text-slate-400">{v.year}</p>
              <div className="mt-3 flex gap-2">
                <Link href={`/seller/vehicles/${v.id}`} className="rounded bg-yellow-500 px-3 py-1 text-black">Edit</Link>
                <Link href={`/seller/vehicles/${v.id}`} className="rounded bg-gray-800 px-3 py-1">View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
