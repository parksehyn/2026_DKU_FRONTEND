const ID_KEY = 'selectedGroupId';
const NAME_KEY = 'selectedGroupName';

export function getGroupId(): number | null {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(ID_KEY);
  return v ? Number(v) : null;
}

export function setGroupId(id: number): void {
  localStorage.setItem(ID_KEY, String(id));
}

export function clearGroupId(): void {
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(NAME_KEY);
}

export function getGroupName(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(NAME_KEY);
}

export function setGroupName(name: string): void {
  localStorage.setItem(NAME_KEY, name);
}
