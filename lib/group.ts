const KEY = 'selectedGroupId';

export function getGroupId(): number | null {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(KEY);
  return v ? Number(v) : null;
}

export function setGroupId(id: number): void {
  localStorage.setItem(KEY, String(id));
}

export function clearGroupId(): void {
  localStorage.removeItem(KEY);
}
