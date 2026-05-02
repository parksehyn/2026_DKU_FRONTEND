'use client';

import React from 'react';

interface BtnProps {
  children: React.ReactNode;
  variant?: 'navy' | 'outline' | 'gray' | 'kakao' | 'google';
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Btn({
  children,
  variant = 'navy',
  size = 'md',
  full = false,
  onClick,
  style: sx,
  type = 'button',
  disabled = false,
}: BtnProps) {
  const base: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: size === 'lg' ? 14 : size === 'sm' ? 12 : 13,
    fontWeight: 600,
    borderRadius: 6,
    padding: size === 'lg' ? '12px 28px' : size === 'sm' ? '6px 14px' : '9px 20px',
    height: size === 'lg' ? 46 : size === 'sm' ? 32 : 38,
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    textDecoration: 'none',
    transition: 'background 0.15s',
    width: full ? '100%' : 'auto',
    justifyContent: full ? 'center' : 'flex-start',
    boxSizing: 'border-box',
  };

  const variants: Record<string, React.CSSProperties> = {
    navy:    { background: '#1C2B4A', color: 'white' },
    outline: { background: 'transparent', color: '#1C2B4A', border: '1.5px solid #1C2B4A' },
    gray:    { background: '#E2E7EF', color: '#5A6475' },
    kakao:   { background: '#FEE500', color: '#3B1D02', fontWeight: 700 },
    google:  { background: 'white', color: '#5A6475', border: '1px solid #E2E7EF' },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}), ...sx }}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  );
}
