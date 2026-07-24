const DEFAULT_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || 20000);

function resolveApiBase() {
  const configuredBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (configuredBase) {
    return configuredBase.replace(/\/+$/, '');
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4000';
  }

  return '';
}

const API_BASE_URL = resolveApiBase();

function buildApiUrl(endpoint: string) {
  const normalizedEndpoint = endpoint.replace(/^\/*/, '');
  if (!API_BASE_URL) {
    return normalizedEndpoint ? `/${normalizedEndpoint}` : '/';
  }

  return new URL(normalizedEndpoint, `${API_BASE_URL}/`).toString();
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: 'no-store',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function publicApi<T = any>(endpoint: string, options: RequestInit = {}) {
  const url = buildApiUrl(endpoint);

  try {
    const response = await fetchWithTimeout(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API request failed: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API request timed out');
    }

    throw error;
  }
}
