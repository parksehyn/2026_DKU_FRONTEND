'use client';

import React, { useState } from 'react';
import HeroBand from '@/components/HeroBand';
import { Btn, Badge } from '@/components/ui';

interface ReceiptFields {
  merchant: string;
  date: string;
  category: string;
  amount: string;
  note: string;
}

interface ReceiptScreenProps {
  onNext?: () => void;
  onPrev?: () => void;
  step?: number;
}

export default function ReceiptScreen({ onNext, onPrev, step = 5 }: ReceiptScreenProps) {
  const [fields, setFields] = useState<ReceiptFields>({
    merchant: '롯데시티호텔 부산',
    date: '2025-01-16',
    category: '숙박비',
    amount: '450,000',
    note: '',
  });

  const tag = step === 5 ? 'STEP 3 · 증빙 업로드' : step === 6 ? 'STEP 4 · 양식 추천' : 'STEP 5 · 자동 입력';
  const title = step === 5 ? '증빙자료를 업로드하세요' : step === 6 ? '양식을 선택하세요' : '자동 입력 내용을 확인하세요';
  const desc = step === 5 ? '영수증을 업로드하면 OCR로 자동 인식합니다.' : step === 6 ? 'AI가 가장 적합한 양식을 추천합니다.' : 'AI가 입력한 내용을 확인하고 수정하세요.';

  const fieldRows = [
    { label: '가맹점명',  key: 'merchant' as const, auto: true },
    { label: '거래일시',  key: 'date' as const,     auto: true },
    { label: '지출 항목', key: 'category' as const, auto: false },
    { label: '금액',      key: 'amount' as const,   auto: true, mono: true },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <HeroBand
        tag={tag}
        title={title}
        desc={desc}
        compact
        actions={<>
          <Btn variant="outline" onClick={onPrev}>이전</Btn>
          <Btn variant="navy" onClick={onNext}>다음 →</Btn>
        </>}
      />
      <div style={{ padding: '28px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: 'white', borderRadius: 16,
          border: '1px solid #E2E7EF', overflow: 'hidden',
        }}>
          {/* Image area */}
          <div style={{
            background: '#DDE3EC', height: 180,
            position: 'relative', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: '#1C2B4A', color: 'white',
              fontSize: 9, fontWeight: 700, padding: '3px 8px',
              borderRadius: 4, fontFamily: 'var(--font-mono)',
            }}>OCR 인식 완료</div>
            <div style={{
              background: 'white', width: 80, borderRadius: 3,
              border: '1px solid #E2E7EF', padding: 8,
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              {[90, 100, 70, 100, 80].map((w, i) => (
                <div key={i} style={{
                  height: i === 0 ? 3 : 2,
                  background: i === 4 ? '#1C2B4A' : i === 0 ? '#B8C2D0' : '#E2E7EF',
                  borderRadius: 2, width: `${w}%`,
                }} />
              ))}
            </div>
            <div style={{
              position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(28,43,74,0.65)', color: 'white',
              fontSize: 9, fontWeight: 600, padding: '3px 10px',
              borderRadius: 100, whiteSpace: 'nowrap',
            }}>이미지를 탭하여 변경</div>
          </div>

          {/* Fields */}
          <div style={{ padding: '0 16px' }}>
            {fieldRows.map(f => (
              <div key={f.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid #F4F6FA',
              }}>
                <span style={{ fontSize: 12, color: '#8A96A8', fontWeight: 500 }}>{f.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {f.auto ? (
                    <>
                      <span style={{
                        fontSize: 13, fontWeight: 600, color: '#1C2B4A',
                        fontFamily: f.mono ? 'var(--font-mono)' : 'inherit',
                      }}>{fields[f.key]}{f.mono ? '원' : ''}</span>
                      <Badge variant="navy">자동</Badge>
                    </>
                  ) : (
                    <>
                      <input
                        value={fields[f.key]}
                        onChange={e => setFields({ ...fields, [f.key]: e.target.value })}
                        style={{
                          width: 120, border: '1px solid #E2E7EF', borderRadius: 6,
                          color: '#1C2B4A', fontSize: 12,
                          fontFamily: 'var(--font-ui)',
                          padding: '5px 8px', height: 30,
                          background: 'white', outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: 11, color: '#4A6FA5', fontWeight: 600, cursor: 'pointer' }}>수정</span>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div style={{ padding: '10px 0', borderBottom: '1px solid #F4F6FA' }}>
              <div style={{ fontSize: 12, color: '#8A96A8', fontWeight: 500, marginBottom: 6 }}>비고</div>
              <input
                placeholder="추가 내용 입력"
                value={fields.note}
                onChange={e => setFields({ ...fields, note: e.target.value })}
                style={{
                  width: '100%', border: '1px solid #E2E7EF', borderRadius: 6,
                  color: '#1C2B4A', fontSize: 12, fontFamily: 'var(--font-ui)',
                  padding: '7px 10px', height: 34, background: 'white', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Total bar */}
          <div style={{
            background: '#1C2B4A', padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>합계 금액</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: 'white' }}>
                {fields.amount}원
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>VAT 포함</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
