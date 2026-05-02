'use client';

import React from 'react';

interface ToggleProps {
  on: boolean;
  onToggle: () => void;
}

export default function Toggle({ on, onToggle }: ToggleProps) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 38, height: 20,
        background: on ? '#1C2B4A' : '#B8C2D0',
        borderRadius: 100, position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: 16, height: 16, background: 'white',
        borderRadius: '50%', position: 'absolute',
        top: 2, left: on ? 20 : 2,
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </div>
  );
}
