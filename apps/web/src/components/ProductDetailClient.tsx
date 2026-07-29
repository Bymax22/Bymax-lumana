"use client";

import React, { useState } from 'react';
import { publicApi } from '@/lib/publicApi';
import ConvertedAmount from '@/components/ConvertedAmount';
import Link from 'next/link';
import { getCurrentUserId } from '@/lib/auth';

export default function ProductDetailClient({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  function addToCart() {
    try {
      const raw = localStorage.getItem('cart') || '[]';
      const list: { productId: string; quantity: number }[] = JSON.parse(raw);
      const idx = list.findIndex((i) => i.productId === product.id);
      if (idx === -1) {
        list.push({ productId: product.id, quantity });
      } else {
        list[idx].quantity += quantity;
      }
      localStorage.setItem('cart', JSON.stringify(list));
      setMessage('Added to cart');
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      setMessage('Unable to update cart');
    }
  }

  async function buyNow() {
    const userId = getCurrentUserId();
    if (!userId) {
      setMessage('Please sign in to continue');
      return;
    }
    const shippingAddress = prompt('Enter shipping address');
    if (!shippingAddress) return;

    try {
      const payload = { userId, shippingAddress };
      await publicApi('/shop/orders', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('Order placed successfully');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Unable to place order');
    }
  }

  return (
    <div className="rounded bg-[#0d0d0d] p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="h-64 w-full rounded-md bg-[#0d0d0d]" />
        </div>
        <div className="col-span-2">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <p className="text-slate-400">{product.sku}</p>
          <div className="mt-4 flex items-center gap-3">
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-24 rounded bg-[#121212] px-3 py-2" />
            <button onClick={addToCart} className="rounded bg-red-600 px-4 py-2 text-white">Add to Cart</button>
            <button onClick={buyNow} className="ml-2 rounded bg-emerald-600 px-4 py-2 text-white">Buy Now</button>
            <Link href="/shop/cart" className="ml-2 rounded bg-gray-800 px-4 py-2">Go to Cart</Link>
          </div>
          {message ? <div className="mt-3 text-sm text-emerald-300">{message}</div> : null}

          <div className="mt-6 text-sm text-slate-300">
            <h4 className="font-semibold">Details</h4>
            <p>{product.description || 'No description available'}</p>
            <p className="mt-2">Price: {product.price ? <ConvertedAmount amountUsd={product.price} /> : '—'}</p>
            <p>Stock: {product.stock ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
