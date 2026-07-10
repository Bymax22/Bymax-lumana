"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/publicApi';

export default function SellerVehicleForm({ initial = {}, onSaved }: { initial?: any; onSaved?: (v: any) => void }) {
  const router = useRouter();
  const [form, setForm] = useState<any>({ ...initial });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (form.id) {
        await publicApi(`/vehicles/${form.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await publicApi('/vehicles', { method: 'POST', body: JSON.stringify(payload) });
      }
      setMsg('Saved');
      try { onSaved && onSaved(form); } catch (e) {}
      setTimeout(() => router.push('/seller/vehicles'), 600);
    } catch (err) {
      // fallback: save to localStorage
      try {
        const list = JSON.parse(localStorage.getItem('sellerVehicles') || '[]');
        if (form.id) {
          const idx = list.findIndex((x: any) => x.id === form.id);
          if (idx !== -1) list[idx] = { ...list[idx], ...form };
        } else {
          form.id = Date.now().toString();
          list.push(form);
        }
        localStorage.setItem('sellerVehicles', JSON.stringify(list));
        setMsg('Saved locally');
        setTimeout(() => router.push('/seller/vehicles'), 600);
      } catch (e) {
        setMsg('Unable to save');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm text-slate-300">
        Make
        <input value={form.make || ''} onChange={(e) => setForm({ ...form, make: e.target.value })} className="mt-2 w-full rounded bg-[#0b0b0b] px-3 py-2" />
      </label>
      <label className="block text-sm text-slate-300">
        Model
        <input value={form.model || ''} onChange={(e) => setForm({ ...form, model: e.target.value })} className="mt-2 w-full rounded bg-[#0b0b0b] px-3 py-2" />
      </label>
      <label className="block text-sm text-slate-300">
        Year
        <input value={form.year || ''} onChange={(e) => setForm({ ...form, year: e.target.value })} className="mt-2 w-full rounded bg-[#0b0b0b] px-3 py-2" />
      </label>
      <label className="block text-sm text-slate-300">
        Price
        <input value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-2 w-full rounded bg-[#0b0b0b] px-3 py-2" />
      </label>
      <label className="block text-sm text-slate-300">
        Description
        <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 w-full rounded bg-[#0b0b0b] px-3 py-2" />
      </label>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="rounded bg-yellow-500 px-4 py-2">{saving ? 'Saving...' : 'Save'}</button>
        {msg ? <div className="text-sm text-emerald-300">{msg}</div> : null}
      </div>
    </form>
  );
}
