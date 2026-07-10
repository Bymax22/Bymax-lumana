"use client";
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function SellerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (!raw) {
        const next = encodeURIComponent(path || '/seller');
        router.replace(`/auth/login?next=${next}`);
        return;
      }
      const user = JSON.parse(raw as string);
      if (!user || user.role !== 'DEALER') {
        router.replace('/auth/login');
        return;
      }
      setChecked(true);
    } catch (e) {
      router.replace('/auth/login');
    }
  }, [path, router]);

  if (!checked) return null;
  return <>{children}</>;
}
