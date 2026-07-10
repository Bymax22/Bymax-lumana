import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="rounded-[24px] bg-[#0d0d0d] p-8">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
