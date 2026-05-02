'use client';

import React from 'react';
import HeroBand from '@/components/HeroBand';
import { Btn, Badge } from '@/components/ui';

interface DocRow {
  label: string;
  value: string;
  warn?: boolean;
  mono?: boolean;
  total?: boolean;
  badge?: string;
}

const rows: DocRow[] = [
  { label: '신청자',   value: '김민준 (개발팀)' },
  { label: '출장지',   value: '부산 본사' },
  { label: '출장기간', value: '2025-01-15 ~ 2025-01-17' },
  { label: '교통비',   value: '120,000원', mono: true },
  { label: '숙박비',   value: '450,000원', warn: true, mono: true, badge: '위반' },
  { label: '식비',     value: '85,000원', mono: true },
  { label: '합계',     value: '655,000원', total: true, mono: true },
];

interface DocReviewScreenProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export default function DocReviewScreen({ onNext, onPrev }: DocReviewScreenProps) {
  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <HeroBand
        tag="STEP 6 · 문서 확인"
        title="초안 문서를 확인하세요"
        desc="자동 완성된 지출결의서를 검토하세요."
        compact
        actions={<>
          <Btn variant="outline" onClick={onPrev}>이전</Btn>
          <Btn variant="navy" onClick={onNext}>규정 검사 →</Btn>
        </>}
      />
      <div style={{ padding: '28px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: 'white', border: '1px solid #E2E7EF',
          borderRadius: 8, padding: '24px 28px',
          width: '100%', maxWidth: 520,
        }}>
          <div style={{
            textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#1C2B4A',
            borderBottom: '2px solid #1C2B4A', paddingBottom: 12, marginBottom: 16,
          }}>출장비 지출결의서</div>

          {rows.map((r, i) => (
            <div key={i} style={{
              display: 'flex',
              borderBottom: i < rows.length - 1 ? '1px solid #E2E7EF' : 'none',
              background: r.total ? '#1C2B4A' : r.warn ? '#FDECEA' : 'transparent',
            }}>
              <div style={{
                width: 120, padding: '8px 10px', fontSize: 11, fontWeight: 600, flexShrink: 0,
                background: r.total ? 'transparent' : '#F4F6FA',
                color: r.total ? 'rgba(255,255,255,0.6)' : r.warn ? '#C8374A' : '#8A96A8',
                borderRight: `1px solid ${r.total ? 'rgba(255,255,255,0.15)' : r.warn ? 'rgba(200,55,74,0.2)' : '#E2E7EF'}`,
              }}>{r.label}</div>
              <div style={{
                padding: '8px 12px', flex: 1,
                color: r.total ? 'white' : r.warn ? '#C8374A' : '#1C2B4A',
                fontFamily: r.mono ? 'var(--font-mono)' : 'inherit',
                fontWeight: r.total ? 700 : 400,
                fontSize: r.total ? 15 : 12,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {r.value}
                {r.badge && <Badge variant="err">{r.badge}</Badge>}
              </div>
            </div>
          ))}

          <div style={{
            background: '#FDECEA', borderLeft: '3px solid #C8374A',
            padding: '8px 12px', borderRadius: '0 4px 4px 0', marginTop: 10,
            fontSize: 11, color: '#C8374A',
          }}>
            숙박비 규정 한도(300,000원)를 150,000원 초과합니다. 다음 단계에서 수정하세요.
          </div>
        </div>
      </div>
    </div>
  );
}
