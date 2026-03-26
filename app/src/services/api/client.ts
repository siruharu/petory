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

export function getApiBaseUrl() {
  return API_BASE_URL;
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

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
  } catch (error) {
    const baseUrl = API_BASE_URL;
    const isLocalhostTarget =
      baseUrl.includes('://localhost') || baseUrl.includes('://127.0.0.1');
    const guidance = isLocalhostTarget
      ? '안드로이드 실기기에서는 localhost 대신 개발 머신의 LAN IP를 EXPO_PUBLIC_API_BASE_URL로 설정해 주세요.'
      : 'API 서버 주소와 같은 Wi-Fi/LAN 연결 상태를 확인해 주세요.';
    const originalMessage = error instanceof Error ? error.message : 'Network request failed';

    throw new Error(`API 서버에 연결하지 못했어요. ${guidance} 현재 API_BASE_URL: ${baseUrl}. ${originalMessage}`);
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
    if (payload?.error) {
      throw new ApiError(payload);
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('인증이 만료되었거나 로그인 정보가 올바르지 않아요. 다시 로그인해 주세요.');
    }
    throw new Error(`API request failed: ${response.status}`);
  }

  const envelope = (await response.json()) as ApiEnvelope<T>;
  return envelope.data;
}
