'use client';

import React from 'react';

interface AIStripProps {
  title: string;
  desc: string;
}

export default function AIStrip({ title, desc }: AIStripProps) {
  return (
    <div style={{
      background: '#1C2B4A', borderRadius: 10,
      padding: '14px 18px', display: 'flex',
      alignItems: 'center', gap: 12, marginBottom: 18,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: 'rgba(255,255,255,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: 'white',
        fontFamily: 'var(--font-mono)', flexShrink: 0,
      }}>AI</div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{desc}</div>
      </div>
    </div>
  );
}
