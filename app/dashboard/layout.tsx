'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import GNB from '@/components/GNB';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.replace('/login');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', background: '#E8ECF2' }}>
      <GNB activeMenu="대시보드" />
      {children}
    </div>
  );
}
