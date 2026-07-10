"use client";
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function BuyerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!user) {
      const next = encodeURIComponent(path || '/buyer');
      router.replace(`/auth/login?next=${next}`);
    } else {
      setChecked(true);
    }
  }, [path, router]);

  if (!checked) return null;
  return <>{children}</>;
}
