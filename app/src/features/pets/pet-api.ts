import { apiRequest } from '../../services/api/client';
import type { CreatePetRequest, CreatePetResponse, PetListResponse, UpdatePetRequest, UpdatePetResponse } from '../../types/api';

export function fetchPets() {
  return apiRequest<PetListResponse>('/pets');
}

export function createPet(payload: CreatePetRequest) {
  return apiRequest<CreatePetResponse>('/pets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updatePet(petId: string, payload: UpdatePetRequest) {
  return apiRequest<UpdatePetResponse>(`/pets/${petId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
