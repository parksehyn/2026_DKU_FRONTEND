'use client';

import { usePathname } from 'next/navigation';
import GNB from './GNB';
import StepNav from './StepNav';

const STEP_MAP: Record<string, number> = {
  '/receipt':    1,
  '/doc-review': 4,
  '/compliance': 4,
  '/pdf':        5,
};

const MENU_MAP: Record<string, string> = {
  '/dashboard':  '대시보드',
  '/receipt':    '지출결의',
  '/doc-review': '지출결의',
  '/compliance': '지출결의',
  '/pdf':        '지출결의',
  '/regulation': '규정 관리',
  '/forms':      '보고서',
};

export default function AppNav() {
  const pathname = usePathname();
  const currentStep = STEP_MAP[pathname];
  const activeMenu = MENU_MAP[pathname] ?? '대시보드';

  return (
    <>
      <GNB activeMenu={activeMenu} />
      {currentStep !== undefined && <StepNav currentStep={currentStep} />}
    </>
  );
}
