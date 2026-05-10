'use client';

import React, { useState, useRef, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { getGroupId } from '@/lib/group';

interface FormItem {
  formId: number;
  formName: string;
  paymentType: string;
  fields: string[];
  createdAt: string;
  fileName?: string;
  active?: boolean;
}

interface RecentReport {
  title: string;
  createdAt: string;
  meta: string;
}

const MOCK_REPORTS: RecentReport[] = [
  { title: '2024년 12월 지출결의 보고서', createdAt: '2024.12.10', meta: 'PDF · 27건' },
  { title: 'Q4 지출 분석 리포트',         createdAt: '2024.12.08', meta: 'XLSX' },
  { title: '11월 출장비 정산 내역',       createdAt: '2024.11.30', meta: 'PDF · 15건' },
];

const EXT_COLORS: Record<string, { bg: string; color: string }> = {
  PDF:  { bg: 'var(--red-bg)',     color: 'var(--red)'  },
  DOC:  { bg: '#E8F0FF',           color: '#2B5CC8'     },
  DOCX: { bg: '#E8F0FF',           color: '#2B5CC8'     },
  HWP:  { bg: 'var(--blue-pale)',  color: 'var(--blue)' },
  HWPX: { bg: 'var(--blue-pale)',  color: 'var(--blue)' },
};

function getExt(name: string) {
  const ext = name.split('.').pop()?.toUpperCase() ?? '';
  return ext.length <= 4 ? ext : '';
}

function formatDate(dateStr: string) {
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

export default function FormsPage() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadForms(); }, []);

  async function loadForms() {
    try {
      const groupId = getGroupId();
      const res = await apiFetch(`/api/forms${groupId ? `?groupId=${groupId}` : ''}`);
      if (res.ok) setForms(await res.json());
    } catch { /* 빈 상태 유지 */ }
  }

  async function uploadFile(file: File) {
    setUploading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('formName', file.name.replace(/\.[^.]+$/, ''));
      fd.append('paymentType', 'BOTH');
      const groupId = getGroupId();
      if (groupId) fd.append('groupId', String(groupId));
      const res = await apiFetch('/api/forms/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data: FormItem = await res.json();
        setForms(prev => [data, ...prev]);
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? '업로드에 실패했습니다.');
      }
    } catch { setError('서버에 연결할 수 없습니다.'); }
    finally { setUploading(false); }
  }

  return (
    <div style={{ fontFamily: 'var(--font-ui)', padding: 32, color: 'var(--navy)' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>양식지</div>
        <div style={{ fontSize: 13, color: 'var(--gray4)' }}>지출결의에 사용할 양식지를 업로드하고 관리합니다</div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.hwp,.hwpx"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
          e.target.value = '';
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* 좌: 업로드 + 등록 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 업로드 카드 */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--gray2)', padding: '20px 22px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>양식지 업로드</div>
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{
                border: '1.5px dashed var(--gray3)', borderRadius: 12,
                padding: '36px 20px', textAlign: 'center',
                background: 'var(--gray1)',
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'all .15s',
              }}
              onMouseEnter={e => {
                if (uploading) return;
                e.currentTarget.style.borderColor = 'var(--navy)';
                e.currentTarget.style.background = 'var(--blue-pale)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--gray3)';
                e.currentTarget.style.background = 'var(--gray1)';
              }}
            >
              <div style={{
                width: 48, height: 48, background: '#fff', borderRadius: 9,
                border: '1px solid var(--gray2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="3" width="14" height="18" rx="2" />
                  <path d="M9 7h6M9 11h6M9 15h4" />
                </svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>
                {uploading ? '업로드 중...' : '양식지 파일 업로드'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--gray4)', marginBottom: 14 }}>
                HWP, DOCX, PDF · 최대 20MB
              </div>
              <button
                onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                disabled={uploading}
                style={{
                  background: 'var(--navy)', color: '#fff', border: 'none',
                  borderRadius: 6, padding: '5px 13px', fontSize: 11, fontWeight: 600,
                  cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}
              >양식지 선택</button>
            </div>
            {error && (
              <div style={{
                marginTop: 12,
                fontSize: 12, color: 'var(--red)',
                background: 'var(--red-bg)', border: '1px solid #F5C6C6',
                borderRadius: 6, padding: '8px 12px',
              }}>{error}</div>
            )}
          </div>

          {/* 등록된 양식지 */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--gray2)', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>등록된 양식지</div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  background: 'var(--navy)', color: '#fff', border: 'none',
                  borderRadius: 6, padding: '5px 13px', fontSize: 11, fontWeight: 600,
                  cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}
              >+ 추가</button>
            </div>

            {forms.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--gray4)', padding: '16px 0', textAlign: 'center' }}>
                아직 등록된 양식지가 없습니다.
              </div>
            ) : (
              forms.map((f, i) => {
                const fileName = f.fileName ?? f.formName;
                const ext = getExt(fileName);
                const c = EXT_COLORS[ext] ?? { bg: 'var(--gray1)', color: 'var(--gray4)' };
                const active = f.active !== false;
                return (
                  <div key={f.formId}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 0',
                      borderBottom: i === forms.length - 1 ? 'none' : '1px solid var(--gray1)',
                      cursor: 'pointer', transition: 'background .12s',
                    }}
                  >
                    <div style={{
                      width: 30, height: 34, background: c.bg, borderRadius: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 700, color: c.color, flexShrink: 0,
                    }}>{ext || '파일'}</div>
                    <div style={{ flex: 1, marginLeft: 4, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 600, color: 'var(--navy)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{f.formName}</div>
                      <div style={{ fontSize: 10, color: 'var(--gray4)' }}>등록일 {formatDate(f.createdAt)}</div>
                    </div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                      background: active ? 'var(--green-bg)' : 'var(--gray2)',
                      color: active ? 'var(--green)' : 'var(--gray4)',
                    }}>{active ? '활성' : '비활성'}</span>
                    <button style={{
                      background: 'var(--gray2)', color: 'var(--gray5)',
                      border: 'none', borderRadius: 6,
                      padding: '5px 13px', fontSize: 11, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}>수정</button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 우: 최근 생성 보고서 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--gray2)', padding: '20px 22px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>최근 생성 보고서</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MOCK_REPORTS.map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: 12, background: 'var(--gray1)', borderRadius: 9,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: 'var(--navy)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{r.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray4)', marginTop: 2 }}>
                    생성일 {r.createdAt} · {r.meta}
                  </div>
                </div>
                <button style={{
                  background: 'var(--navy)', color: '#fff', border: 'none',
                  borderRadius: 6, padding: '5px 13px', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
                }}>다운로드</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
