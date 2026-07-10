'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authResetPassword } from '@/lib/authApi';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token') ?? '';
  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authResetPassword({ token, password });
      setSuccess('Password reset successfully. Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[24px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase text-slate-400">Reset access</p>
          <h1 className="text-3xl font-bold text-white">Enter your recovery token</h1>
          <p className="max-w-2xl text-sm text-slate-400">Paste the reset token from the recovery step and choose a new password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-slate-300">
            Reset Token
            <input
              type="text"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
              placeholder="Paste your reset token"
              className="mt-2 w-full rounded-[16px] border border-[#272727] bg-[#101010] px-4 py-3 text-white outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="block text-sm text-slate-300">
            New Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Enter a new password"
              className="mt-2 w-full rounded-[16px] border border-[#272727] bg-[#101010] px-4 py-3 text-white outline-none transition focus:border-slate-400"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <Link href="/auth/login" className="text-red-400 hover:text-red-300">Back to login</Link>
            <Link href="/auth/forgot-password" className="text-yellow-400 hover:text-yellow-300">Resend token</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-[18px] bg-red-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>

        {error ? <div className="rounded-[18px] border border-red-500 bg-[#330000] px-4 py-3 text-sm text-red-300">{error}</div> : null}
        {success ? <div className="rounded-[18px] border border-emerald-500 bg-[#052c0d] px-4 py-3 text-sm text-emerald-300">{success}</div> : null}
      </div>
    </section>
  );
}
