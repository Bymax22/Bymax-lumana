"use client";

import { useEffect, useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import Link from 'next/link';

interface ProductGridProps {
  products: any[];
  errorMessage?: string;
}

function ProductCard({ product }: { product: any }) {
  const { formatAmount } = useCurrency();
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
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const raw = window.localStorage.getItem('cart') || '[]';
      const list: { productId: string; quantity: number }[] = JSON.parse(raw);
      setInCart(list.some((item) => item.productId === product.id));
    } catch {
      setInCart(false);
    }
  }, [product.id]);

  function handleAddToCart() {
    try {
      const raw = window.localStorage.getItem('cart') || '[]';
      const list: { productId: string; quantity: number }[] = JSON.parse(raw);
      const existing = list.findIndex((item) => item.productId === product.id);
      if (existing === -1) {
        list.push({ productId: product.id, quantity: 1 });
      } else {
        list[existing].quantity += 1;
      }
      window.localStorage.setItem('cart', JSON.stringify(list));
      setInCart(true);
    } catch {
      // no-op
    }
  }

  return (
    <div className="rounded-[24px] bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="mt-2 text-xl font-semibold text-white">{product.name}</h2>
          <p className="text-sm text-slate-400">{product.category?.name || 'Category'}</p>
        </div>
        <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs uppercase text-white">Shop</span>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-300">
        <p><span className="font-semibold text-white">SKU:</span> {product.sku || 'N/A'}</p>
        <p><span className="font-semibold text-white">Stock:</span> {product.stock ?? 0}</p>
        <p><span className="font-semibold text-white">Price:</span> {product.price ? formatAmount(product.price) : 'Contact'}</p>
        <p className="mt-2">{product.description ? product.description.slice(0, 120) : ''}</p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Link href={`/shop/${product.id}`} className="rounded bg-gray-800 px-4 py-2 text-sm">View</Link>
        {inCart ? (
          <Link href="/shop/cart" className="rounded bg-emerald-600 px-4 py-2 text-sm text-white">View Cart</Link>
        ) : (
          <button onClick={handleAddToCart} className="ml-2 rounded bg-red-600 px-4 py-2 text-sm text-white">Add to Cart</button>
        )}
      </div>
    </div>
  );
}

export default function ProductGrid({ products, errorMessage }: ProductGridProps) {
  if (errorMessage) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load products: {errorMessage}</div>;
  }

  if (!products || products.length === 0) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No products found.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
