import { ShieldCheck } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

export default async function ImportCalculatorPage() {
  let customs = [];
  let errorMessage = '';

  try {
    customs = await publicApi('/customs');
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 text-slate-300">
            <ShieldCheck className="h-6 w-6 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Import Calculator</h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-400">Review customs rates and import rules from the database to estimate your total landed cost.</p>
        </div>

        {errorMessage ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load customs data: {errorMessage}</div>
        ) : customs.length === 0 ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No customs rates are configured. Add customs entries in the backend to use this page.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {customs.map((entry: any) => (
              <div key={entry.id} className="rounded-[24px] bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{entry.country || 'Country'}</h2>
                    <p className="text-sm text-slate-400">{entry.description || 'Customs details available'}</p>
                  </div>
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs uppercase text-white">{entry.status || 'Active'}</span>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <p><span className="font-semibold text-white">Rate:</span> {entry.rate ?? 'TBD'}</p>
                  <p><span className="font-semibold text-white">Type:</span> {entry.type || 'General'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
