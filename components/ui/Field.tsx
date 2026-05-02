'use client';

import React from 'react';

interface FieldProps {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}

export default function Field({ label, required, children, error }: FieldProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={{
          fontSize: 11, fontWeight: 700, color: '#5A6475',
          marginBottom: 5, display: 'block', letterSpacing: '0.1px',
        }}>
          {label}
          {required && <span style={{ color: '#C8374A', marginLeft: 2 }}>*</span>}
        </label>
      )}
      {children}
      {error && <div style={{ fontSize: 11, color: '#C8374A', marginTop: 4 }}>{error}</div>}
    </div>
  );
}
