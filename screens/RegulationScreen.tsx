'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { getGroupId } from '@/lib/group';

interface PolicyFile {
  policyId: number;
  policyName: string;
  createdAt: string;
  fileName?: string;
  fileSize?: number;
}

const EXT_COLORS: Record<string, { bg: string; color: string }> = {
  PDF:  { bg: 'var(--red-bg)',    color: 'var(--red)'  },
  DOC:  { bg: '#E8F0FF',          color: '#2B5CC8'     },
  DOCX: { bg: '#E8F0FF',          color: '#2B5CC8'     },
  HWP:  { bg: 'var(--blue-pale)', color: 'var(--blue)' },
  HWPX: { bg: 'var(--blue-pale)', color: 'var(--blue)' },
};

function getExt(name: string) {
  const ext = name.split('.').pop()?.toUpperCase() ?? '';
  return ext.length <= 4 ? ext : '';
}

function formatSize(bytes?: number) {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function formatDate(dateStr: string) {
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

export default function RegulationScreen() {
  const [policies, setPolicies] = useState<PolicyFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadPolicies(); }, []);

  async function loadPolicies() {
    try {
      const groupId = getGroupId();
      const res = await apiFetch(`/api/policies${groupId ? `?groupId=${groupId}` : ''}`);
      if (res.ok) setPolicies(await res.json());
    } catch { /* 빈 상태 유지 */ }
  }

  async function uploadFile(file: File) {
    setUploading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('policyName', file.name.replace(/\.[^.]+$/, ''));
      const groupId = getGroupId();
      if (groupId) fd.append('groupId', String(groupId));
      const res = await apiFetch('/api/policies/upload', { method: 'POST', body: fd });
      if (res.ok) await loadPolicies();
      else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? '업로드에 실패했습니다.');
      }
    } catch { setError('서버에 연결할 수 없습니다.'); }
    finally { setUploading(false); }
  }

  async function deletePolicy(policyId: number) {
    try {
      const res = await apiFetch(`/api/policies/${policyId}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        setPolicies(prev => prev.filter(p => p.policyId !== policyId));
      }
    } catch { /* 무시 */ }
  }

  return (
    <div style={{ fontFamily: 'var(--font-ui)', padding: 32, color: 'var(--navy)' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>규정관리</div>
        <div style={{ fontSize: 13, color: 'var(--gray4)' }}>
          회사 지출 규정 문서를 업로드하면 AI가 자동으로 규정을 분석합니다.
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
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

        {/* 업로드 카드 */}
        <div style={{
          background: '#fff', borderRadius: 12, border: '1px solid var(--gray2)',
          padding: '20px 22px', marginBottom: 16,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>규정책 업로드</div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
              background: 'var(--green-bg)', color: 'var(--green)',
            }}>AI 분석 완료</span>
          </div>

          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault(); setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file && !uploading) uploadFile(file);
            }}
            style={{
              border: `1.5px dashed ${dragging ? 'var(--navy)' : 'var(--gray3)'}`,
              borderRadius: 12, padding: '44px 24px',
              textAlign: 'center',
              background: dragging ? 'var(--blue-pale)' : 'var(--gray1)',
              cursor: uploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: 52, height: 52, background: '#fff', borderRadius: 10,
              border: '1px solid var(--gray2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V8M8 12l4-4 4 4" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="var(--gray3)" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>
              {uploading ? '업로드 중...' : dragging ? '파일을 놓아주세요' : '규정 문서를 드래그하거나 클릭하여 업로드'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray4)', marginBottom: 16 }}>
              PDF, Word(.docx), 한글(.hwp) · 최대 50MB
            </div>
            <button
              onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
              disabled={uploading}
              style={{
                background: 'var(--navy)', color: '#fff', border: 'none',
                borderRadius: 6, padding: '5px 13px', fontSize: 11, fontWeight: 600,
                fontFamily: 'inherit', cursor: uploading ? 'not-allowed' : 'pointer',
              }}
            >파일 선택</button>
          </div>
        </div>

        {error && (
          <div style={{
            fontSize: 12, color: 'var(--red)',
            background: 'var(--red-bg)', border: '1px solid #F5C6C6',
            borderRadius: 6, padding: '8px 12px', marginBottom: 16,
          }}>{error}</div>
        )}

        {/* 지원 파일 형식 */}
        <div style={{
          background: '#fff', borderRadius: 12, border: '1px solid var(--gray2)',
          padding: '20px 22px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>지원 파일 형식</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { ext: 'PDF', name: 'PDF 문서', desc: 'Adobe PDF 형식' },
              { ext: 'DOC', name: 'Word 문서', desc: 'docx, doc 형식' },
              { ext: 'HWP', name: '한글 문서', desc: 'hwp, hwpx 형식' },
            ].map(t => {
              const c = EXT_COLORS[t.ext] ?? { bg: 'var(--gray1)', color: 'var(--gray4)' };
              return (
                <div key={t.ext} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', background: 'var(--gray1)',
                  borderRadius: 8, flex: 1,
                }}>
                  <div style={{
                    width: 32, height: 36, background: c.bg, borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: c.color, flexShrink: 0,
                  }}>{t.ext}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)' }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--gray4)' }}>{t.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 업로드된 파일 목록 */}
        <div style={{
          background: '#fff', borderRadius: 12, border: '1px solid var(--gray2)',
          padding: '20px 22px',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>업로드된 파일</div>
          {policies.length === 0 ? (
            <div style={{
              fontSize: 12, color: 'var(--gray4)',
              padding: '16px 0', textAlign: 'center',
            }}>아직 업로드된 규정 문서가 없습니다.</div>
          ) : (
            policies.map(p => {
              const fileName = p.fileName ?? p.policyName;
              const ext = getExt(fileName);
              const c = EXT_COLORS[ext] ?? { bg: 'var(--gray1)', color: 'var(--gray4)' };
              return (
                <div key={p.policyId} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 12px', background: 'var(--gray1)',
                  borderRadius: 8, marginBottom: 8,
                }}>
                  <div style={{
                    width: 30, height: 34, background: c.bg, borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: c.color, flexShrink: 0,
                  }}>{ext || '파일'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: 'var(--navy)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{p.policyName}</div>
                    <div style={{ fontSize: 10, color: 'var(--gray4)' }}>
                      {[formatSize(p.fileSize), `${formatDate(p.createdAt)} 업로드`].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                      background: 'var(--green-bg)', color: 'var(--green)',
                    }}>분석 완료</span>
                    <button
                      onClick={() => deletePolicy(p.policyId)}
                      style={{
                        background: 'var(--gray2)', color: 'var(--gray5)',
                        border: 'none', borderRadius: 6,
                        padding: '5px 13px', fontSize: 11, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >삭제</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* AI 분석 결과 안내 */}
        {policies.length > 0 && (
          <div style={{
            marginTop: 16, padding: '16px 18px',
            background: 'var(--navy)', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>AI</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
                AI 분석 완료 · 규정 추출됨
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                출장비, 접대비, 증빙 요건, 결재 라인 등 핵심 규정이 추출되어 지출결의 검사에 활용됩니다.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
