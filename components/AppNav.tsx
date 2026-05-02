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

const MENU_MAP: Record<string, string> = {
  '/dashboard': '대시보드',
  '/upload':     '지출결의',
  '/regulation': '지출결의',
  '/receipt':    '지출결의',
  '/doc-review': '지출결의',
  '/compliance': '지출결의',
  '/pdf':        '지출결의',
};

export default function AppNav() {
  const pathname = usePathname();
  const currentStep = STEP_MAP[pathname] ?? 1;
  const activeMenu = MENU_MAP[pathname] ?? '지출결의';

  return (
    <>
      <GNB activeMenu={activeMenu} />
      <StepNav currentStep={currentStep} />
    </>
  );
}
