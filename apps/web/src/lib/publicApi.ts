const DEFAULT_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || 20000);

export function resolveApiBase() {
  const configuredBase = [process.env.NEXT_PUBLIC_API_BASE_URL, process.env.NEXT_PUBLIC_API_URL]
    .map((value) => value?.trim())
    .find((value) => Boolean(value));

  if (configuredBase) {
    return configuredBase.replace(/\/+$/, '');
  }

  return '/api';
}

const API_BASE_URL = resolveApiBase();

export function buildApiUrl(endpoint: string, apiBaseUrl = API_BASE_URL) {
  const normalizedEndpoint = endpoint.replace(/^\/*/, '');
  const normalizedBase = apiBaseUrl?.trim().replace(/\/+$/, '');

  if (!normalizedBase) {
    return normalizedEndpoint ? `/${normalizedEndpoint}` : '/';
  }

  if (normalizedBase.startsWith('http://') || normalizedBase.startsWith('https://')) {
    return normalizedEndpoint ? new URL(normalizedEndpoint, `${normalizedBase}/`).toString() : normalizedBase;
  }

  return normalizedEndpoint ? `${normalizedBase}/${normalizedEndpoint}` : normalizedBase;
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

export async function publicApi<T = any>(endpoint: string, options: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const url = buildApiUrl(endpoint);

  try {
    const response = await fetchWithTimeout(url, options, timeoutMs);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API request failed: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to reach the API service. Please verify the API URL and network connection.');
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API request timed out');
    }

    throw error;
  }
}
