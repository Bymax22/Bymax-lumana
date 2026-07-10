function resolveApiBase() {
  let base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    if (typeof window !== 'undefined') return window.location.origin;
    return 'http://localhost:4000';
  }

  if (!/^https?:\/\//i.test(base)) {
    if (base.startsWith('/')) {
      if (typeof window !== 'undefined') return window.location.origin + base;
      return `https://${base.replace(/^\//, '')}`;
    }
    return `https://${base}`;
  }

  return base.replace(/\/$/, '');
}

const API_BASE_URL = resolveApiBase();

export async function adminApi(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

export async function adminApiFormData(
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.statusText}`);
  }

  return response.json();
}
