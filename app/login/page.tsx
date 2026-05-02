'use client';

import { useRouter } from 'next/navigation';
import LoginScreen from '@/screens/LoginScreen';

export default function Page() {
  const router = useRouter();
  return <LoginScreen onLogin={() => router.push('/dashboard')} />;
}
