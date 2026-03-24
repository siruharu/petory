import { apiRequest } from '../../services/api/client';
import type {
  CompleteScheduleRequest,
  CompleteScheduleResponse,
  CreateScheduleRequest,
  CreateScheduleResponse,
  ScheduleListResponse,
} from '../../types/api';

export function fetchSchedules(petId?: string) {
  const query = petId ? `?petId=${encodeURIComponent(petId)}` : '';
  return apiRequest<ScheduleListResponse>(`/schedules${query}`);
}

export function createSchedule(payload: CreateScheduleRequest) {
  return apiRequest<CreateScheduleResponse>('/schedules', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function completeSchedule(scheduleId: string, payload: CompleteScheduleRequest) {
  return apiRequest<CompleteScheduleResponse>(`/schedules/${scheduleId}/complete`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
