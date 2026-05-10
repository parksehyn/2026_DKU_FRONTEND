'use client';

import { use } from 'react';
import ApprovalDetailScreen from '@/screens/ApprovalDetailScreen';

interface Props {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: Props) {
  const { id } = use(params);
  return <ApprovalDetailScreen requestId={Number(id)} />;
}
