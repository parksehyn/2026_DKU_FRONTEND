'use client';

import React from 'react';
import Link from 'next/link';

interface GNBProps {
  activeMenu?: string;
}

const menus = ['대시보드', '지출결의', '규정 관리', '보고서'];

export default function GNB({ activeMenu = '대시보드' }: GNBProps) {
  return (
    <nav style={{
      height: 56, background: '#FFFFFF',
      borderBottom: '1px solid #E2E7EF',
      display: 'flex', alignItems: 'center',
      padding: '0 40px', gap: 32,
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, textDecoration: 'none' }}>
        <div style={{
          width: 28, height: 28, background: '#1C2B4A',
          borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" />
            <circle cx="7" cy="7" r="1.5" fill="white" />
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#1C2B4A', letterSpacing: '0.3px' }}>GAGYEOL</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {menus.map(m => (
          <a key={m} href="#" style={{
            fontSize: 13,
            fontWeight: m === activeMenu ? 700 : 500,
            color: m === activeMenu ? '#1C2B4A' : '#8A96A8',
            textDecoration: 'none',
            height: 56, display: 'flex', alignItems: 'center',
            padding: '0 16px',
            borderBottom: m === activeMenu ? '2px solid #1C2B4A' : '2px solid transparent',
            transition: 'color 0.15s, border-color 0.15s',
          }}>{m}</a>
        ))}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{
          fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
          borderRadius: 6, padding: '6px 14px', height: 32,
          border: 'none', cursor: 'pointer',
          background: '#E2E7EF', color: '#5A6475',
        }}>도움말</button>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#1C2B4A', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: 'white', cursor: 'pointer',
        }}>김</div>
      </div>
    </nav>
  );
}
