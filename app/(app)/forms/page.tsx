'use client';

import React, { useState, useRef, useEffect } from 'react';
import HeroBand from '@/components/HeroBand';
import { Badge, SectionHead } from '@/components/ui';
import { apiFetch } from '@/lib/api';
import { getGroupId } from '@/lib/group';

interface FormItem {
  formId: number;
  formName: string;
  paymentType: string;
  fields: string[];
  createdAt: string;
}

export default function FormsPage() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formName, setFormName] = useState('');
  const [paymentType, setPaymentType] = useState('BOTH');
  const [forms, setForms] = useState<FormItem[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadForms(); }, []);

  async function loadForms() {
    try {
      const groupId = getGroupId();
      const res = await apiFetch(`/api/forms${groupId ? `?groupId=${groupId}` : ''}`);
      if (res.ok) setForms(await res.json());
    } catch { /* 목록 로드 실패 시 빈 상태 유지 */ }
  }

  async function uploadFile(file: File) {
    if (!formName.trim()) { setError('양식지 이름을 입력하세요.'); return; }
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('formName', formName.trim());
      fd.append('paymentType', paymentType);
      const groupId = getGroupId();
      if (groupId) fd.append('groupId', String(groupId));

      const res = await apiFetch('/api/forms/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data: FormItem = await res.json();
        setForms(prev => [data, ...prev]);
        setFormName('');
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? '업로드에 실패했습니다.');
      }
    } catch {
      setError('서버에 연결할 수 없습니다.');
    } finally {
      setUploading(false);
    }
  }

  async function deleteForm(formId: number) {
    try {
      const res = await apiFetch(`/api/forms/${formId}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) setForms(prev => prev.filter(f => f.formId !== formId));
    } catch { /* 삭제 실패 시 무시 */ }
  }

  const PAYMENT_LABEL: Record<string, string> = { CARD: '법인카드', CASH: '현금', BOTH: '공통' };

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <HeroBand
        tag="보고서"
        title="양식지를 업로드하세요"
        desc="지출결의서 양식 파일을 업로드하면 AI가 분석하여 자동 입력에 활용합니다."
      />
      <div style={{ padding: '28px 40px' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = '';
          }}
        />

        {/* 양식지 이름 + 결제 유형 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <input
            value={formName}
            onChange={e => setFormName(e.target.value)}
            placeholder="양식지 이름 (필수)"
            style={{
              flex: 1, border: '1px solid #E2E7EF', borderRadius: 6,
              padding: '8px 12px', fontSize: 13, fontFamily: 'var(--font-ui)',
              color: '#1C2B4A', outline: 'none', height: 38,
            }}
          />
          <select
            value={paymentType}
            onChange={e => setPaymentType(e.target.value)}
            style={{
              border: '1px solid #E2E7EF', borderRadius: 6,
              padding: '8px 12px', fontSize: 13, fontFamily: 'var(--font-ui)',
              color: '#1C2B4A', outline: 'none', height: 38,
              background: 'white', cursor: 'pointer',
            }}
          >
            <option value="BOTH">공통</option>
            <option value="CARD">법인카드</option>
            <option value="CASH">현금</option>
          </select>
        </div>

        {/* 업로드 존 */}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file && !uploading) uploadFile(file);
          }}
          style={{
            border: `1.5px dashed ${dragging ? '#1C2B4A' : '#B8C2D0'}`,
            borderRadius: 12, padding: '36px 24px',
            textAlign: 'center',
            background: dragging ? '#EAF0F8' : '#F4F6FA',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            marginBottom: 16,
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
            {uploading ? 'AI 분석 중...' : dragging ? '파일을 놓아주세요' : 'DOCX 파일을 드래그하거나 클릭하세요'}
          </div>
          <div style={{ fontSize: 11, color: '#8A96A8' }}>DOCX 지원 · 최대 50MB</div>
        </div>

        {error && (
          <div style={{
            fontSize: 12, color: '#C8374A',
            background: '#FDECEA', border: '1px solid #F5C6C6',
            borderRadius: 6, padding: '8px 12px', marginBottom: 16,
          }}>{error}</div>
        )}

        {/* 업로드된 양식지 목록 */}
        {forms.length > 0 && (
          <div>
            <SectionHead title="업로드된 양식지" />
            {forms.map(f => (
              <div key={f.formId} style={{
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
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1C2B4A' }}>{f.formName}</div>
                  <div style={{ fontSize: 11, color: '#8A96A8', marginTop: 2 }}>
                    {f.fields.join(', ')} · {f.createdAt.slice(0, 10)}
                  </div>
                </div>
                <Badge variant="info">{PAYMENT_LABEL[f.paymentType] ?? f.paymentType}</Badge>
                <Badge variant="ok">분석 완료</Badge>
                <span
                  style={{ fontSize: 18, color: '#B8C2D0', cursor: 'pointer', lineHeight: 1 }}
                  onClick={() => deleteForm(f.formId)}
                >×</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
