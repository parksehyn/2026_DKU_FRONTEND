'use client';

import { useRouter } from 'next/navigation';
import LandingScreen from '@/screens/LandingScreen';

export default function LandingPage() {
  const router = useRouter();
  return <LandingScreen onStart={() => router.push('/login')} />;
}
