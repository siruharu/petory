# Petory API Contract

작성일: 2026-03-23  
기준 문서: `docs/plan.md`, `docs/scope.md`  
목적: React Native 모바일 앱과 Kotlin Spring Boot 백엔드가 공통으로 따를 MVP API 계약을 정의한다.

## 1. 원칙

- 모든 API는 `/api` prefix를 사용한다.
- 인증 이후 API는 사용자별 데이터를 격리한다.
- 성공 응답은 공통 래퍼를 사용한다.
- 실패 응답은 공통 에러 구조를 사용한다.
- 반려동물 여러 마리 지원을 전제로 한다.
- 병원 기록은 구조화 엔티티가 아니라 자유 메모형 기록으로 처리한다.

## 2. 공통 규칙

### 2.1 Content-Type

- 요청: `application/json`
- 응답: `application/json`

### 2.2 인증

- MVP에서는 `Authorization: Bearer <accessToken>` 헤더를 사용한다.
- 비인증 공개 API:
  - `POST /api/auth/signup`
  - `POST /api/auth/verify-email`
  - `POST /api/auth/resend-verification`
  - `POST /api/auth/login`
- `GET /api/auth/me`는 인증이 필요하다.

### 2.3 성공 응답 형식

```json
{
  "data": {}
}
```

배열 응답 예시:

```json
{
  "data": []
}
```

### 2.4 에러 응답 형식

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body is invalid",
    "fieldErrors": {
      "email": "Invalid email format"
    }
  }
}
```

### 2.5 공통 에러 코드

- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `CONFLICT`
- `INTERNAL_SERVER_ERROR`

## 3. 도메인 타입

### 3.1 Pet

```json
{
  "id": "pet_123",
  "name": "Milo",
  "species": "cat",
  "breed": "Korean Shorthair",
  "sex": "male",
  "neuteredStatus": "yes",
  "birthDate": "2023-05-01",
  "ageText": null,
  "weight": 4.8,
  "note": "알러지 주의",
  "photoUrl": null
}
```

### 3.2 Schedule

```json
{
  "id": "sch_123",
  "petId": "pet_123",
  "type": "prevention",
  "title": "심장사상충 예방약",
  "note": "식후 투여",
  "dueAt": "2026-03-25T09:00:00Z",
  "recurrenceType": "monthly",
  "status": "scheduled",
  "completedAt": null
}
```

허용 값:

- `type`: `vaccination`, `prevention`, `medication`, `vet_visit`, `custom`
- `recurrenceType`: `none`, `daily`, `weekly`, `monthly`
- `status`: `scheduled`, `completed`, `overdue`

### 3.3 Record

```json
{
  "id": "rec_123",
  "petId": "pet_123",
  "type": "vet_visit_memo",
  "title": "병원 방문 메모",
  "note": "피부 진료, 약 3일 처방",
  "occurredAt": "2026-03-23T14:00:00Z",
  "value": null,
  "unit": null,
  "sourceScheduleId": null
}
```

허용 값:

- `type`: `vaccination`, `medication`, `weight`, `memo`, `vet_visit_memo`

## 4. Auth API

### 4.1 회원가입

`POST /api/auth/signup`

Request:

```json
{
  "email": "user@example.com",
  "password": "password1234"
}
```

Response:

```json
{
  "data": {
    "userId": "usr_123",
    "email": "user@example.com",
    "emailVerificationRequired": true
  }
}
```

설명:

- 회원가입 직후 access token은 발급하지 않는다.
- 이메일 인증이 완료돼야 로그인할 수 있다.

### 4.2 이메일 인증

`POST /api/auth/verify-email`

Request:

```json
{
  "token": "email_verification_token"
}
```

Response:

```json
{
  "data": {
    "verified": true,
    "email": "user@example.com"
  }
}
```

### 4.3 인증 메일 재발송

`POST /api/auth/resend-verification`

Request:

```json
{
  "email": "user@example.com"
}
```

Response:

```json
{
  "data": {
    "sent": true
  }
}
```

### 4.4 로그인

`POST /api/auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "password1234"
}
```

Response:

```json
{
  "data": {
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "emailVerified": true
    },
    "accessToken": "jwt_token_here"
  }
}
```

### 4.5 현재 사용자 조회

`GET /api/auth/me`

Response:

```json
{
  "data": {
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "emailVerified": true
    }
  }
}
```

### 4.6 auth 에러 예시

이메일 중복:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email already exists"
  }
}
```

이메일 인증 미완료:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email verification is required"
  }
}
```

잘못된 로그인 정보:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid credentials"
  }
}
```

