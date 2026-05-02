'use client';

import { useRouter } from 'next/navigation';
import ComplianceScreen from '@/screens/ComplianceScreen';

export default function Page() {
  const router = useRouter();
  return (
    <ComplianceScreen
      onNext={() => router.push('/pdf')}
      onPrev={() => router.push('/doc-review')}
    />
  );
}
