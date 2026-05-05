'use client';

import { useRouter } from 'next/navigation';
import ReceiptScreen from '@/screens/ReceiptScreen';

export default function Page() {
  const router = useRouter();
  return (
    <ReceiptScreen
      onNext={() => router.push('/doc-review')}
      step={5}
    />
  );
}
