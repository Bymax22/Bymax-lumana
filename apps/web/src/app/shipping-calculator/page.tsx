import { Truck } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

export default async function ShippingCalculatorPage() {
  let shipments = [];
  let errorMessage = '';

  try {
    shipments = await publicApi('/logistics');
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 text-slate-300">
            <Truck className="h-6 w-6 text-sky-400" />
            <h1 className="text-3xl font-bold text-white">Shipping Calculator</h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-400">Estimate shipping costs using logistics providers from your database. These rates reflect the backend logistics catalog.</p>
        </div>

        {errorMessage ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load logistics data: {errorMessage}</div>
        ) : shipments.length === 0 ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No shipping providers are configured. Add logistics entries in the backend to populate this page.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {shipments.map((shipment: any) => (
              <div key={shipment.id} className="rounded-[24px] bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{shipment.carrier || 'Carrier'}</h2>
                    <p className="text-sm text-slate-400">Status: {shipment.status}</p>
                  </div>
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs uppercase text-white">{shipment.bookingRef || 'No ref'}</span>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <p><span className="font-semibold text-white">Origin:</span> {shipment.origin || 'Unknown'}</p>
                  <p><span className="font-semibold text-white">Destination:</span> {shipment.destination || 'Unknown'}</p>
                  <p><span className="font-semibold text-white">ETA:</span> {shipment.eta ? new Date(shipment.eta).toLocaleDateString() : 'TBD'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
