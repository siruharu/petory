import { apiRequest } from '../../services/api/client';
import type {
  DeleteNotificationTokenResponse,
  RegisterNotificationTokenRequest,
  RegisterNotificationTokenResponse,
} from '../../types/api';

export function registerNotificationToken(payload: RegisterNotificationTokenRequest) {
  return apiRequest<RegisterNotificationTokenResponse>('/notifications/tokens', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteNotificationToken(tokenId: string) {
  return apiRequest<DeleteNotificationTokenResponse>(`/notifications/tokens/${encodeURIComponent(tokenId)}`, {
    method: 'DELETE',
  });
}
