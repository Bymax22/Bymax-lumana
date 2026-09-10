'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/publicApi';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    publicApi<{ user: { role?: string } }>('/auth/session')
      .then(({ user }) => {
        if (user.role !== 'ADMIN') {
          router.replace('/auth/login?next=/admin');
          return;
        }
        setChecked(true);
      })
      .catch(() => router.replace('/auth/login?next=/admin'));
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
}