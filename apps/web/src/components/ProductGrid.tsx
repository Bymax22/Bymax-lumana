"use client";

import { useCurrency } from '@/context/CurrencyContext';
import Link from 'next/link';

interface ProductGridProps {
  products: any[];
  errorMessage?: string;
}

export default function ProductGrid({ products, errorMessage }: ProductGridProps) {
  const { formatAmount } = useCurrency();

  if (errorMessage) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-red-400">Unable to load products: {errorMessage}</div>;
  }

  if (!products || products.length === 0) {
    return <div className="rounded-[24px] bg-[#121212] p-6 text-slate-300">No products found.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <div key={p.id} className="rounded-[24px] bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="mt-2 text-xl font-semibold text-white">{p.name}</h2>
              <p className="text-sm text-slate-400">{p.category?.name || 'Category'}</p>
            </div>
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs uppercase text-white">Shop</span>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p><span className="font-semibold text-white">SKU:</span> {p.sku || 'N/A'}</p>
            <p><span className="font-semibold text-white">Stock:</span> {p.stock ?? 0}</p>
            <p><span className="font-semibold text-white">Price:</span> {p.price ? formatAmount(p.price) : 'Contact'}</p>
            <p className="mt-2">{p.description ? p.description.slice(0, 120) : ''}</p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Link href={`/shop/${p.id}`} className="rounded bg-gray-800 px-4 py-2 text-sm">View</Link>
            <button
              onClick={() => {
                try {
                  const list = JSON.parse(localStorage.getItem('cart') || '[]');
                  list.push({ productId: p.id, quantity: 1 });
                  localStorage.setItem('cart', JSON.stringify(list));
                  alert('Added to cart');
                } catch (e) {
                  alert('Unable to add to cart');
                }
              }}
              className="ml-2 rounded bg-red-600 px-4 py-2 text-sm text-white"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
