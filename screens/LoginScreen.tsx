'use client';

import React, { useState } from 'react';
import { Btn, Field, Input } from '@/components/ui';

interface LoginScreenProps {
  onLogin?: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  return (
    <div style={{
      minHeight: '100vh', background: '#E8ECF2',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'var(--font-ui)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        maxWidth: 1200, width: '100%',
        borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}>
        {/* Left — Navy brand panel */}
        <div style={{
          background: '#1C2B4A', padding: '48px 40px',
          display: 'flex', flexDirection: 'column', gap: 0,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -60, bottom: -80, width: 240, height: 240, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="6.5" stroke="white" strokeWidth="1.8" />
                <circle cx="9" cy="9" r="2" fill="white" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'white', letterSpacing: '0.5px' }}>GAGYEOL</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.3px' }}>가결 · AI 지출결의</div>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', margin: '0 0 10px', lineHeight: 1.2 }}>
              AI가 처리하는<br />스마트한 지출결의
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
              규정 업로드부터 PDF 저장까지,<br />전 과정을 자동화합니다.
            </p>
          </div>

          {[
            { t: 'AI 규정 자동 추출', d: '업로드한 규정책을 즉시 분석' },
            { t: 'OCR 영수증 인식',   d: '사진만 찍으면 자동 입력' },
            { t: '규정 준수 검사',    d: '위반 항목 자동 감지 및 알림' },
          ].map(f => (
            <div key={f.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 18 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 2 }}>{f.t}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{f.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — Auth form */}
        <div style={{ background: 'white', padding: '36px 40px', display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E2E7EF', marginBottom: 28 }}>
            {(['login', 'signup'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, height: 40, border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: tab === t ? 700 : 500,
                color: tab === t ? '#1C2B4A' : '#8A96A8',
                borderBottom: tab === t ? '2px solid #1C2B4A' : '2px solid transparent',
                marginBottom: -1, fontFamily: 'var(--font-ui)',
              }}>{t === 'login' ? '로그인' : '회원가입'}</button>
            ))}
          </div>

          {tab === 'login' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
              <Field label="이메일" required>
                <Input placeholder="name@company.com" type="email" />
              </Field>
              <Field label="비밀번호" required>
                <Input placeholder="비밀번호 입력" type="password" />
              </Field>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: '#4A6FA5', cursor: 'pointer' }}>비밀번호 찾기</span>
              </div>
              <Btn variant="navy" full size="lg" onClick={onLogin}>로그인</Btn>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#E2E7EF' }} />
                <span style={{ fontSize: 11, color: '#B8C2D0' }}>또는</span>
                <div style={{ flex: 1, height: 1, background: '#E2E7EF' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Btn variant="google" full>Google</Btn>
                <Btn variant="kakao" full>카카오</Btn>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
              <Field label="이름" required><Input placeholder="홍길동" /></Field>
              <Field label="이메일" required><Input placeholder="name@company.com" type="email" /></Field>
              <Field label="회사명" required><Input placeholder="(주)가결테크" /></Field>
              <Field label="비밀번호" required><Input placeholder="8자 이상 입력" type="password" /></Field>
              <Btn variant="navy" full size="lg" style={{ marginTop: 8 }} onClick={onLogin}>회원가입</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
