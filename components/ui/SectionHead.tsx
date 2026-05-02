'use client';

import React from 'react';

interface SectionHeadProps {
  title: string;
  link?: string;
  onLink?: () => void;
}

export default function SectionHead({ title, link, onLink }: SectionHeadProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#1C2B4A' }}>{title}</span>
      {link && (
        <span
          style={{ fontSize: 12, fontWeight: 600, color: '#C8374A', cursor: 'pointer' }}
          onClick={onLink}
        >
          {link}
        </span>
      )}
    </div>
  );
}
