'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { setGroupId } from '@/lib/group';

interface GroupMember {
  userId: number;
  name: string;
  email: string;
  roleName: string;
  approvalOrder: number;
}

interface Group {
  groupId: number;
  name: string;
  inviteCode: string;
  ownerName: string;
  members: GroupMember[];
}

type Mode = 'list' | 'create' | 'join';

export default function GroupSelectPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('list');

  // 그룹 생성 폼
  const [groupName, setGroupName] = useState('');
  const [roles, setRoles] = useState(['회장', '부회장', '총무']);
  const [newRole, setNewRole] = useState('');

  // 그룹 가입 폼
  const [inviteCode, setInviteCode] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    loadGroups();
  }, [router]);

  async function loadGroups() {
    try {
      const res = await apiFetch('/api/groups/my');
      if (res.ok) setGroups(await res.json());
    } catch { /* 빈 상태 유지 */ } finally {
      setLoading(false);
    }
  }

  function selectGroup(group: Group) {
    setGroupId(group.groupId);
    router.push('/dashboard');
  }

  async function handleCreate() {
    if (!groupName.trim()) { setError('그룹 이름을 입력하세요.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await apiFetch('/api/groups', {
        method: 'POST',
        body: JSON.stringify({ name: groupName.trim(), roles }),
      });
      if (res.ok) {
        const group: Group = await res.json();
        setGroupId(group.groupId);
        router.push('/dashboard');
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? '그룹 생성에 실패했습니다.');
      }
    } catch { setError('서버에 연결할 수 없습니다.'); }
    finally { setSubmitting(false); }
  }

  async function handleJoin() {
    if (!inviteCode.trim()) { setError('초대코드를 입력하세요.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await apiFetch(`/api/groups/join/${inviteCode.trim()}`, { method: 'POST' });
      if (res.ok) {
        const group: Group = await res.json();
        setGroupId(group.groupId);
        router.push('/dashboard');
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? '유효하지 않은 초대코드입니다.');
      }
    } catch { setError('서버에 연결할 수 없습니다.'); }
    finally { setSubmitting(false); }
  }

  function addRole() {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole('');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#E8ECF2',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'var(--font-ui)', padding: '40px 24px',
    }}>
      {/* 로고 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <div style={{
          width: 32, height: 32, background: '#1C2B4A', borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" />
            <circle cx="7" cy="7" r="1.5" fill="white" />
          </svg>
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#1C2B4A' }}>GAGYEOL</span>
      </div>

      <div style={{
        background: 'white', borderRadius: 16, border: '1px solid #E2E7EF',
        padding: '32px 36px', width: '100%', maxWidth: 480,
      }}>
        {mode === 'list' && (
          <>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1C2B4A', marginBottom: 4 }}>그룹 선택</div>
            <div style={{ fontSize: 13, color: '#8A96A8', marginBottom: 24 }}>작업할 그룹을 선택하거나 새로 만드세요.</div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 13, color: '#8A96A8' }}>불러오는 중...</div>
            ) : groups.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '24px 0',
                fontSize: 13, color: '#8A96A8', border: '1.5px dashed #E2E7EF',
                borderRadius: 10, marginBottom: 16,
              }}>
                소속된 그룹이 없습니다.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {groups.map(g => (
                  <button
                    key={g.groupId}
                    onClick={() => selectGroup(g)}
                    style={{
                      width: '100%', textAlign: 'left',
                      border: '1px solid #E2E7EF', borderRadius: 10,
                      padding: '14px 16px', background: 'white', cursor: 'pointer',
                      transition: 'border-color 0.15s, background 0.15s',
                      fontFamily: 'var(--font-ui)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#1C2B4A';
                      e.currentTarget.style.background = '#F4F6FA';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#E2E7EF';
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1C2B4A', marginBottom: 4 }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: '#8A96A8' }}>
                      대표: {g.ownerName} · 멤버 {g.members.length}명
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setMode('create'); setError(''); }}
                style={{
                  flex: 1, height: 40, border: '1px solid #1C2B4A', borderRadius: 8,
                  background: '#1C2B4A', color: 'white', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >+ 그룹 생성</button>
              <button
                onClick={() => { setMode('join'); setError(''); }}
                style={{
                  flex: 1, height: 40, border: '1px solid #E2E7EF', borderRadius: 8,
                  background: 'white', color: '#1C2B4A', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >초대코드로 가입</button>
            </div>
          </>
        )}

        {mode === 'create' && (
          <>
            <button onClick={() => { setMode('list'); setError(''); }} style={{ fontSize: 12, color: '#8A96A8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 16, fontFamily: 'var(--font-ui)' }}>← 뒤로</button>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1C2B4A', marginBottom: 20 }}>그룹 생성</div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#5A6475', marginBottom: 6 }}>그룹 이름</div>
              <input
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="예: 컴퓨터공학과 학생회"
                style={{
                  width: '100%', border: '1px solid #E2E7EF', borderRadius: 6,
                  padding: '9px 12px', fontSize: 13, fontFamily: 'var(--font-ui)',
                  color: '#1C2B4A', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#5A6475', marginBottom: 6 }}>결재 역할 (순서대로)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                {roles.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', background: '#F4F6FA',
                      border: '1px solid #E2E7EF', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#8A96A8', flexShrink: 0,
                    }}>{i + 1}</div>
                    <span style={{ flex: 1, fontSize: 13, color: '#1C2B4A' }}>{r}</span>
                    <span
                      onClick={() => setRoles(roles.filter((_, j) => j !== i))}
                      style={{ fontSize: 16, color: '#B8C2D0', cursor: 'pointer', lineHeight: 1 }}
                    >×</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addRole()}
                  placeholder="역할 추가"
                  style={{
                    flex: 1, border: '1px solid #E2E7EF', borderRadius: 6,
                    padding: '7px 10px', fontSize: 12, fontFamily: 'var(--font-ui)',
                    color: '#1C2B4A', outline: 'none',
                  }}
                />
                <button
                  onClick={addRole}
                  style={{
                    border: '1px solid #E2E7EF', borderRadius: 6, padding: '0 12px',
                    fontSize: 12, fontWeight: 600, color: '#1C2B4A', background: 'white',
                    cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  }}
                >추가</button>
              </div>
            </div>

            {error && <div style={{ fontSize: 12, color: '#C8374A', marginBottom: 12 }}>{error}</div>}

            <button
              onClick={handleCreate}
              disabled={submitting}
              style={{
                width: '100%', height: 42, background: '#1C2B4A', color: 'white',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-ui)',
                opacity: submitting ? 0.7 : 1,
              }}
            >{submitting ? '생성 중...' : '그룹 생성'}</button>
          </>
        )}

        {mode === 'join' && (
          <>
            <button onClick={() => { setMode('list'); setError(''); }} style={{ fontSize: 12, color: '#8A96A8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 16, fontFamily: 'var(--font-ui)' }}>← 뒤로</button>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1C2B4A', marginBottom: 8 }}>초대코드로 가입</div>
            <div style={{ fontSize: 13, color: '#8A96A8', marginBottom: 24 }}>그룹 대표자에게 초대코드를 받아 입력하세요.</div>

            <input
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="초대코드 입력 (예: ABC123)"
              style={{
                width: '100%', border: '1px solid #E2E7EF', borderRadius: 6,
                padding: '9px 12px', fontSize: 14, fontFamily: 'var(--font-mono)',
                color: '#1C2B4A', outline: 'none', boxSizing: 'border-box',
                letterSpacing: '0.1em', marginBottom: 12,
              }}
            />

            {error && <div style={{ fontSize: 12, color: '#C8374A', marginBottom: 12 }}>{error}</div>}

            <button
              onClick={handleJoin}
              disabled={submitting}
              style={{
                width: '100%', height: 42, background: '#1C2B4A', color: 'white',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-ui)',
                opacity: submitting ? 0.7 : 1,
              }}
            >{submitting ? '가입 중...' : '가입하기'}</button>
          </>
        )}
      </div>
    </div>
  );
}
