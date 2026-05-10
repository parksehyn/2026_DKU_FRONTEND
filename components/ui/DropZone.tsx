'use client';

import React, { useRef, useState } from 'react';

interface DropZoneProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
  /** 드롭존 안에 들어갈 커스텀 컨텐츠. 없으면 기본 아이콘+안내문 사용 */
  children?: React.ReactNode;
  /** 기본 컨텐츠일 때 보여줄 텍스트 */
  title?: string;
  hint?: string;
  /** 진행 중 표시 텍스트 (이때 클릭 비활성화) */
  busyText?: string;
  height?: number | string;
  style?: React.CSSProperties;
}

export default function DropZone({
  accept,
  multiple = false,
  disabled = false,
  onFiles,
  children,
  title = '파일을 드래그하거나 클릭하여 업로드',
  hint,
  busyText,
  height,
  style,
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = !!busyText;
  const inactive = disabled || busy;

  const pickFiles = (fileList: FileList | null) => {
    if (!fileList || inactive) return;
    const arr = Array.from(fileList);
    if (arr.length) onFiles(arr);
  };

  return (
    <div
      onClick={() => !inactive && inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); if (!inactive) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => {
        e.preventDefault();
        setDragging(false);
        pickFiles(e.dataTransfer.files);
      }}
      style={{
        border: dragging ? 'var(--border-dashed-hover)' : 'var(--border-dashed)',
        borderRadius: 'var(--r-card)',
        padding: '36px 24px',
        textAlign: 'center',
        background: dragging ? 'var(--blue-pale)' : 'var(--gray1)',
        cursor: inactive ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        height,
        ...style,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={e => {
          pickFiles(e.target.files);
          e.target.value = '';
        }}
      />
      {children ?? (
        <>
          <div style={{
            width: 52, height: 52, background: 'white',
            borderRadius: 10, border: 'var(--border-default)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke={dragging ? 'var(--navy)' : 'var(--gray4)'} strokeWidth="1.5">
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>
            {busy ? busyText : dragging ? '파일을 놓아주세요' : title}
          </div>
          {hint && <div style={{ fontSize: 11, color: 'var(--gray4)' }}>{hint}</div>}
        </>
      )}
    </div>
  );
}
