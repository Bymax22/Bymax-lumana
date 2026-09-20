"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/publicApi';
import { getCurrentUserId, getStoredSessionToken } from '@/lib/auth';
import ConvertedAmount from '@/components/ConvertedAmount';

export default function BuyerVehicleDetail({ vehicle }: { vehicle: any }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const endpoint = getStoredSessionToken() ? `/vehicles/${vehicle.id}/save-status` : `/vehicles/${vehicle.id}/save-count`;
    publicApi<{ saved?: boolean }>(endpoint)
      .then((result) => setSaved(Boolean(result.saved)))
      .catch(() => setSaved(false));
  }, [vehicle?.id]);

  async function toggleSave() {
    if (!getStoredSessionToken()) {
      setMessage('Please log in to save this vehicle');
      return;
    }

    try {
      const result = await publicApi<{ saved: boolean }>(`/vehicles/${vehicle.id}/save`, { method: 'POST' });
      setSaved(result.saved);
      setMessage(result.saved ? 'Saved to favorites' : 'Removed from favorites');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update saved items');
    }
  }

  async function placeBid() {
    const raw = prompt('Enter your bid amount (numeric)');
    if (!raw) return;
    const amount = Number(raw.replace(/,/g, ''));
    if (Number.isNaN(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }

    const payload = { vehicleId: vehicle.id, amount };
    try {
      await publicApi('/bids', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('Bid placed successfully');
    } catch (err) {
      // fallback: save locally
      try {
        const bids = JSON.parse(localStorage.getItem('bids') || '[]');
        bids.push({ ...payload, createdAt: new Date().toISOString() });
        localStorage.setItem('bids', JSON.stringify(bids));
        setMessage('Bid queued locally (no API)');
      } catch (e) {
        setMessage('Unable to place bid');
      }
    }
    setTimeout(() => setMessage(''), 2500);
  }

  async function contactSeller() {
    if (vehicle?.sellerEmail) {
      window.location.href = `mailto:${vehicle.sellerEmail}?subject=Enquiry%20about%20${encodeURIComponent(
        `${vehicle.make} ${vehicle.model}`
      )}`;
      return;
    }

    // fallback: open contact page or show message
    setMessage('Seller contact not available');
    setTimeout(() => setMessage(''), 2000);
  }

  async function buyNow() {
    if (!confirm('Proceed to purchase this vehicle?')) return;
    const userId = getCurrentUserId();
    if (!userId) {
      setMessage('Please log in before purchasing a vehicle');
      return;
    }

    const payload = { userId, shippingAddress: 'To be confirmed', paymentMethod: 'BANK_TRANSFER' };
    try {
      const order = await publicApi(`/vehicles/${vehicle.id}/purchase`, { method: 'POST', body: JSON.stringify(payload) });
      setMessage('Order placed successfully');
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push({ ...order, vehicleId: vehicle.id, amount: vehicle.price || 0, createdAt: new Date().toISOString() });
      localStorage.setItem('orders', JSON.stringify(orders));
      setTimeout(() => router.push('/buyer/orders'), 800);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to place order');
    }
  }

  return (
    <div className="rounded bg-[#0d0d0d] p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="h-64 w-full overflow-hidden rounded-md bg-[#0d0d0d]">
            {vehicle.images?.[0]?.url ? <img src={vehicle.images[0].url} alt={`${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-slate-500">No image available</div>}
          </div>
        </div>
        <div className="col-span-2">
          <h2 className="text-2xl font-semibold">{vehicle.make} {vehicle.model}</h2>
          <p className="text-slate-400">{vehicle.year} • {vehicle.mileage ? `${vehicle.mileage} km` : ''}</p>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={toggleSave} className="rounded bg-gray-800 px-4 py-2">{saved ? 'Unsave' : 'Save'}</button>
            <button onClick={contactSeller} className="rounded bg-red-600 px-4 py-2">Contact Seller</button>
            <button onClick={placeBid} className="rounded bg-gray-800 px-4 py-2">Place Bid</button>
            <button onClick={buyNow} disabled={vehicle.status === 'SOLD'} className="ml-2 rounded bg-emerald-600 px-4 py-2 disabled:cursor-not-allowed disabled:bg-slate-700">{vehicle.status === 'SOLD' ? 'Sold' : 'Buy Now'}</button>
          </div>
          {message ? <div className="mt-3 text-sm text-emerald-300">{message}</div> : null}
          <div className="mt-6 text-sm text-slate-300">
            <h4 className="font-semibold">Details</h4>
            <p>{vehicle.description || 'No description available'}</p>
            <p className="mt-2">Price: {vehicle.price ? <ConvertedAmount amountUsd={Number(vehicle.price)} /> : '—'}</p>
            <p>Location: {vehicle.location || '—'}</p>
            <p>Seller: {vehicle.sellerName || '—'}</p>
            {vehicle.sellerPhone ? (
              <p>Phone: <a href={`tel:${vehicle.sellerPhone}`}>{vehicle.sellerPhone}</a></p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Link href="/buyer/vehicles" className="text-sm text-slate-400 hover:underline">Back to marketplace</Link>
      </div>
    </div>
  );
}
