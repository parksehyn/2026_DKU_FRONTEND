'use client';

import React, { useState } from 'react';
import { Btn, Field, Input } from '@/components/ui';
import { apiFetch } from '@/lib/api';
import { setToken } from '@/lib/auth';

interface LoginScreenProps {
  onLogin?: () => void;
}

type Tab = 'login' | 'signup';

interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [tab, setTab] = useState<Tab>('login');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', company: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });
      if (res.ok) {
        const data: AuthResponse = await res.json();
        setToken(data.token);
        onLogin?.();
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError('');
    if (signupForm.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: signupForm.email, password: signupForm.password, name: signupForm.name }),
      });
      if (res.ok) {
        const data: AuthResponse = await res.json();
        setToken(data.token);
        onLogin?.();
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.message ?? '회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch {
      setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

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
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E2E7EF', marginBottom: 28 }}>
            {(['login', 'signup'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }} style={{
                flex: 1, height: 40, border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: tab === t ? 700 : 500,
                color: tab === t ? '#1C2B4A' : '#8A96A8',
                borderBottom: tab === t ? '2px solid #1C2B4A' : '2px solid transparent',
                marginBottom: -1, fontFamily: 'var(--font-ui)',
              }}>{t === 'login' ? '로그인' : '회원가입'}</button>
            ))}
          </div>

          {error && (
            <div style={{
              fontSize: 12, color: '#C8374A',
              background: '#FDECEA', border: '1px solid #F5C6C6',
              borderRadius: 6, padding: '8px 12px', marginBottom: 16,
            }}>{error}</div>
          )}

          {tab === 'login' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
              <Field label="이메일" required>
                <Input
                  placeholder="name@company.com" type="email"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                />
              </Field>
              <Field label="비밀번호" required>
                <Input
                  placeholder="비밀번호 입력" type="password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                />
              </Field>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: '#4A6FA5', cursor: 'pointer' }}>비밀번호 찾기</span>
              </div>
              <Btn variant="navy" full size="lg" onClick={handleLogin} disabled={loading}>
                {loading ? '로그인 중...' : '로그인'}
              </Btn>
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
              <Field label="이름" required>
                <Input
                  placeholder="홍길동"
                  value={signupForm.name}
                  onChange={e => setSignupForm(f => ({ ...f, name: e.target.value }))}
                />
              </Field>
              <Field label="이메일" required>
                <Input
                  placeholder="name@company.com" type="email"
                  value={signupForm.email}
                  onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
                />
              </Field>
              <Field label="회사명" required>
                <Input
                  placeholder="(주)가결테크"
                  value={signupForm.company}
                  onChange={e => setSignupForm(f => ({ ...f, company: e.target.value }))}
                />
              </Field>
              <Field label="비밀번호" required>
                <Input
                  placeholder="8자 이상 입력" type="password"
                  value={signupForm.password}
                  onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                />
              </Field>
              <Btn variant="navy" full size="lg" style={{ marginTop: 8 }} onClick={handleSignup} disabled={loading}>
                {loading ? '처리 중...' : '회원가입'}
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
