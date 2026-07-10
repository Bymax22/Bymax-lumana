"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/publicApi';

export default function BuyerVehicleDetail({ vehicle }: { vehicle: any }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('savedVehicles') || '[]');
      setSaved(list.includes(vehicle.id));
    } catch (e) {
      setSaved(false);
    }
  }, [vehicle?.id]);

  function toggleSave() {
    try {
      const raw = localStorage.getItem('savedVehicles') || '[]';
      const list: string[] = JSON.parse(raw);
      const idx = list.indexOf(vehicle.id);
      if (idx === -1) {
        list.push(vehicle.id);
        setSaved(true);
        setMessage('Saved to favorites');
      } else {
        list.splice(idx, 1);
        setSaved(false);
        setMessage('Removed from favorites');
      }
      localStorage.setItem('savedVehicles', JSON.stringify(list));
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      setMessage('Unable to update saved items');
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
    const payload = { vehicleId: vehicle.id, amount: vehicle.price || 0 };
    try {
      await publicApi('/orders', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('Order placed successfully');
      // add to local orders as well
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push({ ...payload, id: Date.now().toString(), createdAt: new Date().toISOString() });
      localStorage.setItem('orders', JSON.stringify(orders));
      setTimeout(() => router.push('/buyer/orders'), 800);
    } catch (err) {
      try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push({ ...payload, id: Date.now().toString(), createdAt: new Date().toISOString(), local: true });
        localStorage.setItem('orders', JSON.stringify(orders));
        setMessage('Order saved locally (no API)');
        setTimeout(() => router.push('/buyer/orders'), 800);
      } catch (e) {
        setMessage('Unable to place order');
      }
    }
  }

  return (
    <div className="rounded bg-[#0d0d0d] p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="h-64 w-full rounded-md bg-[#0d0d0d]" />
        </div>
        <div className="col-span-2">
          <h2 className="text-2xl font-semibold">{vehicle.make} {vehicle.model}</h2>
          <p className="text-slate-400">{vehicle.year} • {vehicle.mileage ? `${vehicle.mileage} km` : ''}</p>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={toggleSave} className="rounded bg-gray-800 px-4 py-2">{saved ? 'Unsave' : 'Save'}</button>
            <button onClick={contactSeller} className="rounded bg-red-600 px-4 py-2">Contact Seller</button>
            <button onClick={placeBid} className="rounded bg-gray-800 px-4 py-2">Place Bid</button>
            <button onClick={buyNow} className="ml-2 rounded bg-emerald-600 px-4 py-2">Buy Now</button>
          </div>
          {message ? <div className="mt-3 text-sm text-emerald-300">{message}</div> : null}
          <div className="mt-6 text-sm text-slate-300">
            <h4 className="font-semibold">Details</h4>
            <p>{vehicle.description || 'No description available'}</p>
            <p className="mt-2">Price: {vehicle.price ? vehicle.price : '—'}</p>
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
