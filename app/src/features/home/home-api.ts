import { apiRequest } from '../../services/api/client';
import type { HomeResponse } from '../../types/api';

interface FetchHomeOptions {
  petId?: string;
}

export function fetchHome(options: FetchHomeOptions = {}) {
  const query = options.petId
    ? `?petId=${encodeURIComponent(options.petId)}`
    : '';

  return apiRequest<HomeResponse>(`/dashboard/home${query}`);
}
