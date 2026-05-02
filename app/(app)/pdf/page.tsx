'use client';

import { useRouter } from 'next/navigation';
import PDFScreen from '@/screens/PDFScreen';

export default function Page() {
  const router = useRouter();
  return <PDFScreen onPrev={() => router.push('/compliance')} />;
}
