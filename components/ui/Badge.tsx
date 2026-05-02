'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'ok' | 'warn' | 'err' | 'info' | 'navy' | 'gray';
}

export default function Badge({ children, variant = 'gray' }: BadgeProps) {
  const map: Record<string, React.CSSProperties> = {
    ok:   { background: '#E8F5EE', color: '#3A8A5C' },
    warn: { background: '#FDF5E0', color: '#C08020' },
    err:  { background: '#FDECEA', color: '#C8374A' },
    info: { background: '#EAF0F8', color: '#4A6FA5' },
    navy: { background: '#1C2B4A', color: 'white' },
    gray: { background: '#E2E7EF', color: '#8A96A8' },
  };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 10, fontWeight: 700,
      padding: '3px 8px', borderRadius: 100,
      ...map[variant],
    }}>
      {children}
    </span>
  );
}
