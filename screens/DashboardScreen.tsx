'use client';

import React, { useState } from 'react';
import HeroBand from '@/components/HeroBand';
import { Btn, Badge } from '@/components/ui';

interface MonthFile {
  name: string;
  date: string;
  status: 'ok' | 'warn' | 'err';
}

interface MonthData {
  year: number;
  month: number;
  open: boolean;
  files: MonthFile[];
}

interface Submission {
  id: string;
  title: string;
  date: string;
  status: 'review' | 'approved' | 'rejected';
}

interface DashboardScreenProps {
  onNew?: () => void;
}

const MOCK_MONTHS: MonthData[] = [
  {
    year: 2025, month: 1, open: true,
    files: [
      { name: '출장비_결의서_0117.pdf', date: '01-17', status: 'err' },
      { name: '법인카드_사용명세_0110.pdf', date: '01-10', status: 'ok' },
      { name: '물품구매_결의서_0105.pdf', date: '01-05', status: 'ok' },
    ],
  },
  {
    year: 2024, month: 12, open: false,
    files: [
      { name: '출장비_결의서_1220.pdf', date: '12-20', status: 'ok' },
      { name: '접대비_결의서_1215.pdf', date: '12-15', status: 'warn' },
      { name: '소모품_구매_결의서_1208.pdf', date: '12-08', status: 'ok' },
      { name: '출장비_결의서_1201.pdf', date: '12-01', status: 'ok' },
    ],
  },
  {
    year: 2024, month: 11, open: false,
    files: [
      { name: '출장비_결의서_1118.pdf', date: '11-18', status: 'ok' },
      { name: '법인카드_사용명세_1105.pdf', date: '11-05', status: 'ok' },
    ],
  },
];

const MOCK_SUBMISSIONS: Submission[] = [
  { id: 'EXP-2025-0142', title: '출장비 지출결의서', date: '2025-01-17', status: 'review' },
  { id: 'EXP-2025-0131', title: '법인카드 사용명세서', date: '2025-01-10', status: 'approved' },
  { id: 'EXP-2025-0118', title: '물품구매 결의서', date: '2025-01-05', status: 'approved' },
  { id: 'EXP-2024-0412', title: '접대비 지출결의서', date: '2024-12-15', status: 'rejected' },
  { id: 'EXP-2024-0398', title: '출장비 지출결의서', date: '2024-12-01', status: 'approved' },
];

const STATUS_CFG = {
  ok:       { label: '통과',   variant: 'ok'   as const },
  warn:     { label: '주의',   variant: 'warn' as const },
  err:      { label: '위반',   variant: 'err'  as const },
  review:   { label: '검토중', variant: 'info' as const },
  approved: { label: '승인',   variant: 'ok'   as const },
  rejected: { label: '반려',   variant: 'err'  as const },
};

const STATUS_COLORS: Record<MonthFile['status'], string> = {
  ok: '#3A8A5C', warn: '#C08020', err: '#C8374A',
};

const FileIcon = ({ color = '#4A6FA5' }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, sub, valueColor, icon }: StatCardProps) => (
  <div style={{
    background: 'white', border: '1px solid #E2E7EF',
    borderRadius: 12, padding: '20px 22px',
    display: 'flex', flexDirection: 'column', gap: 10,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#8A96A8', letterSpacing: '0.1px' }}>{label}</span>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: '#F4F6FA', border: '1px solid #E2E7EF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
    </div>
    <div style={{
      fontSize: 28, fontWeight: 900,
      color: valueColor ?? '#1C2B4A',
      fontFamily: value.includes(',') ? 'var(--font-mono)' : 'inherit',
      lineHeight: 1.1, letterSpacing: '-0.5px',
    }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: '#8A96A8' }}>{sub}</div>}
  </div>
);

