'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getUserInfo } from '@/lib/auth';
import { Modal } from '@/components/ui';

interface Step {
  approverName: string;
  approvalOrder: number;
  roleName: string;
  action: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
  comment: string | null;
  actedAt: string | null;
}

interface EditEntry {
  editId: number;
  editorName: string;
  beforeFields: Record<string, string>;
  afterFields: Record<string, string>;
  editedAt: string;
}

interface ApprovalHistory {
  requestId: number;
  status: 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELED';
  currentApprovalOrder: number;
  filledFields: Record<string, string>;
  steps: Step[];
  editHistory: EditEntry[];
  createdAt?: string;
}

const STATUS_CFG: Record<ApprovalHistory['status'], { label: string; bg: string; color: string }> = {
  IN_PROGRESS: { label: '진행중', bg: 'var(--amber-bg)', color: 'var(--amber)' },
  APPROVED:    { label: '승인',   bg: 'var(--green-bg)', color: 'var(--green)' },
  REJECTED:    { label: '반려',   bg: 'var(--red-bg)',   color: 'var(--red)' },
  CANCELED:    { label: '취소',   bg: 'var(--gray2)',    color: 'var(--gray5)' },
};

const ACTION_CFG: Record<Step['action'], { label: string; color: string; bg: string }> = {
  PENDING:  { label: '대기',   color: 'var(--gray4)',  bg: 'var(--gray2)' },
  APPROVED: { label: '승인',   color: 'var(--green)',  bg: 'var(--green-bg)' },
  REJECTED: { label: '반려',   color: 'var(--red)',    bg: 'var(--red-bg)' },
  CANCELED: { label: '취소',   color: 'var(--gray5)',  bg: 'var(--gray2)' },
};

interface Props {
  requestId: number;
}

