'use client';

import React from 'react';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  warn?: boolean;
  style?: React.CSSProperties;
  type?: string;
  readOnly?: boolean;
}

export default function Input({ placeholder, value, onChange, warn, style: sx, type = 'text', readOnly }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      style={{
        width: '100%',
        border: `1px solid ${warn ? '#C8374A' : '#E2E7EF'}`,
        borderRadius: 6,
        color: '#1C2B4A',
        fontSize: 13,
        fontFamily: 'var(--font-ui)',
        padding: '9px 12px',
        height: 40,
        background: 'white',
        outline: 'none',
        boxSizing: 'border-box',
        ...sx,
      }}
    />
  );
}
