"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ConvertedAmount from '@/components/ConvertedAmount';
import { publicApi } from '@/lib/publicApi';
import { getCurrentUserId } from '@/lib/auth';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    publicApi(`/shop/orders/${userId}`)
      .then((res: any) => setOrders(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">Loading orders…</div>;
  }

  return (
    <section className="p-6">
      <div className="rounded-[24px] bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold text-white">Orders</h2>
        <p className="text-slate-400">Your purchases and hire-related orders will appear here.</p>

        <div className="mt-6 space-y-3">
          {orders.length === 0 ? (
            <div className="text-sm text-slate-400">No orders yet.</div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="rounded-[14px] bg-[#121212] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{o.orderRef}</div>
                    <div className="text-sm text-slate-400">{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-300">Status: {o.status}</div>
                    <div className="text-sm font-semibold text-white"><ConvertedAmount amountUsd={o.totalAmount} /></div>
                    <Link href={`/buyer/orders/${o.id}`} className="mt-2 inline-block rounded bg-gray-800 px-3 py-1 text-sm">View</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
