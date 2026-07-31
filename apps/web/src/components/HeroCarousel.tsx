"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ConvertedAmount from "@/components/ConvertedAmount";

function getItemImageUrl(item: any): string | null {
  if (!item) return null;
  const direct = item.imageUrl ?? item.thumbnail ?? item.coverImage;
  if (typeof direct === "string" && direct.trim()) return direct;
  const gallery = item.images ?? item.imageUrls ?? [];
  if (Array.isArray(gallery)) {
    const first = gallery[0];
    if (typeof first === "string" && first.trim()) return first;
    if (first && typeof first === "object") {
      const nestedUrl = first.url ?? first.secure_url ?? first.src;
      if (typeof nestedUrl === "string" && nestedUrl.trim()) return nestedUrl;
    }
  }
  return null;
}

export default function HeroCarousel({ items }: { items: any[] }) {
  const [index, setIndex] = useState(0);
  const length = Array.isArray(items) ? items.length : 0;
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!length) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, 4200);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [length]);

  if (!length) {
    return <div className="relative h-[330px] w-full rounded-[24px] bg-[#070707]" />;
  }

  return (
    <div className="relative h-[330px] w-full">
      <div
        className="absolute inset-0 flex h-full w-full transition-transform duration-700"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((it: any, i: number) => {
          const img = getItemImageUrl(it);
          const price = it.price ? <ConvertedAmount amountUsd={it.price} /> : it.basePrice ? <ConvertedAmount amountUsd={it.basePrice} /> : 'Contact';

          return (
            <Link
              key={it.id || i}
              href={it.id ? `/buyer/vehicles/${it.id}` : '#'}
              className="relative flex h-full w-full flex-shrink-0 items-end justify-start overflow-hidden rounded-[24px] bg-[#070707]"
            >
              {img ? (
                <img src={img} alt={it.make || it.name || 'Item'} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0b0b0b] to-[#111] text-sm text-slate-500">No image</div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              <div className="relative z-10 w-full p-6 sm:p-8">
                <div className="max-w-xl">
                  <p className="text-sm uppercase text-slate-300">{it.forSale ? 'For Sale' : it.forHire ? 'For Hire' : 'Featured'}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{(it.make ? `${it.make} ` : '') + (it.model || it.name || '')}</h3>
                  <p className="mt-1 text-sm text-slate-300">{it.year ? String(it.year) : it.location || ''}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="text-lg font-semibold text-red-400">{price}</div>
                    <div className="ml-auto">
                      <span className="rounded-[18px] bg-yellow-500 px-4 py-2 text-sm font-semibold text-[#0b0b0b]">View</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-8 rounded-full ${i === index ? 'bg-white' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
