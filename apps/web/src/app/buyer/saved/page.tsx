"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SavedPage() {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('savedVehicles') || '[]';
      setList(JSON.parse(raw));
    } catch (e) {
      setList([]);
    }
  }, []);

  function remove(id: string) {
    try {
      const next = list.filter((i) => i !== id);
      localStorage.setItem('savedVehicles', JSON.stringify(next));
      setList(next);
    } catch (e) {
      // ignore
    }
  }

  return (
    <section className="p-6">
      <div className="rounded bg-[#0d0d0d] p-6">
        <h2 className="text-2xl font-semibold">Saved Vehicles</h2>
        <p className="text-slate-400">Your favorites will appear here.</p>

        <div className="mt-6 space-y-3">
          {list.length === 0 ? (
            <div className="text-sm text-slate-400">No saved vehicles yet.</div>
          ) : (
            list.map((id) => (
              <div key={id} className="flex items-center justify-between rounded bg-[#0b0b0b] p-3">
                <Link href={`/buyer/vehicles/${id}`} className="text-white">View {id}</Link>
                <button onClick={() => remove(id)} className="text-sm text-red-400">Remove</button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
