export interface AppUser {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
}

export function getStoredUser(): AppUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getCurrentUserId(): string | null {
  const user = getStoredUser();
  return user?.id || null;
}

export function getStoredSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('refreshToken');
}
