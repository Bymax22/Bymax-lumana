import { CreditCard } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

export default async function FinancePage() {
  let applications = [];
  let errorMessage = '';

  try {
    applications = await publicApi('/finances');
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 text-slate-300">
            <CreditCard className="h-6 w-6 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Finance Options</h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-400">Finance applications are synced directly with your backend. Review active applications and funding status below.</p>
        </div>

        {errorMessage ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load finance applications: {errorMessage}</div>
        ) : applications.length === 0 ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No finance applications are available yet.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {applications.map((application: any) => (
              <div key={application.id} className="rounded-[24px] bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase text-slate-500">Status</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">{application.status || 'Pending'}</h2>
                  </div>
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs uppercase text-white">{application.amount ? `USD ${application.amount.toFixed(2)}` : 'No amount'}</span>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <p><span className="font-semibold text-white">Term:</span> {application.termMonths ?? 'N/A'} months</p>
                  <p><span className="font-semibold text-white">Vehicle:</span> {application.vehicleId || 'Not assigned'}</p>
                  <p><span className="font-semibold text-white">Requested by:</span> {application.userId || 'Unknown user'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
