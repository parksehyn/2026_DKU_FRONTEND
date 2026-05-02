'use client';

import React from 'react';
import HeroBand from '@/components/HeroBand';
import { Btn, SectionHead, CheckItem, ProgBar } from '@/components/ui';

interface CheckData {
  title: string;
  desc: string;
  status: 'ok' | 'warn' | 'err';
}

const checks: CheckData[] = [
  { title: '교통비 규정 통과', desc: 'KTX 교통비 120,000원 — 출장 교통비 한도(200,000원) 이내', status: 'ok' },
  { title: '식비 한도 주의',   desc: '식비 85,000원 — 1인 1일 기준(30,000원) 대비 초과 가능성', status: 'warn' },
  { title: '숙박비 규정 위반', desc: '숙박비 450,000원 — 규정 한도(300,000원)를 150,000원 초과', status: 'err' },
  { title: '증빙 첨부 확인',   desc: '영수증 1건 첨부 완료', status: 'ok' },
  { title: '법인카드 사용',    desc: '50,000원 이상 지출에 법인카드 미사용 항목이 없습니다', status: 'ok' },
];

interface ComplianceScreenProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export default function ComplianceScreen({ onNext, onPrev }: ComplianceScreenProps) {
  const passCount = checks.filter(c => c.status === 'ok').length;
  const total = checks.length;
  const rate = Math.round((passCount / total) * 100);
  const rateColor = rate >= 80 ? '#3A8A5C' : rate >= 60 ? '#C08020' : '#C8374A';

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <HeroBand
        tag="STEP 5 · 규정 검사"
        title="규정 준수 검사 결과"
        desc="지출 항목별 규정 준수 여부를 확인하세요."
        compact
        actions={<>
          <Btn variant="outline" onClick={onPrev}>이전</Btn>
          <Btn variant="navy" onClick={onNext}>수정 입력 →</Btn>
        </>}
      />
      <div style={{ padding: '28px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left — check items */}
          <div>
            <SectionHead title="항목별 검사 결과" />
            {checks.map((c, i) => <CheckItem key={i} {...c} />)}
          </div>

          {/* Right — summary */}
          <div>
            <SectionHead title="준수율 요약" />
            <div style={{
              background: 'white', border: '1px solid #E2E7EF',
              borderRadius: 12, padding: 24, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#E2E7EF" strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke={rateColor} strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 32 * rate / 100} ${2 * Math.PI * 32 * (1 - rate / 100)}`}
                    strokeDashoffset={2 * Math.PI * 32 * 0.25}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: rateColor, fontFamily: 'var(--font-mono)' }}>{rate}%</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2B4A', marginBottom: 6 }}>규정 준수율</div>
                <div style={{ fontSize: 11, color: '#5A6475', lineHeight: 1.6 }}>
                  전체 {total}개 항목 중<br />
                  <span style={{ color: '#3A8A5C', fontWeight: 700 }}>{passCount}개 통과</span> ·{' '}
                  <span style={{ color: '#C8374A', fontWeight: 700 }}>{total - passCount}개 주의/위반</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid #E2E7EF', borderRadius: 12, padding: 20 }}>
              {[
                { label: '통과', value: passCount, color: '#3A8A5C', variant: 'pass' as const },
                { label: '주의', value: checks.filter(c => c.status === 'warn').length, color: '#C08020', variant: 'warn' as const },
                { label: '위반', value: checks.filter(c => c.status === 'err').length, color: '#C8374A', variant: 'error' as const },
              ].map(b => (
                <div key={b.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#5A6475' }}>{b.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: b.color, fontFamily: 'var(--font-mono)' }}>
                      {b.value}/{total}
                    </span>
                  </div>
                  <ProgBar value={(b.value / total) * 100} variant={b.variant} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
