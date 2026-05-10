'use client';

import React, { Fragment } from 'react';
import { useRouter } from 'next/navigation';

export const STEPS = [
  '증빙 업로드', '양식 추천', '초안 확인·수정', '규정 검토', '문서 저장',
];

interface StepNavProps {
  steps?: string[];
  currentStep?: number;
  /** 우측 "목록으로" 등 보조 액션 */
  rightAction?: React.ReactNode;
}

export default function StepNav({ steps = STEPS, currentStep = 1, rightAction }: StepNavProps) {
  const router = useRouter();

  const defaultAction = (
    <button
      onClick={() => router.push('/expense-board')}
      style={{
        background: 'var(--gray2)', color: 'var(--gray5)',
        border: 'none', borderRadius: 6,
        padding: '7px 14px', fontSize: 11, fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit',
      }}
    >← 목록으로</button>
  );

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '0 32px',
      background: '#fff',
      borderBottom: '1px solid var(--gray2)',
      height: 50,
      overflowX: 'auto',
    }}>
      {steps.map((s, i) => {
        const n = i + 1;
        const isDone = n < currentStep;
        const isActive = n === currentStep;
        return (
          <Fragment key={s}>
            {i > 0 && <span style={{ color: 'var(--gray3)', fontSize: 10, margin: '0 4px' }}>›</span>}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 11, fontWeight: 600,
              color: isDone ? 'var(--blue)' : isActive ? 'var(--navy)' : 'var(--gray3)',
              padding: '0 14px', height: 50,
              borderBottom: isActive ? '2.5px solid var(--navy)' : '2.5px solid transparent',
              flexShrink: 0,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: isDone ? 'var(--blue)' : isActive ? 'var(--navy)' : 'var(--gray2)',
                color: (isDone || isActive) ? '#fff' : 'var(--gray4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
              }}>
                {isDone ? '✓' : n}
              </div>
              {s}
            </div>
          </Fragment>
        );
      })}
      <div style={{ marginLeft: 'auto' }}>
        {rightAction ?? defaultAction}
      </div>
    </div>
  );
}
