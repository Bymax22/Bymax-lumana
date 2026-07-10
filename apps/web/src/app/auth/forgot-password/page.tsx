"use client";

import { useState } from 'react';
import Link from 'next/link';
import { authForgotPassword } from '@/lib/authApi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setResetToken('');
    setLoading(true);

    try {
      const result = await authForgotPassword({ email });
      setMessage(result.message || 'Password recovery email sent.');
      if (result.resetToken) {
        setResetToken(result.resetToken);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send password recovery.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[24px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase text-slate-400">Password help</p>
          <h1 className="text-3xl font-bold text-white">Forgot your password?</h1>
          <p className="max-w-2xl text-sm text-slate-400">Enter your account email and we will send a reset token to recover access.</p>
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
              className="mt-2 w-full rounded-[16px] border border-[#272727] bg-[#101010] px-4 py-3 text-white outline-none transition focus:border-slate-400"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-[18px] bg-[#121212] px-5 py-4 text-sm font-semibold text-slate-200 transition hover:bg-[#1c1c1c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending recovery...' : 'Send recovery token'}
          </button>
        </form>

        {message ? <div className="rounded-[18px] border border-emerald-500 bg-[#052c0d] px-4 py-3 text-sm text-emerald-300">{message}</div> : null}
        {resetToken ? (
          <div className="rounded-[18px] border border-yellow-500 bg-[#23210f] px-4 py-3 text-sm text-yellow-300">
            Copy your reset token and use it on the <Link href="/auth/reset-password" className="text-yellow-200 underline">reset password page</Link>.
            <div className="mt-2 break-all text-xs text-slate-200">{resetToken}</div>
          </div>
        ) : null}
        {error ? <div className="rounded-[18px] border border-red-500 bg-[#330000] px-4 py-3 text-sm text-red-300">{error}</div> : null}
      </div>
    </section>
  );
}
