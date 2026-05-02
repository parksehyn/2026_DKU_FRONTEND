'use client';

import { useRouter } from 'next/navigation';
import RegulationScreen from '@/screens/RegulationScreen';

export default function Page() {
  const router = useRouter();
  return (
    <RegulationScreen
      onNext={() => router.push('/receipt')}
      onPrev={() => router.push('/upload')}
    />
  );
}
