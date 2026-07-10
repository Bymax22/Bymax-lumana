import { Trophy } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';

export default async function AuctionsPage() {
  let auctions = [];
  let errorMessage = '';

  try {
    auctions = await publicApi('/auctions');
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 text-slate-300">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Live & Upcoming Auctions</h1>
          </div>
          <p className="mt-3 max-w-2xl text-slate-400">All auction listings are loaded from your backend so the homepage and auction page stay in sync with your database.</p>
        </div>

        {errorMessage ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load auctions: {errorMessage}</div>
        ) : auctions.length === 0 ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No auctions are available yet. Add auctions through the admin dashboard to populate this page.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {auctions.map((auction: any) => (
              <div key={auction.id} className="rounded-[24px] bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase text-slate-500">{auction.status || 'Unknown'}</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">{auction.title || auction.vehicle?.make + ' ' + auction.vehicle?.model}</h2>
                  </div>
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs uppercase text-white">Auction</span>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <p><span className="font-semibold text-white">Start:</span> {new Date(auction.startAt).toLocaleString()}</p>
                  <p><span className="font-semibold text-white">End:</span> {new Date(auction.endAt).toLocaleString()}</p>
                  <p><span className="font-semibold text-white">Starting Price:</span> USD {auction.startingPrice?.toFixed(2) ?? 'N/A'}</p>
                  <p><span className="font-semibold text-white">Current Price:</span> USD {auction.currentPrice?.toFixed(2) ?? 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
