const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || 'http://localhost:8080/api';
let accessTokenProvider: (() => string | null) | null = null;

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string>;
  };
}

export interface ApiEnvelope<T> {
  data: T;
}

export class ApiError extends Error {
  code: string;
  fieldErrors?: Record<string, string>;

  constructor(payload: ApiErrorPayload) {
    super(payload.error.message);
    this.code = payload.error.code;
    this.fieldErrors = payload.error.fieldErrors;
  }
}

export function setAccessTokenProvider(provider: (() => string | null) | null) {
  accessTokenProvider = provider;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = accessTokenProvider?.() ?? null;
  const customHeaders = new Headers(init?.headers ?? undefined);
  const headers = new Headers();

  if (!customHeaders.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken && !customHeaders.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  customHeaders.forEach((value: string, key: string) => {
    headers.set(key, value);
  });

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
    if (payload?.error) {
      throw new ApiError(payload);
    }
    throw new Error(`API request failed: ${response.status}`);
  }

  const envelope = (await response.json()) as ApiEnvelope<T>;
  return envelope.data;
}
