import type {
  CompletedScheduleRecord,
  CompleteSchedulePayload,
  CreateRecordPayload,
  CreatePetPayload,
  CreateSchedulePayload,
  Pet,
  RecordItem,
  Schedule,
  UpdatePetPayload,
  User,
} from './domain';

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface SignupResponse {
  userId: string;
  email: string;
  emailVerificationRequired: boolean;
}

export interface MeResponse {
  user: User;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  verified: boolean;
  email: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  sent: boolean;
}

export type PetListResponse = Pet[];
export type CreatePetRequest = CreatePetPayload;
export type CreatePetResponse = Pet;
export type UpdatePetRequest = UpdatePetPayload;
export type UpdatePetResponse = Pet;

export type ScheduleListResponse = Schedule[];
export type CreateScheduleRequest = CreateSchedulePayload;
export type CreateScheduleResponse = Schedule;
export type CompleteScheduleRequest = CompleteSchedulePayload;
export interface CompleteScheduleResponse {
  schedule: Schedule;
  record: CompletedScheduleRecord | null;
  nextSchedule: Schedule | null;
}

export type RecordListResponse = RecordItem[];
export type CreateRecordRequest = CreateRecordPayload;
export type CreateRecordResponse = RecordItem;

export interface RegisterNotificationTokenRequest {
  deviceType: 'ios' | 'android';
  pushToken: string;
}

export interface RegisterNotificationTokenResponse {
  tokenId: string;
  deviceType: string;
  pushToken: string;
}

export interface DeleteNotificationTokenResponse {
  deleted: boolean;
  tokenId: string;
}

export interface HomeResponse {
  selectedPet: Pet | null;
  pets: Pet[];
  todaySchedules: Schedule[];
  overdueSchedules: Schedule[];
  recentRecords: RecordItem[];
}
