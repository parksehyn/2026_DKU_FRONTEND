'use client';

import { useRouter } from 'next/navigation';
import DashboardScreen from '@/screens/DashboardScreen';

export default function DashboardPage() {
  const router = useRouter();
  return <DashboardScreen onNew={() => router.push('/receipt')} />;
}
