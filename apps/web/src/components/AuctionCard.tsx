'use client';

import { useState } from 'react';
import { Gavel } from 'lucide-react';
import { publicApi } from '@/lib/publicApi';
import ConvertedAmount from '@/components/ConvertedAmount';
import ShareButton from '@/components/ShareButton';

export default function AuctionCard({ auction }: { auction: any }) {
  const minimum = Number(auction.currentPrice ?? auction.startingPrice ?? 0);
  const [amount, setAmount] = useState(String(minimum + 1));
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const status = String(auction.status || '').toUpperCase();

  async function placeBid(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await publicApi(`/auctions/${auction.id}/bids`, {
        method: 'POST',
        body: JSON.stringify({ amount: Number(amount) }),
      });
      setMessage('Bid placed successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to place bid.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="rounded-[24px] bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-slate-500">{status || 'Unknown'}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{auction.title || `${auction.vehicle?.make || ''} ${auction.vehicle?.model || ''}`}</h2>
        </div>
        <div className="flex items-center gap-2"><ShareButton title={auction.title || `${auction.vehicle?.make || ''} ${auction.vehicle?.model || ''} auction`} description={`Auction status: ${status}. Current price: ${minimum}.`} details={[`Mileage: ${auction.vehicle?.mileage ?? 'Not specified'}`, `Location: ${auction.vehicle?.location || 'Contact Lumana'}`, `Auction ends: ${auction.endAt ? new Date(auction.endAt).toLocaleString() : 'Not specified'}`]} imageUrl={auction.vehicle?.images?.[0]?.url || auction.vehicle?.images?.[0]} url={auction.vehicle?.id ? `/vehicles/${auction.vehicle.id}` : `/auctions#${auction.id}`} /><span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold uppercase text-black">Auction</span></div>
      </div>
      <div className="mt-5 space-y-3 text-sm text-slate-300">
        <p><span className="font-semibold text-white">Start:</span> {new Date(auction.startAt).toLocaleString()}</p>
        <p><span className="font-semibold text-white">End:</span> {new Date(auction.endAt).toLocaleString()}</p>
        <p><span className="font-semibold text-white">Current price:</span> <ConvertedAmount amountUsd={minimum} /></p>
      </div>
      {status === 'LIVE' ? (
        <form onSubmit={placeBid} className="mt-6 flex flex-wrap gap-3">
          <label className="sr-only" htmlFor={`bid-${auction.id}`}>Your bid</label>
          <input id={`bid-${auction.id}`} type="number" min={minimum + 0.01} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className="min-w-0 flex-1 rounded-xl bg-black px-3 py-2 text-white outline-none ring-1 ring-yellow-400/30 focus:ring-yellow-400" />
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60"><Gavel size={16} /> {submitting ? 'Submitting' : 'Place bid'}</button>
          {message ? <p className="basis-full text-sm text-yellow-300">{message}</p> : null}
        </form>
      ) : null}
    </article>
  );
}
