'use client';

import React, { useState, useEffect } from 'react';
import HeroBand from '@/components/HeroBand';
import { Btn, Badge, Field, Input, AIStrip, RegItem } from '@/components/ui';

interface Reg {
  num: string;
  title: string;
  body: string;
}

const REGS: Reg[] = [
  { num: '규정 01', title: '숙박비 한도', body: '국내 출장 시 1박당 숙박비는 300,000원을 초과할 수 없습니다.' },
  { num: '규정 02', title: '교통비 기준', body: 'KTX 이용 시 일반실 기준으로 실비 지급하며, 비행기는 이코노미 클래스만 허용됩니다.' },
  { num: '규정 03', title: '식비 일일 한도', body: '출장 중 식비는 1인 1일 30,000원을 초과할 수 없습니다.' },
  { num: '규정 04', title: '법인카드 사용', body: '50,000원 이상 지출 시 법인카드 사용을 원칙으로 합니다.' },
  { num: '규정 05', title: '증빙 첨부 의무', body: '모든 지출에 대해 영수증 또는 세금계산서를 첨부해야 합니다.' },
];

interface RegulationScreenProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export default function RegulationScreen({ onNext, onPrev }: RegulationScreenProps) {
  const [selected, setSelected] = useState(0);
  const [editTitle, setEditTitle] = useState(REGS[0].title);
  const [editBody, setEditBody] = useState(REGS[0].body);

  useEffect(() => {
    setEditTitle(REGS[selected].title);
    setEditBody(REGS[selected].body);
  }, [selected]);

  const reg = REGS[selected];

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <HeroBand
        tag="STEP 2 · 규정 추출"
        title="AI가 추출한 규정을 확인하세요"
        desc="규정 내용을 검토하고, 필요하면 수정·추가하세요."
        compact
        actions={<>
          <Btn variant="outline" onClick={onPrev}>이전</Btn>
          <Btn variant="navy" onClick={onNext}>확인 완료 →</Btn>
        </>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 520 }}>
        {/* Left — reg list */}
        <div style={{ background: '#F4F6FA', borderRight: '1px solid #E2E7EF', padding: '24px 28px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1C2B4A' }}>추출된 규정 목록</span>
            <Badge variant="info">AI 추출</Badge>
          </div>
          <AIStrip title="AI 추출 완료" desc={`${REGS.length}개의 규정이 문서에서 추출되었습니다.`} />
          {REGS.map((r, i) => (
            <RegItem key={i} {...r} selected={selected === i} onClick={() => setSelected(i)} />
          ))}
          <button style={{
            width: '100%', border: '1.5px dashed #B8C2D0', borderRadius: 8,
            background: 'transparent', padding: '10px 0',
            fontSize: 12, fontWeight: 600, color: '#8A96A8', cursor: 'pointer',
            marginTop: 4, fontFamily: 'var(--font-ui)',
          }}>+ 규정 직접 추가</button>
        </div>

        {/* Right — edit form */}
        <div style={{ background: 'white', padding: '24px 28px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1C2B4A', marginBottom: 4 }}>규정 수정</div>
            <div style={{ fontSize: 11, color: '#8A96A8' }}>추출 내용을 확인하고 필요하면 수정하세요</div>
          </div>
          <Field label="규정 번호">
            <Input value={reg.num} readOnly style={{ background: '#F4F6FA', color: '#8A96A8' }} />
          </Field>
          <Field label="규정 제목" required>
            <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
          </Field>
          <Field label="규정 내용" required>
            <textarea
              value={editBody}
              onChange={e => setEditBody(e.target.value)}
              style={{
                width: '100%', border: '1px solid #E2E7EF', borderRadius: 6,
                color: '#1C2B4A', fontSize: 13, fontFamily: 'var(--font-ui)',
                padding: '9px 12px', height: 100, background: 'white', outline: 'none',
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          </Field>
          <Field label="적용 지출 유형">
            <select style={{
              width: '100%', border: '1px solid #E2E7EF', borderRadius: 6,
              color: '#1C2B4A', fontSize: 13, fontFamily: 'var(--font-ui)',
              padding: '9px 12px', height: 40, background: 'white', outline: 'none',
              appearance: 'none', boxSizing: 'border-box',
            }}>
              <option>숙박비</option>
              <option>교통비</option>
              <option>식비</option>
              <option>기타</option>
            </select>
          </Field>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Btn variant="navy" full>저장</Btn>
            <Btn variant="gray">삭제</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
