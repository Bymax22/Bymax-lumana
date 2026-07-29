'use client';

import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/publicApi';
import ConvertedAmount from '@/components/ConvertedAmount';

interface Props {
  params: { id: string };
}

export default function OrderDetailPage({ params }: Props) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi(`/shop/orders/detail/${params.id}`)
      .then((res) => setOrder(res))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">Loading order…</div>;
  }

  if (!order) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">Order not found.</div>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold text-white">Order {order.orderRef}</h2>
        <div className="mt-4 text-slate-300">
          <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
          <p>Status: {order.status}</p>
          <p className="mt-2 font-semibold text-white">Total: <ConvertedAmount amountUsd={order.totalAmount} /></p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white">Items</h3>
          <div className="mt-3 space-y-3">
            {order.items?.map((i: any) => (
              <div key={i.id} className="flex items-center justify-between rounded-[12px] bg-[#121212] p-3">
                <div>
                  <div className="font-semibold text-white">{i.product?.name || i.productId}</div>
                  <div className="text-sm text-slate-400">Qty: {i.quantity}</div>
                </div>
                <div className="text-sm text-slate-300">{i.totalPrice ? <ConvertedAmount amountUsd={i.totalPrice} /> : '-'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
