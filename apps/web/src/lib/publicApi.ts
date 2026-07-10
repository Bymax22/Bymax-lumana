function resolveApiBase() {
  let base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    if (typeof window !== 'undefined') return window.location.origin;
    return 'http://localhost:4000';
  }

  // If user supplied a protocol-relative or bare hostname, normalize it.
  // e.g. "bymax-lumana-api.vercel.app" -> "https://bymax-lumana-api.vercel.app"
  if (!/^https?:\/\//i.test(base)) {
    if (base.startsWith('/')) {
      // absolute path on the same origin
      if (typeof window !== 'undefined') return window.location.origin + base;
      // fallback to https
      return `https://${base.replace(/^\//, '')}`;
    }
    return `https://${base}`;
  }

  return base.replace(/\/$/, '');
}

const API_BASE_URL = resolveApiBase();

export async function publicApi<T = any>(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
