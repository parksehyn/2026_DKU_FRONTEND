'use client';

import React from 'react';

interface RegItemProps {
  num: string;
  title: string;
  body: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function RegItem({ num, title, body, selected, onClick }: RegItemProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? '#EAF0F8' : 'white',
        border: selected ? '1.5px solid #1C2B4A' : '1px solid #E2E7EF',
        borderRadius: 8, padding: 14, marginBottom: 10,
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <div style={{
        fontSize: 10, fontWeight: 700, color: '#4A6FA5',
        background: '#EAF0F8', padding: '2px 7px',
        borderRadius: 100, display: 'inline-block', marginBottom: 6,
      }}>{num}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1C2B4A', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 11, color: '#5A6475', lineHeight: 1.6 }}>{body}</div>
    </div>
  );
}