const DirMonth = ({ year, month, open: initOpen, files }: MonthData) => {
  const [open, setOpen] = useState(initOpen);

  return (
    <div style={{ marginBottom: 4 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: open ? '#EAF0F8' : 'transparent',
          border: 'none', borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px', cursor: 'pointer',
          fontFamily: 'var(--font-ui)',
          transition: 'background 0.15s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={open ? '#4A6FA5' : '#B8C2D0'} stroke="none">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
        <span style={{
          fontSize: 13, fontWeight: 700,
          color: open ? '#1C2B4A' : '#5A6475', flex: 1, textAlign: 'left',
        }}>
          {year}년 {month}월
        </span>
        <span style={{ fontSize: 10, color: '#B8C2D0', marginRight: 4 }}>{files.length}건</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
          <path d="M2 3.5l3 3 3-3" stroke="#B8C2D0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{ marginLeft: 10, borderLeft: '1.5px solid #E2E7EF', marginTop: 2, paddingLeft: 14 }}>
          {files.map((f, i) => (
            <div key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 8px', borderRadius: 6,
                cursor: 'pointer', transition: 'background 0.12s',
                marginBottom: 2,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F4F6FA')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <FileIcon color={STATUS_COLORS[f.status]} />
              <span style={{ fontSize: 12, color: '#1C2B4A', flex: 1, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {f.name}
              </span>
              <span style={{ fontSize: 10, color: '#B8C2D0', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                {f.date}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 700,
                padding: '2px 6px', borderRadius: 100, flexShrink: 0,
                background: f.status === 'ok' ? '#E8F5EE' : f.status === 'warn' ? '#FDF5E0' : '#FDECEA',
                color: STATUS_COLORS[f.status],
              }}>
                {STATUS_CFG[f.status].label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function DashboardScreen({ onNew }: DashboardScreenProps) {
  const stats: StatCardProps[] = [
    {
      label: '이번 달 제출 건수', value: '12건', sub: '전월 대비 +3건',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      label: '이번 달 총 금액', value: '4,250,000원', sub: '전월 3,980,000원',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
    {
      label: '처리 중', value: '3건', sub: '평균 대기 2.4일', valueColor: '#C08020',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C08020" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: '규정 준수율 평균', value: '84%', sub: '통과 기준 80% 이상', valueColor: '#3A8A5C',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3A8A5C" strokeWidth="1.5" strokeLinecap="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <HeroBand
        tag="대시보드"
        title="안녕하세요, 김민준님"
        desc="2025년 1월의 지출결의 현황을 확인하세요."
        compact
        actions={<Btn variant="navy" onClick={onNew}>+ 새 결의서 작성</Btn>}
      />

      <div style={{ padding: '28px 40px' }}>
        {/* 현황 요약 카드 4개 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* 하단 2열 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* 좌: 월별 디렉토리 */}
          <div style={{ background: 'white', border: '1px solid #E2E7EF', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1C2B4A' }}>월별 결의서 디렉토리</div>
                <div style={{ fontSize: 11, color: '#8A96A8', marginTop: 2 }}>연도·월 단위로 분류된 제출 파일</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#C8374A', cursor: 'pointer' }}>전체 보기 ›</span>
            </div>

            <div style={{ position: 'relative', marginBottom: 14 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B8C2D0" strokeWidth="1.5"
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                placeholder="파일명 검색..."
                style={{
                  width: '100%', border: '1px solid #E2E7EF', borderRadius: 6,
                  color: '#1C2B4A', fontSize: 12, fontFamily: 'var(--font-ui)',
                  padding: '7px 12px 7px 32px', height: 34,
                  background: '#F4F6FA', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {MOCK_MONTHS.map((m, i) => <DirMonth key={i} {...m} />)}
            </div>
          </div>

          {/* 우: 결의서 상태 추적 */}
          <div style={{ background: 'white', border: '1px solid #E2E7EF', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1C2B4A' }}>결의서 상태 추적</div>
                <div style={{ fontSize: 11, color: '#8A96A8', marginTop: 2 }}>최근 5건의 제출 현황</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#C8374A', cursor: 'pointer' }}>전체 보기 ›</span>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[
                { label: '검토중', count: 1, variant: 'info' as const },
                { label: '승인',   count: 3, variant: 'ok'   as const },
                { label: '반려',   count: 1, variant: 'err'  as const },
              ].map(p => (
                <div key={p.label} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: '#F4F6FA', border: '1px solid #E2E7EF',
                  borderRadius: 100, padding: '4px 12px',
                }}>
                  <Badge variant={p.variant}>{p.label}</Badge>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#5A6475', fontFamily: 'var(--font-mono)' }}>{p.count}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MOCK_SUBMISSIONS.map((s, i) => {
                const cfg = STATUS_CFG[s.status];
                return (
                  <div key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px',
                      background: '#F4F6FA', borderRadius: 8,
                      border: '1px solid #E2E7EF',
                      cursor: 'pointer', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#1C2B4A')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E7EF')}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: s.status === 'approved' ? '#E8F5EE' : s.status === 'rejected' ? '#FDECEA' : '#EAF0F8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {s.status === 'approved' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3A8A5C" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                      )}
                      {s.status === 'rejected' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8374A" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      )}
                      {s.status === 'review' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2B4A', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, color: '#8A96A8', fontFamily: 'var(--font-mono)' }}>{s.id}</span>
                        <span style={{ width: 2, height: 2, background: '#B8C2D0', borderRadius: '50%', display: 'inline-block' }} />
                        <span style={{ fontSize: 10, color: '#8A96A8' }}>{s.date}</span>
                      </div>
                    </div>

                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #F4F6FA' }}>
              <Btn variant="outline" full onClick={onNew}>+ 새 결의서 시작하기</Btn>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
