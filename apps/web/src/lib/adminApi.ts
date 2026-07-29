import { buildApiUrl } from './publicApi';

const DEFAULT_TIMEOUT_MS = 5000;

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    } else {
      headers.delete('Content-Type');
    }

    return await fetch(url, {
      cache: 'no-store',
      ...options,
      headers,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function adminApi(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = buildApiUrl(endpoint);

  try {
    const response = await fetchWithTimeout(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API request timed out');
    }

    throw error;
  }
}

export async function adminApiFormData(
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
) {
  const url = buildApiUrl(endpoint);

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API request timed out');
    }

    throw error;
  }
}
