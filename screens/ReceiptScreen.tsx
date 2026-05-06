'use client';

import React, { useState, useRef } from 'react';
import HeroBand from '@/components/HeroBand';
import { Btn, Badge } from '@/components/ui';
import { apiFetch } from '@/lib/api';
import { getGroupId } from '@/lib/group';

interface AvailableForm {
  formId: number;
  formName: string;
  description: string;
  paymentType: string;
  fields: string[];
}

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
  const [filledFields, setFilledFields] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<ReceiptFields>({
    merchant: '', date: '', category: '', amount: '', note: '',
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [filling, setFilling] = useState(false);
  const [filled, setFilled] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function extractAmount(ff: Record<string, string>): string {
    for (const [key, value] of Object.entries(ff)) {
      if (/금액|합계|총액|결제금|공급가/.test(key)) return value.replace(/[^\d,]/g, '');
    }
    return '';
  }

  const tag = step === 5 ? 'STEP 3 · 증빙 업로드' : step === 6 ? 'STEP 4 · 양식 추천' : 'STEP 5 · 자동 입력';
  const title = step === 5 ? '증빙자료를 업로드하세요' : step === 6 ? '양식을 선택하세요' : '자동 입력 내용을 확인하세요';
  const desc = step === 5 ? '영수증을 업로드하면 OCR로 자동 인식합니다.' : step === 6 ? 'AI가 가장 적합한 양식을 추천합니다.' : 'AI가 입력한 내용을 확인하고 수정하세요.';

  async function fillForms(evidenceId: number, formIds: number[]) {
    setFilling(true);
    try {
      const res = await apiFetch(`/api/evidence/${evidenceId}/fill`, {
        method: 'POST',
        body: JSON.stringify({ formIds }),
      });
      if (res.ok) {
        const data: { evidenceId: number; results: { formId: number; formName: string; filledFields: Record<string, string>; missingFields: string[] }[] } = await res.json();
        const firstResult = data.results[0];
        if (firstResult) {
          sessionStorage.setItem('filledFields', JSON.stringify(firstResult.filledFields));
          sessionStorage.setItem('formId', String(firstResult.formId));
          sessionStorage.setItem('formName', firstResult.formName);
          sessionStorage.setItem('missingFields', JSON.stringify(firstResult.missingFields));
          setFilledFields(firstResult.filledFields);
          setFields(prev => ({ ...prev, amount: extractAmount(firstResult.filledFields), note: prev.note }));
        }
        setFilled(true);
      } else {
        setFilled(true); // 분석 결과만이라도 표시
      }
    } catch {
      setFilled(true);
    } finally {
      setFilling(false);
    }
  }

  async function handleFileSelect(file: File) {
    setError('');
    setAnalyzing(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('file', file);
      const groupId = getGroupId();
      if (groupId) formData.append('groupId', String(groupId));

      const res = await apiFetch('/api/evidence/analyze', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data: { evidenceId: number; paymentType: string; extractedText: string; availableForms: AvailableForm[] } = await res.json();
        sessionStorage.setItem('evidenceId', String(data.evidenceId));
        sessionStorage.setItem('availableForms', JSON.stringify(data.availableForms));

        if (data.availableForms.length > 0) {
          await fillForms(data.evidenceId, data.availableForms.map(f => f.formId));
        }
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? 'OCR 분석에 실패했습니다.');
        setPreviewUrl(null);
      }
    } catch {
      setError('서버에 연결할 수 없습니다.');
      setPreviewUrl(null);
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          e.target.value = '';
        }}
      />
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
          <div
            onClick={() => !analyzing && !filling && fileInputRef.current?.click()}
            style={{
              background: '#DDE3EC', height: 180,
              position: 'relative', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              cursor: (analyzing || filling) ? 'default' : 'pointer',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: filled ? '#3A8A5C' : (analyzing || filling) ? '#4A6FA5' : '#8A96A8',
              color: 'white',
              fontSize: 9, fontWeight: 700, padding: '3px 8px',
              borderRadius: 4, fontFamily: 'var(--font-mono)',
              transition: 'background 0.15s',
              zIndex: 1,
            }}>
              {filled ? '자동 입력 완료' : filling ? '입력 중...' : analyzing ? '분석 중...' : '파일 선택'}
            </div>

            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="업로드된 영수증"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: (analyzing || filling) ? 0.5 : 1 }}
              />
            ) : (
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
            )}

            <div style={{
              position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(28,43,74,0.65)', color: 'white',
              fontSize: 9, fontWeight: 600, padding: '3px 10px',
              borderRadius: 100, whiteSpace: 'nowrap',
            }}>
              {analyzing ? 'OCR 분석 중...' : filling ? '필드 채우는 중...' : filled ? '이미지를 탭하여 변경' : '탭하여 파일 선택'}
            </div>
          </div>

          {error && (
            <div style={{
              fontSize: 12, color: '#C8374A',
              background: '#FDECEA', borderBottom: '1px solid #F5C6C6',
              padding: '8px 16px',
            }}>{error}</div>
          )}

          {/* Fields */}
          <div style={{ padding: '0 16px' }}>
            {Object.keys(filledFields).length === 0 && !filled ? (
              <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 12, color: '#B8C2D0' }}>
                파일을 업로드하면 자동으로 입력됩니다
              </div>
            ) : Object.keys(filledFields).length === 0 && filled ? (
              <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 12, color: '#B8C2D0' }}>
                추출된 항목이 없습니다
              </div>
            ) : (
              Object.entries(filledFields).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: '1px solid #F4F6FA',
                }}>
                  <span style={{ fontSize: 12, color: '#8A96A8', fontWeight: 500 }}>{key}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1C2B4A' }}>{value}</span>
                    <Badge variant="navy">자동</Badge>
                  </div>
                </div>
              ))
            )}
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
                {fields.amount || '—'}
              </span>
              {fields.amount && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>VAT 포함</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
