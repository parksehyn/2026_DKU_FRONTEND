'use client';

import React, { useState } from 'react';
import HeroBand from '@/components/HeroBand';
import { Btn, SectionHead } from '@/components/ui';
import { apiFetch } from '@/lib/api';

interface PDFScreenProps {
  onPrev?: () => void;
}

export default function PDFScreen({ onPrev }: PDFScreenProps) {
  const [downloading, setDownloading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const summaryRows = [
    { label: '결의서 번호', value: 'EXP-2025-0142' },
    { label: '신청자',      value: '김민준 (개발팀)' },
    { label: '제출일',      value: '2025-01-17' },
    { label: '합계 금액',   value: '655,000원', mono: true },
    { label: '준수율',      value: '60%', mono: true, warn: true },
  ];

  async function handleDownload() {
    const evidenceId = sessionStorage.getItem('evidenceId');
    const formId = sessionStorage.getItem('formId');
    const filledFieldsRaw = sessionStorage.getItem('filledFields');

    if (!evidenceId || !formId) {
      setError('증빙 정보가 없습니다. 처음부터 다시 진행해 주세요.');
      return;
    }

    setDownloading(true);
    setError('');
    try {
      const filledFields: Record<string, string> = filledFieldsRaw ? JSON.parse(filledFieldsRaw) : {};
      const userInputFieldsRaw = sessionStorage.getItem('userInputFields');
      const userInputFields: Record<string, string> = userInputFieldsRaw ? JSON.parse(userInputFieldsRaw) : {};
      const res = await apiFetch(`/api/evidence/${evidenceId}/complete`, {
        method: 'POST',
        body: JSON.stringify({
          forms: [{ formId: Number(formId), filledFields, userInputFields }],
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const contentType = res.headers.get('content-type') ?? '';
        const ext = contentType.includes('zip') ? '.zip' : '.docx';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `지출결의서${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? '파일 생성에 실패했습니다.');
      }
    } catch {
      setError('서버에 연결할 수 없습니다.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <HeroBand
        tag="STEP 5 · PDF 저장"
        title="결의서를 저장·제출하세요"
        desc="최종 검토 후 파일로 저장하거나 결재 라인에 제출합니다."
        compact
        actions={<>
          <Btn variant="outline" onClick={onPrev}>이전</Btn>
          <Btn variant="navy" onClick={() => setSubmitted(true)}>
            {submitted ? '✓ 제출 완료' : '결재 라인 제출'}
          </Btn>
        </>}
      />
      <div style={{ padding: '28px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left — PDF preview card */}
          <div>
            <SectionHead title="파일 다운로드" />
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E7EF', overflow: 'hidden' }}>
              <div style={{
                background: '#F4F6FA', height: 260,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                borderBottom: '1px solid #E2E7EF', gap: 12,
              }}>
                <div style={{
                  background: 'white', width: 140, borderRadius: 4,
                  border: '1px solid #E2E7EF', padding: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ textAlign: 'center', fontSize: 8, fontWeight: 700, color: '#1C2B4A', borderBottom: '1.5px solid #1C2B4A', paddingBottom: 6, marginBottom: 8 }}>
                    지출결의서
                  </div>
                  {[80, 60, 90, 70, 85, 75].map((w, i) => (
                    <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      <div style={{ height: 2, background: '#E2E7EF', borderRadius: 1, width: 30, flexShrink: 0 }} />
                      <div style={{ height: 2, background: '#B8C2D0', borderRadius: 1, width: `${w}%` }} />
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: '#8A96A8' }}>지출결의서.docx / .zip</div>
              </div>

              {error && (
                <div style={{
                  fontSize: 12, color: '#C8374A',
                  background: '#FDECEA', borderBottom: '1px solid #F5C6C6',
                  padding: '8px 16px',
                }}>{error}</div>
              )}

              <div style={{ padding: 16, display: 'flex', gap: 8 }}>
                <Btn variant="navy" full onClick={handleDownload}>
                  {downloading ? '생성 중...' : '파일 다운로드'}
                </Btn>
              </div>
            </div>
          </div>

          {/* Right — Summary */}
          <div>
            <SectionHead title="제출 요약" />
            <div style={{ background: 'white', border: '1px solid #E2E7EF', borderRadius: 12, padding: 20, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2B4A', marginBottom: 14 }}>문서 정보</div>
              {summaryRows.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: i < summaryRows.length - 1 ? '1px solid #F4F6FA' : 'none',
                }}>
                  <span style={{ fontSize: 12, color: '#8A96A8' }}>{r.label}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: r.warn ? '#C08020' : '#1C2B4A',
                    fontFamily: r.mono ? 'var(--font-mono)' : 'inherit',
                  }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: submitted ? '#E8F5EE' : '#FDF5E0',
              border: `1px solid ${submitted ? '#3A8A5C' : '#C08020'}`,
              borderRadius: 12, padding: 16,
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: submitted ? '#3A8A5C' : '#C08020',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 14, fontWeight: 700, flexShrink: 0,
                }}>{submitted ? '✓' : '!'}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: submitted ? '#3A8A5C' : '#C08020' }}>
                    {submitted ? '제출 완료' : '주의 사항 있음'}
                  </div>
                  <div style={{ fontSize: 11, color: '#5A6475', marginTop: 2 }}>
                    {submitted
                      ? '결재 라인에 성공적으로 제출되었습니다.'
                      : '규정 위반 항목이 포함된 상태로 제출됩니다.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
