import { Suspense } from 'react';
import { ResetPasswordForm } from './ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="rounded-[24px] bg-[#0d0d0d] p-8">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
