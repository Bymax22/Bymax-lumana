"use client";

import { useEffect, useState } from 'react';

export default function SellerProfilePage() {
  const [user, setUser] = useState<any>({ name: '', email: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {}
  }, []);

  function save() {
    try {
      localStorage.setItem('user', JSON.stringify(user));
      setStatus('Profile saved');
      setTimeout(() => setStatus(''), 2000);
    } catch (e) {
      setStatus('Unable to save');
    }
  }

  return (
    <section className="p-6">
      <div className="rounded bg-[#0d0d0d] p-6 max-w-md">
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-slate-400">Seller account details</p>

        <div className="mt-6 space-y-4">
          <label className="block text-sm text-slate-300">
            Business name
            <input value={user.name || ''} onChange={(e) => setUser({ ...user, name: e.target.value })} className="mt-2 w-full rounded bg-[#0b0b0b] px-3 py-2" />
          </label>
          <label className="block text-sm text-slate-300">
            Email
            <input value={user.email || ''} onChange={(e) => setUser({ ...user, email: e.target.value })} className="mt-2 w-full rounded bg-[#0b0b0b] px-3 py-2" />
          </label>

          <div className="flex items-center gap-3">
            <button onClick={save} className="rounded bg-yellow-500 px-4 py-2">Save profile</button>
            {status ? <div className="text-sm text-emerald-300">{status}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
