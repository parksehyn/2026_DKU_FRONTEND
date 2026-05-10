import { getToken, removeToken } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/register'];

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // 401만 즉시 로그아웃 처리. 403은 caller가 판단(권한 부족일 수도, 백엔드 변동일 수도).
  if (res.status === 401 && !PUBLIC_PATHS.some(p => path.startsWith(p)) && typeof window !== 'undefined') {
    removeToken();
    const next = window.location.pathname + window.location.search;
    window.location.replace(`/login?next=${encodeURIComponent(next)}`);
  }
  return res;
}
