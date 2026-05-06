'use client';

import React, { useState, useEffect, useRef } from 'react';
import HeroBand from '@/components/HeroBand';
import { Btn, Badge, SectionHead } from '@/components/ui';
import { apiFetch } from '@/lib/api';
import { getGroupId } from '@/lib/group';

interface PolicyFile {
  policyId: number;
  policyName: string;
  createdAt: string;
}

interface UploadScreenProps {
  onNext?: () => void;
}

export default function UploadScreen({ onNext }: UploadScreenProps) {
  const [policies, setPolicies] = useState<PolicyFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPolicies();
  }, []);

  async function loadPolicies() {
    try {
      const res = await apiFetch('/api/policies');
      if (res.ok) {
        const data: PolicyFile[] = await res.json();
        setPolicies(data);
      }
    } catch {
      // 목록 로드 실패 시 빈 상태 유지
    }
  }

  async function uploadFile(file: File) {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('policyName', file.name.replace(/\.[^.]+$/, ''));
      const groupId = getGroupId();
      if (groupId) formData.append('groupId', String(groupId));

      const res = await apiFetch('/api/policies/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        await loadPolicies();
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? '업로드에 실패했습니다.');
      }
    } catch {
      setError('서버에 연결할 수 없습니다.');
    } finally {
      setUploading(false);
    }
  }

  async function deletePolicy(policyId: number) {
    try {
      const res = await apiFetch(`/api/policies/${policyId}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        setPolicies(prev => prev.filter(p => p.policyId !== policyId));
      }
    } catch {
      // 삭제 실패 시 무시
    }
  }

  function formatDate(dateStr: string) {
    return dateStr.slice(0, 10);
  }

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <HeroBand
        tag="규정 관리"
        title="규정책을 업로드하세요"
        desc="지출 관련 내부 규정 문서를 업로드하면 RAG 기반으로 검색에 활용됩니다."
        actions={onNext ? <>
          <Btn variant="outline">건너뛰기</Btn>
          <Btn variant="navy" onClick={onNext}>다음 단계 →</Btn>
        </> : undefined}
      />
      <div style={{ padding: '28px 40px' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = '';
          }}
        />

        {/* Upload zone */}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file && !uploading) uploadFile(file);
          }}
          style={{
            border: `1.5px dashed ${dragging ? '#1C2B4A' : '#B8C2D0'}`,
            borderRadius: 12, padding: '40px 24px',
            textAlign: 'center',
            background: dragging ? '#EAF0F8' : '#F4F6FA',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            marginBottom: 24,
          }}
        >
          <div style={{
            width: 52, height: 52, background: 'white',
            borderRadius: 10, border: '1px solid #E2E7EF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={dragging ? '#1C2B4A' : '#8A96A8'} strokeWidth="1.5">
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" />
            </svg>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1C2B4A', marginBottom: 4 }}>
            {uploading ? '업로드 중...' : dragging ? '파일을 놓아주세요' : '파일을 드래그하거나 클릭하세요'}
          </div>
          <div style={{ fontSize: 11, color: '#8A96A8' }}>PDF, DOCX 지원 · 최대 10MB</div>
        </div>

        {error && (
          <div style={{
            fontSize: 12, color: '#C8374A',
            background: '#FDECEA', border: '1px solid #F5C6C6',
            borderRadius: 6, padding: '8px 12px', marginBottom: 16,
          }}>{error}</div>
        )}

        {/* File list */}
        {policies.length > 0 && (
          <div>
            <SectionHead title="업로드된 규정" />
            {policies.map(p => (
              <div key={p.policyId} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'white', border: '1px solid #E2E7EF',
                borderRadius: 8, padding: '12px 16px', marginBottom: 8,
              }}>
                <div style={{
                  width: 36, height: 36, background: '#EAF0F8',
                  borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1C2B4A' }}>{p.policyName}</div>
                  <div style={{ fontSize: 11, color: '#8A96A8' }}>{formatDate(p.createdAt)}</div>
                </div>
                <Badge variant="ok">업로드 완료</Badge>
                <span
                  style={{ fontSize: 18, color: '#B8C2D0', cursor: 'pointer', lineHeight: 1 }}
                  onClick={() => deletePolicy(p.policyId)}
                >×</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
