'use client';

import { useRouter } from 'next/navigation';
import UploadScreen from '@/screens/UploadScreen';

export default function Page() {
  const router = useRouter();
  return <UploadScreen onNext={() => router.push('/regulation')} />;
}
