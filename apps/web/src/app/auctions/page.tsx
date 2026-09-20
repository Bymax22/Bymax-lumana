import { Trophy } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';
import AuctionCard from '@/components/AuctionCard';

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
          <p className="mt-3 max-w-2xl text-slate-400">Find the latest live and upcoming auctions here.</p>
        </div>

        {errorMessage ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load auctions: {errorMessage}</div>
        ) : auctions.length === 0 ? (
          <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No auctions are available yet. Check back later to populate this page.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {auctions.map((auction: any) => <AuctionCard key={auction.id} auction={auction} />)}
          </div>
        )}
      </div>
    </main>
  );
}
