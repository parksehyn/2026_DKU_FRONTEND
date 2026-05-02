'use client';

import React from 'react';

interface HeroTagProps {
  children: React.ReactNode;
}

export default function HeroTag({ children }: HeroTagProps) {
  return (
    <span style={{
      display: 'inline-block',
      background: '#C8D6E8', color: '#2D3F63',
      fontSize: 10, fontWeight: 700,
      padding: '3px 10px', borderRadius: 100,
      letterSpacing: '0.5px',
    }}>
      {children}
    </span>
  );
}
