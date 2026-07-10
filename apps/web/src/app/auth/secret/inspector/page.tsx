"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authRegister } from '@/lib/authApi';

export default function SecretInspectorSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authRegister({ name, email, password, role: 'INSPECTOR' });
      setMessage('Inspector account created. Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create inspector account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[24px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
      <h1 className="text-2xl font-bold text-white">Secure Inspector Signup</h1>
      <p className="text-sm text-slate-400">This page is intended for internal use only.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm text-slate-300">Full name
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-[12px] bg-[#101010] px-3 py-2" />
        </label>
        <label className="block text-sm text-slate-300">Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="mt-2 w-full rounded-[12px] bg-[#101010] px-3 py-2" />
        </label>
        <label className="block text-sm text-slate-300">Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="mt-2 w-full rounded-[12px] bg-[#101010] px-3 py-2" />
        </label>
        <button disabled={loading} className="rounded-[12px] bg-yellow-500 px-4 py-2 text-[#0b0b0b]">{loading ? 'Creating...' : 'Create Inspector'}</button>
        {message ? <div className="text-emerald-300">{message}</div> : null}
        {error ? <div className="text-red-300">{error}</div> : null}
      </form>
    </section>
  );
}
