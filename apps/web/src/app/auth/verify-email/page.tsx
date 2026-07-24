import { Suspense } from 'react';
import VerifyEmailContent from './VerifyEmailContent';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="rounded-[24px] bg-[#0d0d0d] p-8 text-sm text-slate-400">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
