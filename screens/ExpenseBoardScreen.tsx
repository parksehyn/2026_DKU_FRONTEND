'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui';

type BizState = 'inProgress' | 'done' | 'review';
type BizBadge = 'draft' | 'done' | 'review' | 'empty';

interface Biz {
  no: string;
  name: string;
  desc: string;
  state: BizState;
  badge: BizBadge;
  count: string;
  amount: string;
  modified: string;
}

const BADGE_CFG: Record<BizBadge, { label: string; bg: string; color: string }> = {
  draft:  { label: '초안 작성중', bg: 'var(--amber-bg)',  color: 'var(--amber)' },
  done:   { label: '완료',        bg: 'var(--green-bg)',  color: 'var(--green)' },
  review: { label: '검토중',      bg: 'var(--blue-pale)', color: 'var(--blue)'  },
  empty:  { label: '작성 전',     bg: 'var(--amber-bg)',  color: 'var(--amber)' },
};

const STATE_TAG: Record<BizState, { label: string; bg: string; color: string }> = {
  inProgress: { label: '진행중', bg: 'var(--blue-pale)', color: 'var(--blue)'  },
  done:       { label: '완료',   bg: 'var(--green-bg)',  color: 'var(--green)' },
  review:     { label: '진행중', bg: 'var(--blue-pale)', color: 'var(--blue)'  },
};

const INITIAL_BIZ: Biz[] = [
  { no: '001', name: 'A대학 학생회비 정산', desc: '2024년도 2학기 학생회 지출결의',
    state: 'inProgress', badge: 'draft', count: '12건', amount: '₩18,240,000', modified: '2024.12.10' },
  { no: '002', name: 'B연구소 과제비 정산', desc: '2024년 3분기 연구과제 지출',
    state: 'done', badge: 'done', count: '8건', amount: '₩7,540,000', modified: '2024.11.28' },
  { no: '003', name: 'C동아리 행사비 정산', desc: '2024 동아리 축제 지출결의',
    state: 'inProgress', badge: 'review', count: '5건', amount: '₩3,120,000', modified: '2024.12.08' },
];

export default function ExpenseBoardScreen() {
  const router = useRouter();
  const [bizList, setBizList] = useState<Biz[]>(INITIAL_BIZ);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('홍길동');
  const [desc, setDesc] = useState('');

  function addBiz() {
    const trimmed = name.trim() || '새 사업';
    const next: Biz = {
      no: String(bizList.length + 1).padStart(3, '0'),
      name: trimmed,
      desc: desc || '',
      state: 'inProgress', badge: 'empty',
      count: '0건', amount: '₩0', modified: '방금 전',
    };
    setBizList([...bizList, next]);
    setOpen(false);
    setName(''); setDesc('');
    sessionStorage.setItem('currentBusinessName', trimmed);
    router.push('/receipt');
  }

  function selectBiz(b: Biz) {
    sessionStorage.setItem('currentBusinessName', b.name);
    router.push('/receipt');
  }

  const fi: React.CSSProperties = {
    width: '100%', border: '1px solid var(--gray2)', borderRadius: 6,
    color: 'var(--navy)', fontSize: 13, fontFamily: 'inherit',
    padding: '9px 12px', height: 40, background: '#fff', outline: 'none',
  };
  const fl: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: 'var(--gray5)', marginBottom: 5, display: 'block',
  };

  return (
    <div style={{ fontFamily: 'var(--font-ui)', padding: '28px 32px', color: 'var(--navy)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20,
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>지출결의</div>
          <div style={{ fontSize: 13, color: 'var(--gray4)' }}>사업별 지출결의를 관리합니다</div>
        </div>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: 'var(--navy)', color: '#fff', border: 'none',
            borderRadius: 6, padding: '9px 20px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >+ 사업 추가</button>
      </div>

      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid var(--gray2)', overflow: 'hidden',
      }}>
        {/* Head */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 120px 80px 130px 100px',
          alignItems: 'center', gap: 12,
          padding: '14px 20px',
          borderBottom: '1px solid var(--gray1)',
          background: 'var(--gray1)',
          fontSize: 10, fontWeight: 700, color: 'var(--gray4)',
          letterSpacing: '0.3px', textTransform: 'uppercase',
        }}>
          <div>번호</div><div>사업명</div><div>상태</div><div>건수</div><div>총 금액</div><div>최근 수정</div>
        </div>

        {/* Rows */}
        {bizList.map((b, i) => {
          const stateCfg = STATE_TAG[b.state];
          const badgeCfg = BADGE_CFG[b.badge];
          return (
            <div
              key={b.no}
              onClick={() => selectBiz(b)}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 120px 80px 130px 100px',
                alignItems: 'center', gap: 12,
                padding: '14px 20px',
                borderBottom: i === bizList.length - 1 ? 'none' : '1px solid var(--gray1)',
                cursor: 'pointer', transition: 'background .12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--blue-pale)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ fontSize: 11, color: 'var(--gray4)' }}>{b.no}</div>
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: stateCfg.bg, color: stateCfg.color,
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                  marginRight: 8,
                }}>● {stateCfg.label}</span>
                <strong style={{ fontSize: 13 }}>{b.name}</strong>
                {b.desc && <div style={{ fontSize: 11, color: 'var(--gray4)', marginTop: 2 }}>{b.desc}</div>}
              </div>
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: badgeCfg.bg, color: badgeCfg.color,
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                }}>{badgeCfg.label}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray5)' }}>{b.count}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{b.amount}</div>
              <div style={{ fontSize: 11, color: 'var(--gray4)' }}>{b.modified}</div>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} width={400}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>새 사업 추가</div>
        <div style={{ fontSize: 12, color: 'var(--gray4)', marginBottom: 18 }}>
          지출결의를 관리할 사업명을 입력해 주세요
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={fl}>사업명 <span style={{ color: 'var(--red)' }}>*</span></label>
          <input
            style={fi}
            placeholder="예: 2024 동아리 행사비 정산"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={fl}>담당자</label>
          <input
            style={fi}
            placeholder="홍길동"
            value={owner}
            onChange={e => setOwner(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={fl}>설명</label>
          <textarea
            style={{ ...fi, height: 72, resize: 'vertical' }}
            placeholder="사업 관련 간략한 설명"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              flex: 1, background: 'var(--gray2)', color: 'var(--gray5)',
              border: 'none', borderRadius: 6, padding: '9px 20px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >취소</button>
          <button
            onClick={addBiz}
            style={{
              flex: 1, background: 'var(--navy)', color: '#fff',
              border: 'none', borderRadius: 6, padding: '9px 20px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >사업 추가</button>
        </div>
      </Modal>
    </div>
  );
}
