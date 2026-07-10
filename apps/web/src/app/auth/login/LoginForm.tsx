'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authLogin } from '@/lib/authApi';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await authLogin({ email, password });
      // store user and tokens locally for client auth guard
      try {
        if (data?.user) localStorage.setItem('user', JSON.stringify(data.user));
        if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      } catch (e) {
        // ignore storage errors
      }

      setSuccess('Logged in successfully. Redirecting...');
      const next = searchParams.get('next') || '/';
      setTimeout(() => router.push(next), 400);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[24px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase text-red-400">Return to your account</p>
          <h1 className="text-3xl font-bold text-white">Sign in to Lumana AutoPlanet</h1>
          <p className="max-w-2xl text-sm text-slate-400">Use your buyer, seller, admin, driver or inspector account credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-slate-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-[16px] border border-[#272727] bg-[#101010] px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Enter your password"
              className="mt-2 w-full rounded-[16px] border border-[#272727] bg-[#101010] px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <Link href="/auth/forgot-password" className="text-red-400 hover:text-red-300">Forgot password?</Link>
            <p>New here? <Link href="/auth/signup" className="text-yellow-400 hover:text-yellow-300">Create account</Link></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-[18px] bg-red-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {error ? <div className="rounded-[18px] border border-red-500 bg-[#330000] px-4 py-3 text-sm text-red-300">{error}</div> : null}
        {success ? <div className="rounded-[18px] border border-emerald-500 bg-[#052c0d] px-4 py-3 text-sm text-emerald-300">{success}</div> : null}
      </div>
    </section>
  );
}
