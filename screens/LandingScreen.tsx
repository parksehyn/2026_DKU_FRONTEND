'use client';

import React, { useState, useEffect, useRef, RefObject } from 'react';
import LoginScreen from './LoginScreen';

function useReveal(delay = 0): [RefObject<HTMLDivElement | null>, React.CSSProperties] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  }];
}

function Reveal({ children, delay = 0, style: sx }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const [ref, revealStyle] = useReveal(delay);
  return <div ref={ref} style={{ ...revealStyle, ...sx }}>{children}</div>;
}

interface LandingScreenProps {
  onStart?: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const [scrolled, setScrolled] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const scrollRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRootRef.current;
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 40);
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const handleStart = () => {
    setLoginVisible(true);
    setTimeout(() => {
      document.getElementById('landing-login-anchor')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const features = [
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></svg>,
      title: 'AI 규정 자동 추출',
      desc: 'PDF·DOCX 규정책을 업로드하면 AI가 핵심 규정을 즉시 파악하고 구조화합니다.',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>,
      title: 'OCR 영수증 자동 인식',
      desc: '영수증 사진을 업로드하면 가맹점명·금액·날짜를 자동으로 인식해 양식에 채웁니다.',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
      title: '규정 준수 자동 검사',
      desc: '숙박비·교통비·식비 등 항목별로 내부 규정 위반 여부를 실시간으로 감지합니다.',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6M9 15l3 3 3-3" /></svg>,
      title: 'PDF 원클릭 저장·제출',
      desc: '완성된 결의서를 PDF로 즉시 저장하고, 결재 라인에 바로 제출할 수 있습니다.',
    },
  ];

  const steps = [
    { n: '01', label: '규정 업로드',    desc: '내부 규정 문서 업로드' },
    { n: '02', label: 'AI 규정 추출',   desc: '규정 자동 구조화' },
    { n: '03', label: '증빙 업로드',    desc: '영수증 OCR 인식' },
    { n: '04', label: '양식 자동 완성', desc: 'LLM 자동 입력' },
    { n: '05', label: '규정 검사',      desc: '준수 여부 자동 판단' },
    { n: '06', label: 'PDF 저장',       desc: '결재 라인 제출' },
  ];

  return (
    <div
      ref={scrollRootRef}
      style={{ height: '100vh', overflowY: 'auto', background: '#E8ECF2', fontFamily: 'var(--font-ui)' }}
    >
      {/* Sticky nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 56, background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid #E2E7EF' : 'none',
        display: 'flex', alignItems: 'center', padding: '0 40px',
        justifyContent: 'space-between',
        transition: 'background 0.2s, border-color 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#1C2B4A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" />
              <circle cx="7" cy="7" r="1.5" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1C2B4A', letterSpacing: '0.3px' }}>GAGYEOL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={handleStart} style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, borderRadius: 6, padding: '7px 18px', height: 36, border: '1.5px solid #1C2B4A', background: 'transparent', color: '#1C2B4A', cursor: 'pointer' }}>
            로그인
          </button>
          <button onClick={handleStart} style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, borderRadius: 6, padding: '7px 18px', height: 36, border: 'none', background: '#1C2B4A', color: 'white', cursor: 'pointer' }}>
            시작하기
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '92vh', background: '#DDE3EC',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        padding: '60px 40px 80px',
        marginTop: -56, paddingTop: 'calc(60px + 56px)',
      }}>
        <div style={{ position: 'absolute', right: -80, bottom: -120, width: 520, height: 520, background: '#C8D6E8', opacity: 0.4, borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 200, top: -140, width: 380, height: 380, background: '#C8D6E8', opacity: 0.2, borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: -100, top: 100, width: 260, height: 260, background: '#C8D6E8', opacity: 0.12, borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 460px' }}>
            <Reveal delay={0}>
              <div style={{ display: 'inline-block', background: '#C8D6E8', color: '#2D3F63', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 100, letterSpacing: '0.5px', marginBottom: 20 }}>
                AI 기반 지출결의 시스템
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 style={{ fontSize: 48, fontWeight: 900, color: '#1C2B4A', letterSpacing: '-1px', lineHeight: 1.15, margin: '0 0 20px' }}>
                지출결의,<br />이제 AI가<br />처리합니다
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p style={{ fontSize: 15, color: '#5A6475', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 420 }}>
                규정 업로드부터 OCR 영수증 인식, 규정 준수 검사, PDF 저장까지 — 복잡한 결의 과정을 자동화합니다.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={handleStart} style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700, borderRadius: 6, padding: '13px 32px', height: 50, border: 'none', background: '#1C2B4A', color: 'white', cursor: 'pointer', letterSpacing: '0.2px' }}>
                  무료로 시작하기 →
                </button>
                <button style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, borderRadius: 6, padding: '13px 28px', height: 50, border: '1.5px solid #1C2B4A', background: 'transparent', color: '#1C2B4A', cursor: 'pointer' }}>
                  데모 보기
                </button>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div style={{ display: 'flex', gap: 20, marginTop: 32, flexWrap: 'wrap' }}>
                {['도입 기업 120+', '월 처리 결의서 8,000건', '평균 처리 시간 3분'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4A6FA5' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#5A6475' }}>{t}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right mockup card */}
          <Reveal delay={200} style={{ flex: '0 0 auto', width: 340 }}>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E7EF', overflow: 'hidden', boxShadow: '0 8px 32px rgba(28,43,74,0.10)' }}>
              <div style={{ height: 40, background: 'white', borderBottom: '1px solid #E2E7EF', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
                <div style={{ width: 18, height: 18, background: '#1C2B4A', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="9" height="9" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" /><circle cx="7" cy="7" r="1.5" fill="white" /></svg>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#1C2B4A' }}>GAGYEOL</span>
                <div style={{ flex: 1 }} />
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#1C2B4A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: 'white' }}>김</div>
              </div>
              <div style={{ background: '#DDE3EC', padding: '12px 16px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -20, bottom: -30, width: 120, height: 120, background: '#C8D6E8', opacity: 0.4, borderRadius: '50%' }} />
                <div style={{ fontSize: 8, fontWeight: 700, color: '#2D3F63', background: '#C8D6E8', padding: '2px 7px', borderRadius: 100, display: 'inline-block', marginBottom: 5 }}>STEP 5 · 규정 검사</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#1C2B4A' }}>규정 준수 검사 결과</div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                {[
                  { label: '교통비 규정 통과', icon: '✓', bg: '#E8F5EE', c: '#3A8A5C', bc: '#E2E7EF', badge: '통과' },
                  { label: '식비 한도 주의',   icon: '!', bg: '#FDF5E0', c: '#C08020', bc: '#C08020', badge: '주의' },
                  { label: '숙박비 규정 위반', icon: '✗', bg: '#FDECEA', c: '#C8374A', bc: '#C8374A', badge: '위반' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', gap: 8, padding: '7px 8px', background: 'white', borderRadius: 6, border: `1px solid ${r.bc}`, marginBottom: 6, alignItems: 'center' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: r.bg, color: r.c, fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#1C2B4A', flex: 1 }}>{r.label}</span>
                    <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 100, background: r.bg, color: r.c }}>{r.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: '#EAF0F8', color: '#4A6FA5', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 100, letterSpacing: '0.5px', marginBottom: 14 }}>핵심 기능</div>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: '#1C2B4A', letterSpacing: '-0.5px', margin: '0 0 12px' }}>복잡한 결의 프로세스를<br />처음부터 끝까지 자동화</h2>
          <p style={{ fontSize: 14, color: '#5A6475', lineHeight: 1.6, margin: 0 }}>규정 검토부터 제출까지, 반복적인 업무를 AI가 대신합니다.</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ background: 'white', border: '1px solid #E2E7EF', borderRadius: 12, padding: 24, height: '100%' }}>
                <div style={{ width: 44, height: 44, background: '#EAF0F8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {f.icon}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1C2B4A', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: '#5A6475', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Workflow Steps */}
      <section style={{ padding: '0 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#1C2B4A', letterSpacing: '-0.5px', margin: '0 0 10px' }}>6단계로 완성되는 결의서</h2>
          <p style={{ fontSize: 13, color: '#8A96A8', margin: 0 }}>규정 업로드부터 PDF 제출까지 평균 3분</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <div style={{ background: 'white', border: '1px solid #E2E7EF', borderRadius: 12, padding: '20px 18px', position: 'relative', height: '100%' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#E2E7EF', fontFamily: 'var(--font-mono)', marginBottom: 10, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2B4A', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#8A96A8' }}>{s.desc}</div>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', right: -7, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#B8C2D0', zIndex: 1 }}>›</div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA Band */}
      <section style={{ background: '#1C2B4A', padding: '64px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -80, bottom: -100, width: 400, height: 400, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', left: -60, top: -60, width: 280, height: 280, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
        <Reveal style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'white', letterSpacing: '-0.5px', margin: '0 0 14px' }}>지금 바로 시작하세요</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: '0 0 32px' }}>
            복잡한 설치 없이 바로 사용 가능합니다.<br />무료 체험 후 결정하세요.
          </p>
          <button onClick={handleStart} style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 700, borderRadius: 6, padding: '14px 40px', height: 52, border: 'none', background: 'white', color: '#1C2B4A', cursor: 'pointer', letterSpacing: '0.2px' }}>
            무료로 시작하기 →
          </button>
        </Reveal>
      </section>

      {/* Login section */}
      <div
        id="landing-login-anchor"
        style={{
          opacity: loginVisible ? 1 : 0,
          maxHeight: loginVisible ? 'none' : 0,
          overflow: loginVisible ? 'visible' : 'hidden',
          transition: 'opacity 0.4s ease',
          padding: loginVisible ? '60px 24px' : 0,
          background: '#E8ECF2',
        }}
      >
        {loginVisible && <LoginScreen onLogin={onStart} />}
      </div>

      {/* Footer */}
      <footer style={{ background: '#1C2B4A', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, background: 'rgba(255,255,255,0.15)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" /><circle cx="7" cy="7" r="1.5" fill="white" /></svg>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>GAGYEOL</span>
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>© 2025 GAGYEOL. AI 기반 지출결의 시스템.</span>
      </footer>
    </div>
  );
}
