export type Species = 'dog' | 'cat';
export type PetSex = 'male' | 'female' | 'unknown';
export type NeuteredStatus = 'neutered' | 'not_neutered' | 'unknown';
export type ScheduleType =
  | 'vaccination'
  | 'prevention'
  | 'medication'
  | 'vet_visit'
  | 'custom';
export type ScheduleStatus = 'scheduled' | 'completed' | 'overdue';
export type RecordType = 'vaccination' | 'medication' | 'weight' | 'memo' | 'vet_visit_memo';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed?: string;
  sex?: PetSex;
  neuteredStatus?: NeuteredStatus;
  birthDate?: string;
  ageText?: string;
  weight?: number;
  note?: string;
  photoUrl?: string;
}

export interface CreatePetPayload {
  name: string;
  species: Species;
  breed?: string;
  sex?: PetSex;
  neuteredStatus?: NeuteredStatus;
  birthDate?: string | null;
  ageText?: string | null;
  weight?: number | null;
  note?: string | null;
  photoUrl?: string | null;
}

export interface UpdatePetPayload {
  name?: string;
  species?: Species;
  breed?: string | null;
  sex?: PetSex | null;
  neuteredStatus?: NeuteredStatus | null;
  birthDate?: string | null;
  ageText?: string | null;
  weight?: number | null;
  note?: string | null;
  photoUrl?: string | null;
}

export interface Schedule {
  id: string;
  petId: string;
  type: ScheduleType;
  title: string;
  note?: string;
  dueAt: string;
  recurrenceType: RecurrenceType;
  status: ScheduleStatus;
  completedAt?: string;
}

export interface CreateSchedulePayload {
  petId: string;
  type: ScheduleType;
  title: string;
  note?: string | null;
  dueAt: string;
  recurrenceType?: RecurrenceType;
}

export interface CompleteSchedulePayload {
  completedAt?: string | null;
  createRecord: boolean;
}

export interface RecordItem {
  id: string;
  petId: string;
  type: RecordType;
  title: string;
  note?: string;
  occurredAt: string;
  value?: number;
  unit?: string;
  sourceScheduleId?: string;
}

export interface CreateRecordPayload {
  petId: string;
  type: RecordType;
  title: string;
  note?: string | null;
  occurredAt: string;
  value?: number | null;
  unit?: string | null;
  sourceScheduleId?: string | null;
}

export interface CompletedScheduleRecord {
  id: string;
  petId: string;
  type: ScheduleType | RecordType;
  title: string;
  note?: string;
  occurredAt: string;
  value?: number;
  unit?: string;
  sourceScheduleId?: string;
}
