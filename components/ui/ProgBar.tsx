'use client';

import React from 'react';

interface ProgBarProps {
  value: number;
  variant?: 'pass' | 'warn' | 'error' | 'base';
}

export default function ProgBar({ value, variant = 'base' }: ProgBarProps) {
  const colors: Record<string, string> = {
    pass: '#3A8A5C', warn: '#C08020', error: '#C8374A', base: '#1C2B4A',
  };

  return (
    <div style={{ height: 4, background: '#E2E7EF', borderRadius: 100, margin: '4px 0' }}>
      <div style={{
        height: 4, borderRadius: 100,
        background: colors[variant] ?? colors.base,
        width: `${value}%`,
      }} />
    </div>
  );
}
