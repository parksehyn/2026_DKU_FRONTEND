'use client';

import { usePathname } from 'next/navigation';
import GNB from './GNB';
import StepNav from './StepNav';

const STEP_MAP: Record<string, number> = {
  '/upload':     1,
  '/regulation': 2,
  '/receipt':    3,
  '/doc-review': 6,
  '/compliance': 5,
  '/pdf':        7,
};

export default function AppNav() {
  const pathname = usePathname();
  const currentStep = STEP_MAP[pathname] ?? 1;

  return (
    <>
      <GNB activeMenu="지출결의" />
      <StepNav currentStep={currentStep} />
    </>
  );
}
