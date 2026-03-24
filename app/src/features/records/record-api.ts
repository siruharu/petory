import { apiRequest } from '../../services/api/client';
import type { CreateRecordRequest, CreateRecordResponse, RecordListResponse } from '../../types/api';

export function fetchRecords(petId?: string, type?: string, page?: number) {
  const params = new URLSearchParams();

  if (petId) {
    params.set('petId', petId);
  }
  if (type) {
    params.set('type', type);
  }
  if (typeof page === 'number') {
    params.set('page', String(page));
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<RecordListResponse>(`/records${query}`);
}

export function createRecord(payload: CreateRecordRequest) {
  return apiRequest<CreateRecordResponse>('/records', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
