'use client';

import React, { useState } from 'react';
import HeroBand from '@/components/HeroBand';
import { Btn, Badge, SectionHead } from '@/components/ui';

interface UploadFile {
  name: string;
  size: string;
  status: string;
}

interface UploadScreenProps {
  onNext?: () => void;
}

export default function UploadScreen({ onNext }: UploadScreenProps) {
  const [files, setFiles] = useState<UploadFile[]>([
    { name: '2025_출장비_규정.pdf', size: '2.3 MB', status: 'ok' },
    { name: '법인카드_사용지침.docx', size: '1.1 MB', status: 'ok' },
  ]);
  const [dragging, setDragging] = useState(false);

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <HeroBand
        tag="STEP 1 · 규정 업로드"
        title="규정책을 업로드하세요"
        desc="지출 관련 내부 규정 문서를 업로드하면 AI가 핵심 규정을 자동으로 추출합니다."
        actions={<>
          <Btn variant="outline">건너뛰기</Btn>
          <Btn variant="navy" onClick={onNext}>다음 단계 →</Btn>
        </>}
      />
      <div style={{ padding: '28px 40px' }}>
        {/* Upload zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
          style={{
            border: `1.5px dashed ${dragging ? '#1C2B4A' : '#B8C2D0'}`,
            borderRadius: 12, padding: '40px 24px',
            textAlign: 'center',
            background: dragging ? '#EAF0F8' : '#F4F6FA',
            cursor: 'pointer', transition: 'all 0.15s',
            marginBottom: 24,
          }}
        >
          <div style={{
            width: 52, height: 52, background: 'white',
            borderRadius: 10, border: '1px solid #E2E7EF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={dragging ? '#1C2B4A' : '#8A96A8'} strokeWidth="1.5">
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" />
            </svg>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1C2B4A', marginBottom: 4 }}>
            {dragging ? '파일을 놓아주세요' : '파일을 드래그하거나 클릭하세요'}
          </div>
          <div style={{ fontSize: 11, color: '#8A96A8' }}>PDF, DOCX 지원 · 최대 10MB</div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div>
            <SectionHead title="업로드된 파일" />
            {files.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'white', border: '1px solid #E2E7EF',
                borderRadius: 8, padding: '12px 16px', marginBottom: 8,
              }}>
                <div style={{
                  width: 36, height: 36, background: '#EAF0F8',
                  borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1C2B4A' }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: '#8A96A8' }}>{f.size}</div>
                </div>
                <Badge variant="ok">업로드 완료</Badge>
                <span
                  style={{ fontSize: 18, color: '#B8C2D0', cursor: 'pointer', lineHeight: 1 }}
                  onClick={() => setFiles(files.filter((_, j) => j !== i))}
                >×</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