인증 없는 `/auth/me` 호출:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication is required"
  }
}
```

## 5. Pet API

### 5.1 반려동물 목록 조회

`GET /api/pets`

Response:

```json
{
  "data": [
    {
      "id": "pet_123",
      "name": "Milo",
      "species": "cat",
      "breed": "Korean Shorthair",
      "sex": "male",
      "neuteredStatus": "yes",
      "birthDate": "2023-05-01",
      "ageText": null,
      "weight": 4.8,
      "note": "알러지 주의",
      "photoUrl": null
    }
  ]
}
```

### 5.2 반려동물 생성

`POST /api/pets`

Request:

```json
{
  "name": "Milo",
  "species": "cat",
  "breed": "Korean Shorthair",
  "sex": "male",
  "neuteredStatus": "yes",
  "birthDate": "2023-05-01",
  "ageText": null,
  "weight": 4.8,
  "note": "알러지 주의"
}
```

Response:

```json
{
  "data": {
    "id": "pet_123",
    "name": "Milo",
    "species": "cat",
    "breed": "Korean Shorthair",
    "sex": "male",
    "neuteredStatus": "yes",
    "birthDate": "2023-05-01",
    "ageText": null,
    "weight": 4.8,
    "note": "알러지 주의",
    "photoUrl": null
  }
}
```

### 5.3 반려동물 수정

`PATCH /api/pets/:petId`

Request:

```json
{
  "name": "Milo",
  "weight": 5.0,
  "note": "사료 변경 중"
}
```

Response:

```json
{
  "data": {
    "id": "pet_123",
    "name": "Milo",
    "species": "cat",
    "breed": "Korean Shorthair",
    "sex": "male",
    "neuteredStatus": "yes",
    "birthDate": "2023-05-01",
    "ageText": null,
    "weight": 5.0,
    "note": "사료 변경 중",
    "photoUrl": null
  }
}
```

## 6. Schedule API

### 6.1 일정 목록 조회

`GET /api/schedules`

Query:

- `petId` optional
- `status` optional
- `from` optional
- `to` optional

예시:

- `/api/schedules?petId=pet_123`

Response:

```json
{
  "data": [
    {
      "id": "sch_123",
      "petId": "pet_123",
      "type": "prevention",
      "title": "심장사상충 예방약",
      "note": "식후 투여",
      "dueAt": "2026-03-25T09:00:00Z",
      "recurrenceType": "monthly",
      "status": "scheduled",
      "completedAt": null
    }
  ]
}
```

### 6.2 일정 생성

`POST /api/schedules`

Request:

```json
{
  "petId": "pet_123",
  "type": "medication",
  "title": "항생제 복용",
  "note": "저녁 식후",
  "dueAt": "2026-03-24T19:00:00Z",
  "recurrenceType": "daily"
}
```

Response:

```json
{
  "data": {
    "id": "sch_123",
    "petId": "pet_123",
    "type": "medication",
    "title": "항생제 복용",
    "note": "저녁 식후",
    "dueAt": "2026-03-24T19:00:00Z",
    "recurrenceType": "daily",
    "status": "scheduled",
    "completedAt": null
  }
}
```

### 6.3 일정 완료

`POST /api/schedules/:scheduleId/complete`

Request:

```json
{
  "completedAt": "2026-03-24T19:10:00Z",
  "createRecord": true
}
```

Response:

```json
{
  "data": {
    "schedule": {
      "id": "sch_123",
      "petId": "pet_123",
      "type": "medication",
      "title": "항생제 복용",
      "note": "저녁 식후",
      "dueAt": "2026-03-24T19:00:00Z",
      "recurrenceType": "daily",
      "status": "completed",
      "completedAt": "2026-03-24T19:10:00Z"
    },
    "record": {
      "id": "rec_123",
      "petId": "pet_123",
      "type": "medication",
      "title": "항생제 복용",
      "note": "저녁 식후",
      "occurredAt": "2026-03-24T19:10:00Z",
      "value": null,
      "unit": null,
      "sourceScheduleId": "sch_123"
    },
    "nextSchedule": {
      "id": "sch_124",
      "petId": "pet_123",
      "type": "medication",
      "title": "항생제 복용",
      "note": "저녁 식후",
      "dueAt": "2026-03-25T19:00:00Z",
      "recurrenceType": "daily",
      "status": "scheduled",
      "completedAt": null
    }
  }
}
```

비고:

- `createRecord = false`이면 `record`는 `null`일 수 있다.
- 반복 일정이 아니면 `nextSchedule`는 `null`일 수 있다.

## 7. Record API

### 7.1 기록 목록 조회

`GET /api/records`

Query:

- `petId` optional
- `type` optional
- `page` optional

예시:

- `/api/records?petId=pet_123&type=weight`

Response:

```json
{
  "data": [
    {
      "id": "rec_123",
      "petId": "pet_123",
      "type": "weight",
      "title": "체중 기록",
      "note": null,
      "occurredAt": "2026-03-23T08:00:00Z",
      "value": 4.8,
      "unit": "kg",
      "sourceScheduleId": null
    },
    {
      "id": "rec_124",
      "petId": "pet_123",
      "type": "vet_visit_memo",
      "title": "병원 방문 메모",
      "note": "피부 진료, 약 3일 처방",
      "occurredAt": "2026-03-23T14:00:00Z",
      "value": null,
      "unit": null,
      "sourceScheduleId": null
    }
  ]
}
```

### 7.2 기록 생성

`POST /api/records`

Request:

```json
{
  "petId": "pet_123",
  "type": "vet_visit_memo",
  "title": "병원 방문 메모",
  "note": "피부 진료, 약 3일 처방",
  "occurredAt": "2026-03-23T14:00:00Z",
  "value": null,
  "unit": null
}
```

Response:

```json
{
  "data": {
    "id": "rec_124",
    "petId": "pet_123",
    "type": "vet_visit_memo",
    "title": "병원 방문 메모",
    "note": "피부 진료, 약 3일 처방",
    "occurredAt": "2026-03-23T14:00:00Z",
    "value": null,
    "unit": null,
    "sourceScheduleId": null
  }
}
```

## 8. Dashboard API

### 8.1 홈 집계 조회

`GET /api/dashboard/home`

Query:

- `petId` optional

응답 규칙:

- `petId`가 있으면 해당 반려동물 기준으로 집계한다.
- `petId`가 없으면 현재 선택 반려동물 기준 또는 전체 반려동물 기준으로 집계한다.
- `pets`는 사용자 소유 반려동물 목록 전체를 항상 포함한다.

Response:

```json
{
  "data": {
    "selectedPet": {
      "id": "pet_123",
      "name": "Milo",
      "species": "cat",
      "breed": "Korean Shorthair",
      "sex": "male",
      "neuteredStatus": "yes",
      "birthDate": "2023-05-01",
      "ageText": null,
      "weight": 4.8,
      "note": "알러지 주의",
      "photoUrl": null
    },
    "pets": [
      {
        "id": "pet_123",
        "name": "Milo",
        "species": "cat",
        "breed": "Korean Shorthair",
        "sex": "male",
        "neuteredStatus": "yes",
        "birthDate": "2023-05-01",
        "ageText": null,
        "weight": 4.8,
        "note": "알러지 주의",
        "photoUrl": null
      },
      {
        "id": "pet_456",
        "name": "Coco",
        "species": "dog",
        "breed": "Poodle",
        "sex": "female",
        "neuteredStatus": "no",
        "birthDate": null,
        "ageText": "2 years",
        "weight": 3.2,
        "note": null,
        "photoUrl": null
      }
    ],
    "todaySchedules": [
      {
        "id": "sch_123",
        "petId": "pet_123",
        "type": "prevention",
        "title": "심장사상충 예방약",
        "note": "식후 투여",
        "dueAt": "2026-03-23T20:00:00Z",
        "recurrenceType": "monthly",
        "status": "scheduled",
        "completedAt": null
      }
    ],
    "overdueSchedules": [
      {
        "id": "sch_999",
        "petId": "pet_123",
        "type": "vaccination",
        "title": "예방접종",
        "note": null,
        "dueAt": "2026-03-20T10:00:00Z",
        "recurrenceType": "none",
        "status": "overdue",
        "completedAt": null
      }
    ],
    "recentRecords": [
      {
        "id": "rec_123",
        "petId": "pet_123",
        "type": "weight",
        "title": "체중 기록",
        "note": null,
        "occurredAt": "2026-03-22T08:00:00Z",
        "value": 4.8,
        "unit": "kg",
        "sourceScheduleId": null
      }
    ]
  }
}
```

## 9. Notification API

### 9.1 푸시 토큰 등록

`POST /api/notifications/tokens`

Request:

```json
{
  "deviceType": "ios",
  "pushToken": "expo_push_token_or_fcm_token"
}
```

Response:

```json
{
  "data": {
    "tokenId": "ntf_123",
    "deviceType": "ios",
    "pushToken": "expo_push_token_or_fcm_token"
  }
}
```

### 9.2 푸시 토큰 삭제

`DELETE /api/notifications/tokens/:tokenId`

Response:

```json
{
  "data": {
    "deleted": true,
    "tokenId": "ntf_123"
  }
}
```

## 10. Validation 기준

### 10.1 Auth

- `email`은 유효한 이메일 형식이어야 한다.
- `password`는 최소 길이 제한을 둔다.

### 10.2 Pet

- `name`은 필수다.
- `species`는 `dog` 또는 `cat`만 허용한다.
- `birthDate`와 `ageText`는 둘 중 하나만 입력해도 된다.

### 10.3 Schedule

- `petId`, `type`, `title`, `dueAt`은 필수다.
- `recurrenceType`은 허용 값 내여야 한다.

### 10.4 Record

- `petId`, `type`, `title`, `occurredAt`은 필수다.
- `weight` 기록이면 `value`와 `unit`이 필요하다.
- 병원 기록은 `type = vet_visit_memo`를 권장한다.

## 11. 후속 작업 영향

이 문서 기준으로 다음 작업이 이어져야 한다.

- 백엔드 DTO 이름과 응답 필드명 정렬
- 모바일 `types/api.ts`, `types/domain.ts` 정렬
- 공통 에러 응답 구조 도입
- 홈 API와 알림 API 응답 구조 정렬
