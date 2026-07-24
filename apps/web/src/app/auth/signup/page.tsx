"use client";

import { useState } from 'react';
import Link from 'next/link';
import { authRegister } from '@/lib/authApi';

const roleOptions = [
  { value: 'CUSTOMER', label: 'Buyer / Customer' },
  { value: 'DEALER', label: 'Seller / Dealer' }
];

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await authRegister({ name, email, password, role });
      if (data?.requiresVerification) {
        setSuccess('Account created. Please check your email and verify your account before continuing.');
      } else {
        setSuccess('Account created successfully. You can sign in now.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed.';
      if (message.includes('timed out')) {
        setError('The signup service is taking longer than expected. Please try again in a moment. If the problem persists, check the API logs for the registration request.');
      } else {
        setError(message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[24px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase text-yellow-400">Create your profile</p>
          <h1 className="text-3xl font-bold text-white">Register for Lumana AutoPlanet</h1>
          <p className="max-w-2xl text-sm text-slate-400">Pick the role that matches your account and start using the marketplace in real time.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-slate-300">
            Full Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              className="mt-2 w-full rounded-[16px] border border-[#272727] bg-[#101010] px-4 py-3 text-white outline-none transition focus:border-yellow-500"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-[16px] border border-[#272727] bg-[#101010] px-4 py-3 text-white outline-none transition focus:border-yellow-500"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Create a password"
              className="mt-2 w-full rounded-[16px] border border-[#272727] bg-[#101010] px-4 py-3 text-white outline-none transition focus:border-yellow-500"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Account Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="mt-2 w-full rounded-[16px] border border-[#272727] bg-[#101010] px-4 py-3 text-white outline-none transition focus:border-yellow-500"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <p>Already have an account? <Link href="/auth/login" className="text-red-400 hover:text-red-300">Login</Link></p>
            <Link href="/auth/forgot-password" className="text-yellow-400 hover:text-yellow-300">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-[18px] bg-yellow-500 px-5 py-4 text-sm font-semibold text-[#0b0b0b] transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {error ? <div className="rounded-[18px] border border-red-500 bg-[#330000] px-4 py-3 text-sm text-red-300">{error}</div> : null}
        {success ? <div className="rounded-[18px] border border-emerald-500 bg-[#052c0d] px-4 py-3 text-sm text-emerald-300">{success}</div> : null}
      </div>
    </section>
  );
}