export default function ApprovalDetailScreen({ requestId }: Props) {
  const router = useRouter();
  const [data, setData] = useState<ApprovalHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 액션
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | 'edit' | 'resubmit' | null>(null);
  const [comment, setComment] = useState('');
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [requestId]);

  async function load() {
    setLoading(true); setError('');
    try {
      const res = await apiFetch(`/api/approvals/${requestId}/history`);
      if (res.ok) {
        const d: ApprovalHistory = await res.json();
        setData(d);
        setEditFields({ ...d.filledFields });
      } else setError('결재 정보를 불러오지 못했습니다.');
    } catch { setError('서버에 연결할 수 없습니다.'); }
    finally { setLoading(false); }
  }

  if (loading) return <div style={{ padding: 32, fontFamily: 'var(--font-ui)' }}>불러오는 중...</div>;
  if (error || !data) return <div style={{ padding: 32, fontFamily: 'var(--font-ui)', color: 'var(--red)' }}>{error}</div>;

  const me = getUserInfo();
  const myName = me?.name;
  const currentStep = data.steps.find(s => s.approvalOrder === data.currentApprovalOrder && s.action === 'PENDING');
  const isCurrentApprover = !!myName && currentStep?.approverName === myName && data.status === 'IN_PROGRESS';
  // 요청자 추정: 첫 번째 step보다 한 단계 낮은 사람 — 명세 상 명시되지 않아 휴리스틱
  // 더 정확한 식별을 위해서는 백엔드에 requesterUserId 추가 필요
  const canResubmit = data.status === 'REJECTED' || data.status === 'CANCELED';

  async function approve() {
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/approvals/${requestId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ comment }),
      });
      if (res.ok) { setActionModal(null); setComment(''); load(); }
      else { const b = await res.json().catch(() => null); alert(b?.error ?? '승인 실패'); }
    } catch { alert('서버 연결 실패'); }
    finally { setSubmitting(false); }
  }

  async function reject() {
    if (!comment.trim()) { alert('반려 사유를 입력해 주세요.'); return; }
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/approvals/${requestId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ comment }),
      });
      if (res.ok) { setActionModal(null); setComment(''); load(); }
      else { const b = await res.json().catch(() => null); alert(b?.error ?? '반려 실패'); }
    } catch { alert('서버 연결 실패'); }
    finally { setSubmitting(false); }
  }

  async function saveEdit() {
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/approvals/${requestId}/fields`, {
        method: 'PUT',
        body: JSON.stringify({ filledFields: editFields }),
      });
      if (res.ok) { setActionModal(null); load(); }
      else { const b = await res.json().catch(() => null); alert(b?.error ?? '수정 실패'); }
    } catch { alert('서버 연결 실패'); }
    finally { setSubmitting(false); }
  }

  async function resubmit() {
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/approvals/${requestId}/resubmit`, {
        method: 'POST',
        body: JSON.stringify({ filledFields: editFields }),
      });
      if (res.ok) {
        const newApproval = await res.json();
        setActionModal(null);
        if (newApproval?.requestId) router.push(`/approvals/${newApproval.requestId}`);
        else router.push('/approvals');
      }
      else { const b = await res.json().catch(() => null); alert(b?.error ?? '재결재 실패'); }
    } catch { alert('서버 연결 실패'); }
    finally { setSubmitting(false); }
  }

  const cfg = STATUS_CFG[data.status];
  const fl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: 'var(--gray5)', marginBottom: 5, display: 'block' };
  const fi: React.CSSProperties = {
    width: '100%', border: '1px solid var(--gray2)', borderRadius: 6,
    color: 'var(--navy)', fontSize: 13, fontFamily: 'inherit',
    padding: '8px 12px', background: '#fff', outline: 'none',
  };

  return (
    <div style={{ fontFamily: 'var(--font-ui)', padding: '28px 32px', color: 'var(--navy)' }}>
      <button
        onClick={() => router.push('/approvals')}
        style={{
          background: 'var(--gray2)', color: 'var(--gray5)',
          border: 'none', borderRadius: 6, padding: '5px 13px',
          fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          marginBottom: 16,
        }}
      >← 목록</button>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
      }}>
        <div style={{
          fontSize: 24, fontWeight: 800, color: 'var(--navy)',
        }}>결재 #{data.requestId}</div>
        <span style={{
          display: 'inline-flex', fontSize: 11, fontWeight: 700,
          padding: '4px 10px', borderRadius: 100,
          background: cfg.bg, color: cfg.color,
        }}>{cfg.label}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
        {/* 좌: 본문 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 필드 */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--gray2)', padding: '20px 22px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>결재 내용</div>
              {(data.status === 'IN_PROGRESS') && (
                <button
                  onClick={() => { setEditFields({ ...data.filledFields }); setActionModal('edit'); }}
                  style={{
                    background: 'var(--gray2)', color: 'var(--gray5)',
                    border: 'none', borderRadius: 6, padding: '4px 12px',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >필드 수정</button>
              )}
            </div>
            {Object.entries(data.filledFields).map(([k, v]) => (
              <div key={k} style={{
                display: 'flex', borderBottom: '1px solid var(--gray2)',
              }}>
                <div style={{
                  width: 120, padding: '10px 12px', fontSize: 11, fontWeight: 600,
                  background: 'var(--gray1)', color: 'var(--gray4)',
                  borderRight: '1px solid var(--gray2)',
                }}>{k}</div>
                <div style={{ flex: 1, padding: '10px 14px', fontSize: 13, color: 'var(--navy)' }}>{v || '—'}</div>
              </div>
            ))}
          </div>

          {/* 결재 단계 */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--gray2)', padding: '20px 22px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>결재 단계</div>
            {data.steps.map((s, i) => {
              const ac = ACTION_CFG[s.action];
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '12px 0',
                  borderBottom: i === data.steps.length - 1 ? 'none' : '1px solid var(--gray1)',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: ac.bg, color: ac.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                  }}>{s.action === 'APPROVED' ? '✓' : s.action === 'REJECTED' ? '✕' : s.approvalOrder}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{s.approverName}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
                        background: 'var(--blue-pale)', color: 'var(--blue)',
                      }}>{s.roleName}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100,
                        background: ac.bg, color: ac.color,
                      }}>{ac.label}</span>
                    </div>
                    {s.comment && (
                      <div style={{ fontSize: 12, color: 'var(--gray5)', lineHeight: 1.5, marginBottom: 3 }}>
                        {s.comment}
                      </div>
                    )}
                    {s.actedAt && (
                      <div style={{ fontSize: 10, color: 'var(--gray4)', fontFamily: 'var(--font-mono)' }}>
                        {s.actedAt.replace('T', ' ').slice(0, 16)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 수정 이력 */}
          {data.editHistory.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--gray2)', padding: '20px 22px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>수정 이력</div>
              {data.editHistory.map(e => (
                <div key={e.editId} style={{
                  padding: '10px 12px', background: 'var(--gray1)', borderRadius: 8, marginBottom: 8,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>{e.editorName}</span>
                    <span style={{ fontSize: 10, color: 'var(--gray4)', fontFamily: 'var(--font-mono)' }}>
                      {e.editedAt.replace('T', ' ').slice(0, 16)}
                    </span>
                  </div>
                  {Object.keys(e.afterFields).map(k => (
                    <div key={k} style={{ fontSize: 11, color: 'var(--gray5)', marginBottom: 2 }}>
                      <span style={{ color: 'var(--gray4)' }}>{k}: </span>
                      <span style={{ textDecoration: 'line-through', color: 'var(--red)' }}>{e.beforeFields[k] ?? '—'}</span>
                      <span style={{ margin: '0 6px' }}>→</span>
                      <span style={{ color: 'var(--green)' }}>{e.afterFields[k]}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 우: 액션 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isCurrentApprover && (
            <>
              <button
                onClick={() => { setComment(''); setActionModal('approve'); }}
                style={{
                  width: '100%', background: 'var(--green)', color: '#fff',
                  border: 'none', borderRadius: 6, padding: '12px 20px',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >승인</button>
              <button
                onClick={() => { setComment(''); setActionModal('reject'); }}
                style={{
                  width: '100%', background: 'var(--red)', color: '#fff',
                  border: 'none', borderRadius: 6, padding: '12px 20px',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >반려</button>
            </>
          )}

          {canResubmit && (
            <button
              onClick={() => { setEditFields({ ...data.filledFields }); setActionModal('resubmit'); }}
              style={{
                width: '100%', background: 'var(--navy)', color: '#fff',
                border: 'none', borderRadius: 6, padding: '12px 20px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >재결재 요청</button>
          )}

          {!isCurrentApprover && !canResubmit && (
            <div style={{
              fontSize: 12, color: 'var(--gray5)', lineHeight: 1.6,
              padding: 14, background: '#fff', border: '1px solid var(--gray2)',
              borderRadius: 8,
            }}>
              {data.status === 'IN_PROGRESS'
                ? `${currentStep?.approverName ?? '결재자'}님의 ${currentStep?.roleName ?? ''} 결재 대기 중입니다.`
                : data.status === 'APPROVED'
                ? '최종 승인이 완료되었습니다.'
                : '취소된 결재입니다.'}
            </div>
          )}
        </div>
      </div>

      {/* 승인 모달 */}
      <Modal open={actionModal === 'approve'} onClose={() => setActionModal(null)}>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)', marginBottom: 4 }}>승인</div>
        <div style={{ fontSize: 12, color: 'var(--gray5)', marginBottom: 14 }}>코멘트를 남길 수 있습니다 (선택).</div>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="확인했습니다."
          style={{ ...fi, height: 80, resize: 'vertical', marginBottom: 12 }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => setActionModal(null)} style={{ background: 'var(--gray2)', color: 'var(--gray5)', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>취소</button>
          <button onClick={approve} disabled={submitting} style={{ background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1 }}>{submitting ? '처리 중...' : '승인'}</button>
        </div>
      </Modal>

      {/* 반려 모달 */}
      <Modal open={actionModal === 'reject'} onClose={() => setActionModal(null)}>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)', marginBottom: 4 }}>반려</div>
        <div style={{ fontSize: 12, color: 'var(--gray5)', marginBottom: 14 }}>반려 사유를 입력해 주세요.</div>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="영수증 금액이 일치하지 않습니다."
          style={{ ...fi, height: 80, resize: 'vertical', marginBottom: 12 }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => setActionModal(null)} style={{ background: 'var(--gray2)', color: 'var(--gray5)', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>취소</button>
          <button onClick={reject} disabled={submitting} style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1 }}>{submitting ? '처리 중...' : '반려'}</button>
        </div>
      </Modal>

      {/* 필드 수정 모달 */}
      <Modal open={actionModal === 'edit' || actionModal === 'resubmit'} onClose={() => setActionModal(null)} width={520}>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)', marginBottom: 4 }}>
          {actionModal === 'resubmit' ? '재결재 요청' : '필드 수정'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--gray5)', marginBottom: 14 }}>
          {actionModal === 'resubmit'
            ? '수정된 내용으로 새 결재가 시작됩니다.'
            : '결재 진행 중 필드를 수정할 수 있습니다. 수정 이력은 자동 저장됩니다.'}
        </div>
        <div style={{ maxHeight: 360, overflowY: 'auto', marginBottom: 14 }}>
          {Object.keys(editFields).map(k => (
            <div key={k} style={{ marginBottom: 10 }}>
              <label style={fl}>{k}</label>
              <input
                style={fi}
                value={editFields[k] ?? ''}
                onChange={e => setEditFields({ ...editFields, [k]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => setActionModal(null)} style={{ background: 'var(--gray2)', color: 'var(--gray5)', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>취소</button>
          <button
            onClick={actionModal === 'resubmit' ? resubmit : saveEdit}
            disabled={submitting}
            style={{ background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1 }}
          >{submitting ? '처리 중...' : actionModal === 'resubmit' ? '재결재 요청' : '저장'}</button>
        </div>
      </Modal>
    </div>
  );
}
