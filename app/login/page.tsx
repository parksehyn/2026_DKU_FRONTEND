'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import LoginScreen from '@/screens/LoginScreen';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard');
  }, [router]);

  return <LoginScreen onLogin={() => router.push('/dashboard')} />;
}
