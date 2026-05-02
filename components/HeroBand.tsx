'use client';

import React from 'react';

interface HeroBandProps {
  tag?: string;
  title: string;
  desc?: string;
  actions?: React.ReactNode;
  compact?: boolean;
}

export default function HeroBand({ tag, title, desc, actions, compact = false }: HeroBandProps) {
  return (
    <div style={{
      background: '#DDE3EC',
      padding: compact ? '18px 40px' : '32px 40px',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: compact ? 80 : 160,
    }}>
      {/* Decoration circles */}
      <div style={{
        position: 'absolute', right: -60, bottom: -80,
        width: 320, height: 320,
        background: '#C8D6E8', opacity: 0.35,
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 80, top: -100,
        width: 250, height: 250,
        background: '#C8D6E8', opacity: 0.2,
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {tag && (
          <div style={{
            display: 'inline-block',
            background: '#C8D6E8', color: '#2D3F63',
            fontSize: 10, fontWeight: 700,
            padding: '3px 10px', borderRadius: 100,
            letterSpacing: '0.5px', marginBottom: 12,
          }}>{tag}</div>
        )}
        <h1 style={{
          fontSize: compact ? 22 : 32, fontWeight: 900,
          color: '#1C2B4A', letterSpacing: '-0.5px', margin: '0 0 8px',
        }}>{title}</h1>
        {desc && (
          <p style={{
            fontSize: 13, color: '#5A6475',
            maxWidth: 380, lineHeight: 1.5, margin: 0,
          }}>{desc}</p>
        )}
      </div>

      {actions && (
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 10, flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
}
