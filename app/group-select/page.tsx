'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, removeToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { setGroupId, setGroupName } from '@/lib/group';
import { Modal } from '@/components/ui';

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

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#2D3F63 0%, #1C2B4A 100%)',
  'linear-gradient(135deg,#4A6FA5 0%, #2D3F63 100%)',
  'linear-gradient(135deg,#C49C5C 0%, #8A6A33 100%)',
];

export default function GroupSelectPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  // 그룹 생성 폼
  const [groupName, setGroupName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [roles, setRoles] = useState(['회장', '부회장', '총무']);
  const [newRole, setNewRole] = useState('');

  // 초대코드
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
      if (res.ok) {
        const data: Group[] = await res.json();
        setGroups(data);
        if (data.length > 0) setSelectedId(data[0].groupId);
      } else if (res.status === 403) {
        // 토큰이 있으나 무효한 상태 → 로그아웃 후 로그인 화면
        removeToken();
        router.replace('/login');
        return;
      }
    } catch { /* 빈 상태 유지 */ } finally {
      setLoading(false);
    }
  }

  function enterGroup() {
    const g = groups.find(g => g.groupId === selectedId);
    if (!g) return;
    setGroupId(g.groupId);
    setGroupName(g.name);
    router.push('/dashboard');
  }

  async function handleCreate() {
    if (!groupName.trim()) { setError('그룹명을 입력하세요.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await apiFetch('/api/groups', {
        method: 'POST',
        body: JSON.stringify({ name: groupName.trim(), roles }),
      });
      if (res.ok) {
        const group: Group = await res.json();
        setGroupId(group.groupId);
        setGroupName(group.name);
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
        setGroupName(group.name);
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

  function logout() {
    removeToken();
    router.replace('/login');
  }

  const filtered = groups.filter(g =>
    !search.trim() ||
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  const fi: React.CSSProperties = {
    width: '100%', border: '1.5px solid var(--gray2)', borderRadius: 9,
    padding: '11px 13px', fontSize: 13, fontFamily: 'inherit',
    color: 'var(--navy)', background: '#fff', outline: 'none', transition: '.15s',
  };
  const fl: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--gray5)', marginBottom: 6,
  };
  const btnSecondary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '13px 14px', borderRadius: 11, fontSize: 13, fontWeight: 800,
    fontFamily: 'inherit', cursor: 'pointer', border: '1.5px solid var(--gray2)',
    background: '#fff', color: 'var(--navy)', transition: '.15s',
  };
  const btnPri: React.CSSProperties = {
    width: '100%', background: 'var(--navy)', color: '#fff', border: '1.5px solid var(--navy)',
    padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 800,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'inherit', cursor: 'pointer', transition: '.15s',
    boxShadow: '0 8px 18px rgba(28,43,74,.22)',
  };

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'var(--font-ui)', color: 'var(--navy)',
      background: `
        radial-gradient(1100px 700px at -10% -10%, rgba(255,255,255,.85) 0%, transparent 60%),
        radial-gradient(900px 600px at 110% 110%, rgba(74,111,165,.18) 0%, transparent 60%),
        linear-gradient(135deg,#EEF1F6 0%,#D8DEE8 60%,#C0CBDB 100%)
      `,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* 브랜드 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--navy)', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(28,43,74,.22)',
          }}>
            <div style={{
              width: 15, height: 15, border: '2.5px solid #fff', borderRadius: '50%',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 5, height: 5, background: '#fff', borderRadius: '50%',
              }} />
            </div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.6px', color: 'var(--navy)' }}>GAGYEOL</div>
        </div>

        {/* 카드 */}
        <div style={{
          position: 'relative', background: '#fff', borderRadius: 22,
          padding: '36px 36px 30px',
          boxShadow: '0 24px 60px rgba(28,43,74,.14), 0 4px 14px rgba(28,43,74,.06)',
          border: '1px solid rgba(255,255,255,.7)',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -2, left: 0, right: 0, height: 4,
            background: 'linear-gradient(90deg,#1C2B4A 0%, #4A6FA5 50%, #C49C5C 100%)',
          }} />

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 10, fontWeight: 800, letterSpacing: '1.6px',
              color: 'var(--blue)', background: 'var(--blue-pale)',
              padding: '5px 12px', borderRadius: 100,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--blue)' }} />
              WORKSPACE
            </span>
          </div>
          <div style={{
            fontSize: 24, fontWeight: 900, color: 'var(--navy)',
            textAlign: 'center', letterSpacing: '-0.4px', marginBottom: 8,
          }}>작업할 그룹을 선택하세요</div>
          <div style={{ fontSize: 13, color: 'var(--gray5)', textAlign: 'center', lineHeight: 1.6, marginBottom: 24 }}>
            한 계정으로 여러 그룹을 동시에 운영할 수 있어요.<br />
            이미 가입된 그룹을 선택하거나 새로 만들어 시작하세요.
          </div>

          {/* 검색 */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray4)' }}>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="그룹명 또는 대표자명으로 검색..."
              style={{
                width: '100%', border: '1.5px solid var(--gray2)', borderRadius: 11,
                padding: '12px 14px 12px 38px', fontSize: 13, fontFamily: 'inherit',
                color: 'var(--navy)', background: '#fff', outline: 'none', transition: '.15s',
              }}
            />
          </div>

          {/* 헤드 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 2px 10px' }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.2px', color: 'var(--gray4)' }}>내 그룹</span>
            <span style={{ fontSize: 11, color: 'var(--gray4)', fontFamily: 'var(--font-mono)' }}>
              {filtered.length} GROUP{filtered.length === 1 ? '' : 'S'}
            </span>
          </div>

          {/* 그룹 리스트 */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 13, color: 'var(--gray4)' }}>불러오는 중...</div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '24px 0',
              fontSize: 13, color: 'var(--gray4)',
              border: '1.5px dashed var(--gray2)', borderRadius: 14, marginBottom: 4,
            }}>
              {search ? '검색 결과가 없습니다.' : '소속된 그룹이 없습니다. 그룹을 만들거나 초대코드로 가입하세요.'}
            </div>
          ) : (
            filtered.map((g, idx) => {
              const sel = g.groupId === selectedId;
              const isOwner = g.ownerName && g.members.some(m => m.userId && m.roleName);
              return (
                <div
                  key={g.groupId}
                  onClick={() => setSelectedId(g.groupId)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px',
                    border: sel ? '1.5px solid var(--navy)' : '1.5px solid var(--gray2)',
                    borderRadius: 14,
                    background: sel
                      ? 'linear-gradient(135deg,#fff 0%, var(--blue-pale) 100%)'
                      : '#fff',
                    cursor: 'pointer', transition: '.18s ease',
                    marginBottom: 10, position: 'relative',
                    boxShadow: sel
                      ? '0 0 0 3px rgba(28,43,74,.07), 0 8px 22px rgba(28,43,74,.10)'
                      : 'none',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 15, fontWeight: 800, letterSpacing: '0.3px',
                    background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length],
                    boxShadow: '0 6px 14px rgba(28,43,74,.22)',
                  }}>{g.name.slice(0, 1)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--navy)' }}>{g.name}</div>
                      <span style={{
                        fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 100,
                        letterSpacing: '0.4px',
                        background: isOwner ? 'var(--green-bg)' : '#FBF1DD',
                        color: isOwner ? 'var(--green)' : '#C49C5C',
                      }}>{isOwner ? '대표' : '멤버'}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gray4)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{g.ownerName}</span>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--gray3)' }} />
                      <span>멤버 {g.members.length}명</span>
                    </div>
                  </div>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    border: sel ? '1.5px solid var(--navy)' : '1.5px solid var(--gray2)',
                    background: sel ? 'var(--navy)' : 'transparent',
                    color: sel ? '#fff' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontSize: 12, fontWeight: 800, transition: '.15s',
                  }}>✓</div>
                </div>
              );
            })
          )}

          {/* 액션 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 18 }}>
            <button onClick={() => { setCreateOpen(true); setError(''); }} style={btnSecondary}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              그룹 생성
            </button>
            <button onClick={() => { setJoinOpen(true); setError(''); }} style={btnSecondary}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 10h2M14 10h2M8 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              초대코드로 가입
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 14px', color: 'var(--gray4)', fontSize: 10, fontWeight: 700, letterSpacing: '1.2px' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--gray2)' }} />
            OR
            <div style={{ flex: 1, height: 1, background: 'var(--gray2)' }} />
          </div>

          <button
            onClick={enterGroup}
            disabled={selectedId == null}
            style={{
              ...btnPri,
              opacity: selectedId == null ? 0.5 : 1,
              cursor: selectedId == null ? 'not-allowed' : 'pointer',
            }}
          >
            선택한 그룹으로 입장
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 11, color: 'var(--gray4)' }}>
          다른 계정으로 진입하시겠어요?{' '}
          <a onClick={logout} style={{ color: 'var(--navy)', fontWeight: 700, cursor: 'pointer' }}>로그아웃</a>
        </div>
      </div>

      {/* 그룹 생성 모달 */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} width={420}>
        <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--navy)', marginBottom: 4 }}>새 그룹 만들기</div>
        <div style={{ fontSize: 12, color: 'var(--gray5)', marginBottom: 18 }}>
          그룹명과 결재 역할을 입력하세요. 생성 후 멤버를 초대할 수 있어요.
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={fl}>그룹명</label>
          <input
            style={fi}
            placeholder="예: 컴퓨터공학과 학생회"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={fl}>대표자</label>
          <input
            style={fi}
            placeholder="홍길동"
            value={ownerName}
            onChange={e => setOwnerName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={fl}>결재 역할 (순서대로)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
            {roles.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: 'var(--gray1)',
                  border: '1px solid var(--gray2)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--gray4)',
                  flexShrink: 0,
                }}>{i + 1}</div>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--navy)' }}>{r}</span>
                <span
                  onClick={() => setRoles(roles.filter((_, j) => j !== i))}
                  style={{ fontSize: 16, color: 'var(--gray3)', cursor: 'pointer', lineHeight: 1 }}
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
              style={{ ...fi, padding: '8px 10px', fontSize: 12 }}
            />
            <button
              onClick={addRole}
              style={{
                border: '1px solid var(--gray2)', borderRadius: 6, padding: '0 14px',
                fontSize: 12, fontWeight: 600, color: 'var(--navy)', background: '#fff',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >추가</button>
          </div>
        </div>

        {error && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 12 }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => setCreateOpen(false)} style={btnSecondary}>취소</button>
          <button
            onClick={handleCreate}
            disabled={submitting}
            style={{
              ...btnPri, padding: 13, borderRadius: 11, fontSize: 13,
              opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >{submitting ? '생성 중...' : '생성하기'}</button>
        </div>
      </Modal>

      {/* 초대코드 모달 */}
      <Modal open={joinOpen} onClose={() => setJoinOpen(false)} width={380}>
        <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--navy)', marginBottom: 4 }}>초대코드로 가입</div>
        <div style={{ fontSize: 12, color: 'var(--gray5)', marginBottom: 18 }}>
          관리자에게 받은 초대코드를 입력하세요.
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={fl}>초대코드</label>
          <input
            style={{ ...fi, fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}
            placeholder="GAGYEOL-XXXX-XXXX"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
        </div>

        {error && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 12 }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => setJoinOpen(false)} style={btnSecondary}>취소</button>
          <button
            onClick={handleJoin}
            disabled={submitting}
            style={{
              ...btnPri, padding: 13, borderRadius: 11, fontSize: 13,
              opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >{submitting ? '가입 중...' : '가입하기'}</button>
        </div>
      </Modal>
    </div>
  );
}
