'use client';

import React from 'react';
import Badge from './Badge';

interface CheckItemProps {
  title: string;
  desc: string;
  status?: 'ok' | 'warn' | 'err';
}

export default function CheckItem({ title, desc, status = 'ok' }: CheckItemProps) {
  const cfg = {
    ok:   { bg: '#E8F5EE', color: '#3A8A5C', icon: '✓', border: '#E2E7EF', badge: '통과', bv: 'ok' as const },
    warn: { bg: '#FDF5E0', color: '#C08020', icon: '!',  border: '#C08020', badge: '주의', bv: 'warn' as const },
    err:  { bg: '#FDECEA', color: '#C8374A', icon: '✗',  border: '#C8374A', badge: '위반', bv: 'err' as const },
  };
  const c = cfg[status];

  return (
    <div style={{
      display: 'flex', gap: 10, padding: 12,
      background: 'white', borderRadius: 8,
      border: `1px solid ${c.border}`, marginBottom: 8,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: c.bg, color: c.color,
        fontSize: 11, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 1,
      }}>{c.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#1C2B4A', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11, color: '#5A6475', lineHeight: 1.5 }}>{desc}</div>
      </div>
      <Badge variant={c.bv}>{c.badge}</Badge>
    </div>
  );
}
