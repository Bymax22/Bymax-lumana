"use client";
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { publicApi } from '@/lib/publicApi';

export default function SellerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    publicApi<{ user: { role?: string; approvalStatus?: string } }>('/auth/session')
      .then(({ user }) => {
        if (user.role !== 'DEALER' || (user.approvalStatus && user.approvalStatus !== 'APPROVED')) {
          router.replace('/auth/login');
          return;
        }
        setChecked(true);
      })
      .catch(() => {
        const next = encodeURIComponent(path || '/seller');
        router.replace(`/auth/login?next=${next}`);
      });
  }, [path, router]);

  if (!checked) return null;
  return <>{children}</>;
}
