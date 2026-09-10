"use client";
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { publicApi } from '@/lib/publicApi';

export default function BuyerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    publicApi<{ user: { role?: string } }>('/auth/session')
      .then(() => setChecked(true))
      .catch(() => {
      const next = encodeURIComponent(path || '/buyer');
      router.replace(`/auth/login?next=${next}`);
      });
  }, [path, router]);

  if (!checked) return null;
  return <>{children}</>;
}
