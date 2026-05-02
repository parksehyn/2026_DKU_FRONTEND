'use client';

import React, { Fragment } from 'react';

export const STEPS = [
  '규정 업로드', '규정 추출', '증빙 업로드',
  '양식 추천', '자동 입력', '문서 확인', 'PDF 저장',
];

interface StepNavProps {
  steps?: string[];
  currentStep?: number;
}

export default function StepNav({ steps = STEPS, currentStep = 1 }: StepNavProps) {
  return (
    <div style={{
      height: 44, background: '#FFFFFF',
      borderBottom: '1px solid #E2E7EF',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 6,
      padding: '0 40px', overflowX: 'auto',
    }}>
      {steps.map((s, i) => {
        const n = i + 1;
        const isDone = n < currentStep;
        const isActive = n === currentStep;
        return (
          <Fragment key={s}>
            {i > 0 && <span style={{ color: '#B8C2D0', fontSize: 10 }}>›</span>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: isDone ? '#4A6FA5' : isActive ? '#1C2B4A' : '#E2E7EF',
                color: isDone || isActive ? 'white' : '#8A96A8',
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDone ? '✓' : n}
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                color: isDone ? '#4A6FA5' : isActive ? '#1C2B4A' : '#B8C2D0',
                whiteSpace: 'nowrap',
              }}>{s}</span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
