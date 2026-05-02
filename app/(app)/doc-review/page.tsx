'use client';

import { useRouter } from 'next/navigation';
import DocReviewScreen from '@/screens/DocReviewScreen';

export default function Page() {
  const router = useRouter();
  return (
    <DocReviewScreen
      onNext={() => router.push('/compliance')}
      onPrev={() => router.push('/receipt')}
    />
  );
}
