'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authVerifyEmail } from '@/lib/authApi';

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    if (!token || !email) {
      setStatus('error');
      setMessage('The verification link is missing the required details.');
      return;
    }

    authVerifyEmail({ email, token })
      .then((data) => {
        setStatus('success');
        setMessage(data?.message || 'Your email has been verified successfully.');
      })
      .catch((error) => {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'We could not verify your email.');
      });
  }, [searchParams]);

  return (
    <section className="rounded-[24px] bg-[#0d0d0d] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
      <div className="space-y-4">
        <p className="text-sm uppercase text-yellow-400">Email verification</p>
        <h1 className="text-3xl font-bold text-white">{status === 'success' ? 'Email verified' : 'Confirming your email'}</h1>
        <p className="text-sm text-slate-400">{message}</p>
        <div className="flex gap-3">
          <Link href="/auth/login" className="rounded-[18px] bg-red-600 px-4 py-2 text-sm font-semibold text-white">Go to login</Link>
          <Link href="/" className="rounded-[18px] bg-[#121212] px-4 py-2 text-sm text-white">Back home</Link>
        </div>
      </div>
    </section>
  );
}
