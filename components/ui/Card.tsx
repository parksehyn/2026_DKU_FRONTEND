'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'selected' | 'warn' | 'error';
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function Card({ children, variant = 'default', style: sx, onClick }: CardProps) {
  const variants: Record<string, React.CSSProperties> = {
    default:  { background: '#FFFFFF', border: '1px solid #E2E7EF' },
    dark:     { background: '#1C2B4A', border: '1px solid #1C2B4A', color: 'white' },
    selected: { background: '#EAF0F8', border: '2px solid #1C2B4A' },
    warn:     { background: '#FFFFFF', border: '1.5px solid #C08020' },
    error:    { background: '#FFFFFF', border: '1.5px solid #C8374A' },
  };

  return (
    <div
      style={{
        borderRadius: 12, padding: 20,
        cursor: onClick ? 'pointer' : 'default',
        ...variants[variant], ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
