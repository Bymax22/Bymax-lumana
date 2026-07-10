"use client";

import { useEffect, useState } from 'react';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('orders') || '[]';
      setOrders(JSON.parse(raw));
    } catch (e) {
      setOrders([]);
    }
  }, []);

  return (
    <section className="p-6">
      <div className="rounded bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold">Orders & Sales</h2>
        <p className="text-slate-400">Orders placed for your listings</p>

        <div className="mt-6 space-y-3">
          {orders.length === 0 ? (
            <div className="text-sm text-slate-400">No orders yet.</div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="rounded bg-[#0b0b0b] p-3 flex justify-between">
                <div>
                  <div className="text-sm text-slate-300">Order ID: {o.id}</div>
                  <div className="text-sm text-slate-400">Vehicle: {o.vehicleId}</div>
                  <div className="text-sm text-slate-400">Amount: {o.amount}</div>
                </div>
                <div className="text-sm text-slate-400">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
