'use client';

import React, { useState, useEffect } from 'react';
import HeroBand from '@/components/HeroBand';
import { Btn, Badge } from '@/components/ui';

interface DocReviewScreenProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export default function DocReviewScreen({ onNext, onPrev }: DocReviewScreenProps) {
  const [filledFields, setFilledFields] = useState<Record<string, string>>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [userInputFields, setUserInputFields] = useState<Record<string, string>>({});
  const [formName, setFormName] = useState('지출결의서');

  useEffect(() => {
    const filled = sessionStorage.getItem('filledFields');
    const missing = sessionStorage.getItem('missingFields');
    const name = sessionStorage.getItem('formName');
    if (filled) setFilledFields(JSON.parse(filled));
    if (missing) setMissingFields(JSON.parse(missing));
    if (name) setFormName(name);
  }, []);

  function handleUserInput(field: string, value: string) {
    const updated = { ...userInputFields, [field]: value };
    setUserInputFields(updated);
    sessionStorage.setItem('userInputFields', JSON.stringify(updated));
  }

  const hasData = Object.keys(filledFields).length > 0 || missingFields.length > 0;

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <HeroBand
        tag="STEP 4 · 문서 확인"
        title="초안 문서를 확인하세요"
        desc="AI가 자동 입력한 내용을 확인하고 누락 항목을 직접 입력하세요."
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
          }}>{formName}</div>

          {!hasData && (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 13, color: '#8A96A8' }}>
              증빙 업로드 후 자동 입력된 내용이 표시됩니다.
            </div>
          )}

          {/* 자동 입력된 필드 */}
          {Object.entries(filledFields).map(([key, value], i) => (
            <div key={key} style={{
              display: 'flex',
              borderBottom: '1px solid #E2E7EF',
            }}>
              <div style={{
                width: 120, padding: '10px 10px', fontSize: 11, fontWeight: 600,
                background: '#F4F6FA', color: '#8A96A8', flexShrink: 0,
                borderRight: '1px solid #E2E7EF',
              }}>{key}</div>
              <div style={{
                padding: '10px 12px', flex: 1, fontSize: 12, color: '#1C2B4A',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {value}
                <Badge variant="ok">자동</Badge>
              </div>
            </div>
          ))}

          {/* 누락 필드 — 직접 입력 */}
          {missingFields.map((field) => (
            <div key={field} style={{
              display: 'flex',
              borderBottom: '1px solid #E2E7EF',
              background: '#FFFBF0',
            }}>
              <div style={{
                width: 120, padding: '10px 10px', fontSize: 11, fontWeight: 600,
                background: '#FDF5E0', color: '#C08020', flexShrink: 0,
                borderRight: '1px solid #F0E0B0',
              }}>{field}</div>
              <div style={{ padding: '6px 10px', flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  value={userInputFields[field] ?? ''}
                  onChange={e => handleUserInput(field, e.target.value)}
                  placeholder="직접 입력"
                  style={{
                    flex: 1, border: '1px solid #E2E7EF', borderRadius: 4,
                    padding: '5px 8px', fontSize: 12, fontFamily: 'var(--font-ui)',
                    color: '#1C2B4A', outline: 'none', height: 30,
                  }}
                />
                <Badge variant="warn">누락</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
