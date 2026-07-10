function resolveApiBase() {
  let base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    if (typeof window !== 'undefined') return window.location.origin;
    return 'http://localhost:4000';
  }

  if (!/^https?:\/\//i.test(base)) {
    if (base.startsWith('/')) {
      if (typeof window !== 'undefined') return window.location.origin + base;
      return `https://${base.replace(/^\/*/, '')}`;
    }
    return `https://${base.replace(/^\/*/, '')}`;
  }

  return base.replace(/\/*$/, '');
}

const API_BASE_URL = resolveApiBase();

function buildApiUrl(endpoint: string) {
  return new URL(endpoint.replace(/^\/*/, ''), `${API_BASE_URL}/`).toString();
}

export async function publicApi<T = any>(endpoint: string, options: RequestInit = {}) {
  const url = buildApiUrl(endpoint);
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
