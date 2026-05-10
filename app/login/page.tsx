'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import LoginScreen from '@/screens/LoginScreen';

export default function Page() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/group-select';

  useEffect(() => {
    if (isAuthenticated()) router.replace(next);
  }, [router, next]);

  return <LoginScreen onLogin={() => router.push(next)} />;
}
