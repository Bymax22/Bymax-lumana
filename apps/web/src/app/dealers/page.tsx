import { Building2 } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

export default async function DealersPage() {
  let dealers = [];
  let errorMessage = '';

  try {
    dealers = await publicApi('/dealers');
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 text-slate-300">
            <Building2 className="h-6 w-6 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">Car Dealers</h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-400">Dealer records are pulled directly from your database, keeping the public directory aligned with your backend inventory.</p>
        </div>

        {errorMessage ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load dealers: {errorMessage}</div>
        ) : dealers.length === 0 ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No dealers found. Add dealer profiles in the admin area to make them visible here.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {dealers.map((dealer: any) => (
              <div key={dealer.id} className="rounded-[24px] bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <h2 className="text-xl font-semibold text-white">{dealer.name}</h2>
                <p className="mt-2 text-sm text-slate-400">Code: {dealer.code}</p>
                <p className="mt-4 text-sm text-slate-300">Contact: {dealer.contactName || 'Not available'}</p>
                <p className="text-sm text-slate-300">Phone: {dealer.contactPhone || 'Not available'}</p>
                <p className="mt-3 text-sm text-slate-400">{dealer.address || 'Address not set'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
