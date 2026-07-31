"use client";

import React, { useEffect, useState } from 'react';
import ConvertedAmount from '@/components/ConvertedAmount';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [inCart, setInCart] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const raw = window.localStorage.getItem('cart') || '[]';
      const list: { productId: string; quantity: number }[] = JSON.parse(raw);
      return list.some((item) => item.productId === product.id);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('cart') || '[]';
      const list: { productId: string; quantity: number }[] = JSON.parse(raw);
      setInCart(list.some((item) => item.productId === product.id));
    } catch {
      setInCart(false);
    }
  }, [product.id]);

  function readCart(): { productId: string; quantity: number }[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      return JSON.parse(window.localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  }

  function addToCart() {
    try {
      const list = readCart();
      const idx = list.findIndex((i) => i.productId === product.id);
      if (idx === -1) {
        list.push({ productId: product.id, quantity });
      } else {
        list[idx].quantity += quantity;
      }
      window.localStorage.setItem('cart', JSON.stringify(list));
      setInCart(true);
      setMessage('Added to cart');
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      setMessage('Unable to update cart');
    }
  }

  function buyNow() {
    addToCart();
    router.push('/shop/checkout');
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
          <div className="mt-4 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-24 rounded bg-[#121212] px-3 py-2" />
            </div>
            <div className="flex flex-wrap gap-3">
              {inCart ? (
                <Link href="/shop/cart" className="rounded bg-emerald-600 px-4 py-2 text-white">View Cart</Link>
              ) : (
                <button onClick={addToCart} className="rounded bg-red-600 px-4 py-2 text-white">Add to Cart</button>
              )}
              <button onClick={buyNow} className="rounded bg-emerald-600 px-4 py-2 text-white">Buy Now</button>
            </div>
            {message ? <div className="mt-3 text-sm text-emerald-300">{message}</div> : null}
          </div>

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
