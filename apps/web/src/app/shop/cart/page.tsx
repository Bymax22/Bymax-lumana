"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicApi } from '@/lib/publicApi';
import ConvertedAmount from '@/components/ConvertedAmount';

export default function CartPage() {
  const [items, setItems] = useState<{ product: any; quantity: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const raw = localStorage.getItem('cart') || '[]';
        const cart: { productId: string; quantity: number }[] = JSON.parse(raw);
        const products = await Promise.all(cart.map((c) => publicApi(`/shop/products/${c.productId}`).catch(() => null)));
        const merged = cart.map((c) => ({ product: products.find((p: any) => p && p.id === c.productId) || { id: c.productId, name: 'Unknown', price: 0, stock: 0 }, quantity: c.quantity }));
        setItems(merged);
      } catch (e) {
        setMessage('Unable to load cart');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function saveCartFromState(updated: { productId: string; quantity: number }[]) {
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  }

  function removeItem(productId: string) {
    const updated = items.filter((i) => i.product.id !== productId);
    setItems(updated);
    saveCartFromState(updated.map((i) => ({ productId: i.product.id, quantity: i.quantity })));
  }

  function updateQuantity(productId: string, q: number) {
    const updated = items.map((i) => (i.product.id === productId ? { ...i, quantity: q } : i));
    setItems(updated);
    saveCartFromState(updated.map((i) => ({ productId: i.product.id, quantity: i.quantity })));
  }

  if (loading) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">Loading cart...</div>;
  }

  if (items.length === 0) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">Your cart is empty.</div>;
  }

  const subtotal = items.reduce((s, i) => s + (i.product.price || 0) * i.quantity, 0);

  return (
    <div className="rounded-[24px] bg-[#0d0d0d] p-6">
      <h2 className="text-2xl font-semibold text-white">Shopping Cart</h2>
      <div className="mt-4 space-y-4">
        {items.map((i) => (
          <div key={i.product.id} className="flex items-center justify-between rounded-[14px] bg-[#121212] p-4">
            <div>
              <div className="font-semibold text-white">{i.product.name}</div>
              <div className="text-sm text-slate-400">{i.product.sku}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-300">{i.product.price ? <ConvertedAmount amountUsd={i.product.price} /> : '—'}</div>
              <input type="number" min={1} value={i.quantity} onChange={(e) => updateQuantity(i.product.id, Number(e.target.value))} className="w-20 rounded bg-[#101010] px-2 py-1" />
              <button onClick={() => removeItem(i.product.id)} className="rounded bg-red-600 px-3 py-1 text-white">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-700 bg-[#121212] p-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Subtotal</span>
          <span><ConvertedAmount amountUsd={subtotal} /></span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
          <span>Tax</span>
          <span><ConvertedAmount amountUsd={subtotal * 0.1} /></span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
          <span>Shipping</span>
          <span><ConvertedAmount amountUsd={10} /></span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-700 pt-3 text-base font-semibold text-white">
          <span>Total</span>
          <span><ConvertedAmount amountUsd={subtotal + subtotal * 0.1 + 10} /></span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/shop/checkout" className="rounded bg-emerald-600 px-6 py-3 text-white">Proceed to Checkout</Link>
        {message ? <div className="text-emerald-300">{message}</div> : null}
      </div>
    </div>
  );
}
