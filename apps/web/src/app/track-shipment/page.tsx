import { MapPin } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

export default async function TrackShipmentPage() {
  let logistics = [];
  let errorMessage = '';

  try {
    logistics = await publicApi('/logistics');
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 text-slate-300">
            <MapPin className="h-6 w-6 text-amber-400" />
            <h1 className="text-3xl font-bold text-white">Track Shipment</h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-400">Track active shipment routes and logistics records from the backend.</p>
        </div>

        {errorMessage ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load shipment tracking data: {errorMessage}</div>
        ) : logistics.length === 0 ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No logistics records are available to track yet.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {logistics.map((entry: any) => (
              <div key={entry.id} className="rounded-[24px] bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{entry.carrier || 'Carrier'}</h2>
                    <p className="text-sm text-slate-400">Route ID: {entry.id}</p>
                  </div>
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs uppercase text-white">{entry.status || 'Unknown'}</span>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <p><span className="font-semibold text-white">Origin:</span> {entry.origin || 'Unknown'}</p>
                  <p><span className="font-semibold text-white">Destination:</span> {entry.destination || 'Unknown'}</p>
                  <p><span className="font-semibold text-white">ETA:</span> {entry.eta ? new Date(entry.eta).toLocaleDateString() : 'TBD'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
