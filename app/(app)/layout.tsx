'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getGroupId } from '@/lib/group';
import AppNav from '@/components/AppNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    if (getGroupId() === null) router.replace('/group-select');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', background: '#E8ECF2' }}>
      <AppNav />
      {children}
    </div>
  );
}
