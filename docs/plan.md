# 반려동물 건강/생활 관리 앱 MVP 구현 계획

작성일: 2026-03-23  
기준 문서: `docs/research.md`, `docs/scope.md`  
목적: MVP 범위를 기준으로 실제 구현에 착수할 수 있는 수준의 계획을 정리한다.  
중요: 이 문서는 구현 계획 문서다. 코드 작성은 포함하지 않는다.

## Notes
- 반려동물 여러 마리 지원은 MVP 에 포함한다.
- 병원 기록은 자유 메모 형태로만 처리한다.
- 프론트 스택은 React Native, 백엔드는 kotlin (spring boot)
- 현재 백엔드 서버 스택이 kotlin(spring boot) 이고 실행할 수 없는 상태로 구성되어있음 수정해야함.

## 0. 전제와 가정

현재 저장소 상태를 기준으로 확인된 점:

- `README.md` 외에 실제 앱 코드가 없다.
- 프론트 스택은 React Native, 백엔드는 Kotlin + Spring Boot를 사용한다.
- 현재 백엔드는 소스 디렉터리와 클래스 스켈레톤은 있으나, 실행 가능한 Spring Boot 프로젝트 기준으로는 아직 불완전하다.
- 즉, Gradle 설정, 실행 진입 구성, 의존성 구성, 최소 실행 검증이 가능한 상태로 먼저 정리되어야 한다.
- 따라서 이 문서는 “현재 코드베이스가 비어 있는 상태에서 MVP를 어떻게 구성할지”에 대한 초기 구현 계획이다.

명시적 가정:

- 앱 우선 MVP를 만든다.
- 첫 릴리즈는 개인 사용자 기준이지만, 한 사용자가 여러 반려동물을 등록하고 전환할 수 있어야 한다.
- 인증, 반려동물 등록, 일정, 알림, 기록이 중심이다.
- 2~4주 안에 구현 가능한 복잡도로 제한한다.
- 모바일 앱과 API 서버를 분리한 구조를 가정한다.
- 구현 착수 순서상, 기능 개발 전에 백엔드 실행 가능 베이스라인을 먼저 복구한다.

명시적 비포함:

- 협업
- 첨부파일
- OCR
- 웨어러블/GPS
- 외부 병원/보험/결제 연동

## 1. 접근 방식

### 1.1 제품 접근 방식

이번 MVP는 “할 일 관리”보다 “반려동물 기준의 일정+기록 허브”를 우선한다.

핵심 사용자 흐름은 다음 한 줄로 요약된다.

- 로그인 → 첫 반려동물 등록 → 추가 반려동물 등록 가능 → 반려동물별 일정 생성 → 알림 수신 → 완료 처리 → 기록 확인

구현 우선순위는 아래 순서가 적절하다.

1. 백엔드 실행 가능 베이스라인 복구
2. 인증과 사용자 세션
3. 반려동물 CRUD
4. 일정 CRUD와 완료 처리
5. 기록 CRUD
6. 홈 화면 집계
7. 알림 처리

이 순서를 택하는 이유:

- 현재 백엔드는 실행 불가 상태이므로, 나머지 기능 작업의 검증 기반이 먼저 필요하다.
- 일정과 기록은 반려동물 엔티티가 없으면 성립하지 않는다.
- 홈 화면은 일정/기록 데이터가 있어야 의미가 생긴다.
- 알림은 일정 모델이 먼저 안정되어야 구현 비용을 통제할 수 있다.
- 여러 반려동물 지원은 이후 확장이 아니라 초기 엔티티/화면 구조에 바로 반영해야 재작업이 적다.

### 1.2 개발 접근 방식

MVP에서는 기능을 세로 슬라이스로 쪼개는 것이 적절하다.

- Slice 0: 백엔드 실행 베이스라인
- Slice 1: 인증
- Slice 2: 반려동물 등록
- Slice 3: 일정 생성/목록/완료
- Slice 4: 기록 추가/목록
- Slice 5: 홈 집계
- Slice 6: 알림

이 방식의 장점:

- 화면, API, DB를 한 번에 닫으면서 진행 가능
- 각 단계마다 동작 가능한 데모를 만들 수 있음
- 2~4주 MVP에서 리스크를 빨리 드러낼 수 있음

## 2. 프론트/백엔드 구조

이 계획은 React Native 앱과 Kotlin Spring Boot API 서버를 전제로 한다.

### 2.1 프론트엔드 구조

역할:

- 사용자 인증 UI
- 반려동물 등록/수정 UI
- 일정 생성/조회/완료 UI
- 기록 생성/조회 UI
- 홈 화면 집계 표시
- 푸시 권한 요청 및 토큰 등록

권장 디렉터리 구조 예시:

```text
app/
  src/
    app/
      navigation/
      providers/
    screens/
      auth/
      pets/
      schedules/
      records/
      home/
      settings/
    components/
      common/
      forms/
      cards/
      lists/
    features/
      auth/
      pets/
      schedules/
      records/
      notifications/
    services/
      api/
      storage/
      notifications/
    hooks/
    types/
    utils/
```

프론트엔드 책임 분리 원칙:

- `screens/`: 화면 조합
- `features/`: 기능별 상태와 도메인 로직
- `components/`: 재사용 UI
- `services/api/`: 서버 통신
- `services/storage/`: 토큰, 선택된 반려동물 저장
- `services/notifications/`: 푸시 권한, 로컬 알림 브리지

### 2.2 백엔드 구조

역할:

- 인증
- 사용자별 데이터 격리
- 반려동물 CRUD
- 일정 CRUD
- 기록 CRUD
- 홈 집계 API
- 알림 스케줄링

권장 디렉터리 구조 예시:

```text
server/
  src/
    main/
      kotlin/
        com/petory/
          config/
          auth/
          pet/
          schedule/
          record/
          dashboard/
          notification/
          common/
      resources/
        db/migration/
    test/
```

백엔드 책임 분리 원칙:

- 실행 가능한 Spring Boot 프로젝트 구조를 먼저 만족해야 한다.
- `auth`: 회원가입, 로그인, 토큰 검증
- `pet`: 반려동물 CRUD
- `schedule`: 일정 생성/변경/완료/조회
- `record`: 기록 생성/조회
- `dashboard`: 홈 화면용 집계
- `notification`: 알림 예약과 발송 상태

백엔드 베이스라인에서 먼저 갖춰야 하는 항목:

- `settings.gradle.kts`
- `build.gradle.kts`
- Gradle wrapper 또는 동일 역할의 실행 기준
- Spring Boot 메인 애플리케이션 구동 기준
- 최소 프로필 또는 기본 `application.yml`
- 실행 가능한 패키지 구조 정렬

### 2.3 데이터 흐름

핵심 흐름 1: 일정 생성

1. 앱에서 일정 생성 폼 제출
2. 백엔드가 일정 저장
3. 일정 due 시각 기준 알림 이벤트 생성
4. 앱은 일정 목록과 홈 데이터를 다시 조회

핵심 흐름 2: 일정 완료

1. 앱에서 일정 완료 버튼 클릭
2. 백엔드가 일정 상태를 `completed`로 변경
3. 필요 시 일정 기반 기록을 자동 생성
4. 반복 일정이면 다음 일정 인스턴스를 생성
5. 홈 화면 집계가 갱신됨

핵심 흐름 3: 기록 직접 추가

1. 앱에서 기록 유형 선택
2. 기록 데이터 저장
3. 기록 목록과 홈 최근 기록이 갱신됨

## 3. 주요 엔티티

MVP에서는 엔티티를 과도하게 쪼개지 않는 편이 적절하다.

### 3.1 User

역할:

- 로그인 주체
- 데이터 소유자

필드 예시:

- id
- email
- password_hash
- created_at
- updated_at

### 3.2 Pet

역할:

- 일정과 기록의 기준 엔티티

필드 예시:

- id
- user_id
- name
- species
- breed
- sex
- neutered_status
- birth_date_optional
- age_text_optional
- weight_optional
- note_optional
- photo_url_optional
- created_at
- updated_at

### 3.3 Schedule

역할:

- 사용자가 해야 할 관리 일정

필드 예시:

- id
- user_id
- pet_id
- type
- title
- note_optional
- due_at
- recurrence_type
- status
- completed_at_optional
- created_at
- updated_at

`type` 후보:

- vaccination
- prevention
- medication
- vet_visit
- custom

`status` 후보:

- scheduled
- completed
- overdue

`recurrence_type` 후보:

- none
- daily
- weekly
- monthly

### 3.4 Record

역할:

- 실제로 실행한 건강/관리 기록

필드 예시:

- id
- user_id
- pet_id
- type
- title
- note_optional
- occurred_at
- value_optional
- unit_optional
- source_schedule_id_optional
- created_at
- updated_at

`type` 후보:

- vaccination
- medication
- weight
- memo

기록 단순화 원칙:

- 병원 기록은 별도 구조화 엔티티로 분리하지 않는다.
- 병원 방문 기록은 `type = memo` 또는 `type = vet_visit_memo` 같은 자유 메모 기반 기록으로만 처리한다.
- 병원명, 진료 내용, 처방 내용은 모두 `title`과 `note`에 저장한다.

### 3.5 NotificationToken

역할:

- 앱 푸시 토큰 저장

필드 예시:

- id
- user_id
- device_type
- push_token
- created_at
- updated_at

### 3.6 NotificationJob

역할:

- 일정 기반 알림 발송 예약 및 상태 추적

필드 예시:

- id
- user_id
- schedule_id
- send_at
- status
- sent_at_optional
- created_at

## 4. API 목록

아래는 MVP에 필요한 최소 API 목록이다.

### 4.1 Auth API

`POST /api/auth/signup`

- 입력: email, password
- 출력: user, access_token

`POST /api/auth/login`

- 입력: email, password
- 출력: user, access_token

`GET /api/auth/me`

- 출력: 현재 로그인 사용자

`POST /api/auth/logout`

- 출력: 성공 여부

### 4.2 Pet API

`GET /api/pets`

- 사용자 소유 반려동물 목록 조회

`POST /api/pets`

- 반려동물 생성

`GET /api/pets/:petId`

- 반려동물 상세 조회

`PATCH /api/pets/:petId`

- 반려동물 수정

다중 반려동물 처리 원칙:

- 한 사용자는 여러 `Pet`을 가질 수 있다.
- 홈, 일정, 기록 API는 `petId`를 선택적으로 받아 특정 반려동물 기준 조회를 지원한다.
- `petId`가 없으면 전체 반려동물 기준으로 집계하거나 기본 선택 반려동물 기준으로 응답한다.

### 4.3 Schedule API

`GET /api/schedules`

- 쿼리: petId, status, from, to
- 용도: 일정 목록/홈 화면 조회

`POST /api/schedules`

- 일정 생성

`GET /api/schedules/:scheduleId`

- 일정 상세 조회

`PATCH /api/schedules/:scheduleId`

- 일정 수정

`POST /api/schedules/:scheduleId/complete`

- 일정 완료 처리
- 반복 일정이면 다음 일정 생성 가능
- 필요 시 기록 자동 생성

### 4.4 Record API

`GET /api/records`

- 쿼리: petId, type, page

`POST /api/records`

- 기록 생성

`GET /api/records/:recordId`

- 기록 상세 조회

`PATCH /api/records/:recordId`

- 기록 수정

### 4.5 Dashboard API

`GET /api/dashboard/home`

- 쿼리: petId_optional
- 출력:
  - selected pet summary
  - today schedules
  - overdue schedules
  - recent records

### 4.6 Notification API

`POST /api/notifications/tokens`

- 앱 푸시 토큰 등록

`DELETE /api/notifications/tokens/:tokenId`

- 로그아웃/디바이스 제거 시 토큰 삭제

## 5. 화면 목록

MVP에서 필요한 최소 화면은 아래와 같다.

### 5.1 인증

- 로그인 화면
- 회원가입 화면

핵심 요소:

- 이메일 입력
- 비밀번호 입력
- 로그인/회원가입 CTA

### 5.2 온보딩

- 첫 반려동물 등록 화면

핵심 요소:

- 이름
- 종
- 품종
- 성별
- 중성화 여부
- 나이 또는 생년월일
- 몸무게
- 메모

### 5.3 홈

- 오늘 일정 섹션
- overdue 일정 섹션
- 최근 기록 섹션
- 현재 선택된 반려동물 표시
- 반려동물 전환 UI
- 일정 추가 CTA
- 기록 추가 CTA

### 5.4 반려동물

- 반려동물 목록 화면
- 반려동물 추가 화면
- 반려동물 상세/수정 화면

### 5.5 일정

- 일정 목록 화면
- 일정 상세 화면
- 일정 생성/수정 화면

핵심 UX:

- 일정 유형 선택
- 날짜 선택
- 반복 규칙 선택
- 완료 버튼

### 5.6 기록

- 기록 목록 화면
- 기록 생성/수정 화면

핵심 UX:

- 기록 유형 선택
- 날짜 입력
- 메모 입력
- 체중 기록 시 값 입력

병원 기록 처리 방식:

- 병원 기록 전용 복잡한 입력 폼은 만들지 않는다.
- 기록 생성 화면에서 “병원 방문 메모” 유형을 선택하고 자유 메모를 남기는 방식으로 처리한다.

### 5.7 설정

- 로그아웃
- 알림 권한 상태 확인 정도의 최소 설정

## 6. 파일 경로 예시

현재 저장소에는 구현 파일이 없으므로 아래는 생성 대상 예시 경로다.

### 6.1 프론트엔드 파일 예시

```text
app/src/app/navigation/root-navigator.tsx
app/src/app/providers/auth-provider.tsx
app/src/screens/auth/login-screen.tsx
app/src/screens/auth/signup-screen.tsx
app/src/screens/home/home-screen.tsx
app/src/screens/pets/pet-form-screen.tsx
app/src/screens/pets/pet-list-screen.tsx
app/src/screens/pets/pet-switcher-sheet.tsx
app/src/screens/schedules/schedule-list-screen.tsx
app/src/screens/schedules/schedule-form-screen.tsx
app/src/screens/records/record-list-screen.tsx
app/src/screens/records/record-form-screen.tsx
app/src/features/auth/use-auth.ts
app/src/features/pets/pet-api.ts
app/src/features/schedules/schedule-api.ts
app/src/features/records/record-api.ts
app/src/features/notifications/push-service.ts
app/src/components/cards/schedule-card.tsx
app/src/components/cards/record-card.tsx
app/src/components/forms/pet-form.tsx
app/src/components/forms/schedule-form.tsx
app/src/components/forms/record-form.tsx
app/src/types/api.ts
app/src/types/domain.ts
```

### 6.2 백엔드 파일 예시

```text
server/src/main/kotlin/com/petory/PetoryApplication.kt
server/src/main/kotlin/com/petory/config/SecurityConfig.kt
server/src/main/kotlin/com/petory/auth/AuthController.kt
server/src/main/kotlin/com/petory/auth/AuthService.kt
server/src/main/kotlin/com/petory/auth/JwtTokenProvider.kt
server/src/main/kotlin/com/petory/pet/PetController.kt
server/src/main/kotlin/com/petory/pet/PetService.kt
server/src/main/kotlin/com/petory/pet/PetEntity.kt
server/src/main/kotlin/com/petory/schedule/ScheduleController.kt
server/src/main/kotlin/com/petory/schedule/ScheduleService.kt
server/src/main/kotlin/com/petory/schedule/ScheduleEntity.kt
server/src/main/kotlin/com/petory/record/RecordController.kt
server/src/main/kotlin/com/petory/record/RecordService.kt
server/src/main/kotlin/com/petory/record/RecordEntity.kt
server/src/main/kotlin/com/petory/dashboard/DashboardController.kt
server/src/main/kotlin/com/petory/dashboard/DashboardService.kt
server/src/main/kotlin/com/petory/notification/NotificationService.kt
server/src/main/kotlin/com/petory/common/AuthUserArgumentResolver.kt
server/src/main/resources/db/migration/V001__create_users.sql
server/src/main/resources/db/migration/V002__create_pets.sql
server/src/main/resources/db/migration/V003__create_schedules.sql
server/src/main/resources/db/migration/V004__create_records.sql
server/src/main/resources/db/migration/V005__create_notification_tokens.sql
server/src/main/resources/db/migration/V006__create_notification_jobs.sql
```

## 7. 코드 스니펫

아래 스니펫은 구현 방향을 구체화하기 위한 예시다. 실제 코드 작성은 아니다.

### 7.1 React Native 도메인 타입 예시

```ts
export type ScheduleType =
  | 'vaccination'
  | 'prevention'
  | 'medication'
  | 'vet_visit'
  | 'custom';

export type ScheduleStatus = 'scheduled' | 'completed' | 'overdue';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Schedule {
  id: string;
  userId: string;
  petId: string;
  type: ScheduleType;
  title: string;
  note?: string;
  dueAt: string;
  recurrenceType: RecurrenceType;
  status: ScheduleStatus;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 7.2 Kotlin Spring Boot 엔티티 예시

```kotlin
@Entity
@Table(name = "pets")
class PetEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val userId: UUID,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var species: String,

    var breed: String? = null,
    var sex: String? = null,
    var neuteredStatus: String? = null,
    var birthDate: LocalDate? = null,
    var ageText: String? = null,
    var weight: BigDecimal? = null,

    @Column(columnDefinition = "text")
    var note: String? = null,
) : BaseTimeEntity()
```

### 7.3 일정 완료 API 요청/응답 예시

```ts
// request
POST /api/schedules/:scheduleId/complete
{
  "completedAt": "2026-03-23T09:00:00.000Z",
  "createRecord": true
}

// response
{
  "schedule": {
    "id": "sch_123",
    "status": "completed",
    "completedAt": "2026-03-23T09:00:00.000Z"
  },
  "record": {
    "id": "rec_456",
    "type": "medication",
    "sourceScheduleId": "sch_123"
  },
  "nextSchedule": {
    "id": "sch_124",
    "status": "scheduled"
  }
}
```

### 7.4 홈 화면 API 응답 예시

```ts
{
  "selectedPet": {
    "id": "pet_1",
    "name": "Milo",
    "species": "cat"
  },
  "pets": [
    { "id": "pet_1", "name": "Milo", "species": "cat" },
    { "id": "pet_2", "name": "Coco", "species": "dog" }
  ],
  "todaySchedules": [
    {
      "id": "sch_1",
      "title": "심장사상충 예방약",
      "type": "prevention",
      "dueAt": "2026-03-23T10:00:00.000Z",
      "status": "scheduled"
    }
  ],
  "overdueSchedules": [
    {
      "id": "sch_2",
      "title": "예방접종",
      "type": "vaccination",
      "dueAt": "2026-03-20T10:00:00.000Z",
      "status": "overdue"
    }
  ],
  "recentRecords": [
    {
      "id": "rec_1",
      "type": "weight",
      "title": "체중 기록",
      "occurredAt": "2026-03-22T08:00:00.000Z",
      "value": 4.8,
      "unit": "kg"
    }
  ]
}
```

### 7.5 프론트엔드 폼 모델 예시

```ts
export interface CreatePetFormValues {
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  sex: 'male' | 'female';
  neuteredStatus: 'yes' | 'no' | 'unknown';
  birthDate?: string;
  ageText?: string;
  weight?: number;
  note?: string;
}
```

## 8. 단계별 구현 순서

### 8.0 0단계: 백엔드 실행 가능 베이스라인 복구

목표:

- Gradle 기반 Kotlin Spring Boot 프로젝트 실행 가능 상태 확보
- 최소 의존성 정리
- 메인 애플리케이션 구동 구조 정리
- 공통 응답/예외 처리 연결 가능한 상태 확보

완료 기준:

- 서버가 최소 부팅 가능한 구조를 가진다.
- 이후 auth/pet/schedule 모듈 구현이 실행 가능한 프로젝트 위에서 진행된다.

### 8.1 1단계: 인증

목표:

- 회원가입
- 로그인
- 인증 유지

완료 기준:

- 로그인 후 보호된 화면 접근 가능

### 8.2 2단계: 반려동물

목표:

- 첫 반려동물 등록
- 반려동물 목록/추가/수정
- 반려동물 전환

완료 기준:

- 사용자별 여러 반려동물이 저장되고 조회됨
- 홈과 일정/기록 화면에서 현재 반려동물 전환이 가능함

### 8.3 3단계: 일정

목표:

- 일정 생성/목록/상세/수정
- 완료 처리
- overdue 계산

완료 기준:

- 홈 이전에도 일정 기능 자체가 독립적으로 동작함

### 8.4 4단계: 기록

목표:

- 기록 직접 추가
- 일정 완료 시 기록 생성
- 기록 목록 조회
- 병원 방문 메모 기록 지원

완료 기준:

- 반려동물별 기록 타임라인이 확인 가능
- 병원 방문 내용은 자유 메모 기록으로 저장 가능

### 8.5 5단계: 홈

목표:

- 오늘 일정
- overdue 일정
- 최근 기록 집계

완료 기준:

- 사용자가 앱 첫 화면에서 오늘 해야 할 일을 파악 가능

### 8.6 6단계: 알림

목표:

- 푸시 토큰 등록
- 일정 due 알림 발송

완료 기준:

- 일정 생성 후 due 시점 알림이 발송됨

## 9. 트레이드오프

### 9.1 일정 모델 단순화 vs 미래 확장성

선택:

- MVP에서는 `Schedule` 하나로 대부분의 일정 표현

장점:

- 구현 속도가 빠름
- 화면과 API가 단순함

단점:

- 나중에 복약 계획, 다단계 예방 스케줄, 세부 체크리스트로 확장할 때 재구조화 가능성이 있음

### 9.2 Record 단일 테이블 vs 유형별 분리

선택:

- MVP에서는 `Record`를 단일 모델로 관리

장점:

- 기록 추가/목록 UI를 빠르게 만들 수 있음
- 타임라인 구현이 쉬움

단점:

- 접종, 체중, 병원 기록의 필드가 서로 달라 데이터 정합성 제약이 약해질 수 있음

### 9.3 알림 단순 정책 vs 유연한 정책

선택:

- 일정당 기본 알림 1회

장점:

- 구현과 QA가 단순함
- 알림 피로를 줄임

단점:

- 예방접종 7일 전, 하루 전 같은 고급 리마인더 니즈를 바로 해결하지 못함

### 9.4 앱 우선 vs 웹 동시 대응

선택:

- 앱 우선 MVP

장점:

- 핵심 사용자 상황과 더 잘 맞음
- 알림과 습관 형성에 유리함

단점:

- 병원/시터 공유나 관리 화면 등은 이후 웹이 더 편할 수 있음

### 9.5 병원 기록 단순화 vs 구조화 확장성

선택:

- 병원 기록은 자유 메모 형태로만 처리

장점:

- 입력 UI와 API가 단순함
- 2~4주 안에 구현 가능한 복잡도로 유지 가능

단점:

- 병원명, 진단명, 처방 정보의 구조화 검색/통계가 어려움
- 이후 정교한 의료 기록 모델로 확장할 때 마이그레이션이 필요할 수 있음

### 9.6 첨부 제외 vs 실제 병원 사용성

선택:

- 첨부파일은 MVP 제외

장점:

- 구현 범위를 크게 줄임

단점:

- 병원 방문 시 자료 보관 가치는 제한적임

## 10. 리스크

### 10.0 실행 불가 베이스라인 리스크

위험:

- 현재 백엔드가 실행 불가 상태면 이후 API, DTO, 컨트롤러 작업의 검증이 전부 지연된다.

대응:

- 기능 구현보다 먼저 실행 베이스라인 복구 task를 둔다.
- build 파일, 메인 클래스, 설정 파일, 기본 의존성을 우선 정리한다.

### 10.1 알림 신뢰성

위험:

- 모바일 푸시와 서버 예약 처리의 신뢰성이 낮으면 핵심 가치가 무너짐

대응:

- overdue 시 홈 화면 강조를 보조 수단으로 둠
- 일정 생성/수정 시 알림 작업 생성 여부를 추적함

### 10.2 기록 입력 피로

위험:

- 기록 입력이 번거로우면 사용자가 일정만 쓰고 기록은 포기할 수 있음

대응:

- 일정 완료 시 기록 자동 생성 옵션 제공
- 기록 필드를 최소화

### 10.3 반복 일정 처리 복잡성

위험:

- 완료 시 다음 일정 생성 로직에서 중복 생성, 누락 생성 가능성

대응:

- MVP 반복 규칙을 `daily/weekly/monthly`로 제한
- 완료 API 내부에서만 다음 일정 생성

### 10.4 범위 확장 압력

위험:

- 첨부, 협업, 리포트 요구가 빠르게 붙으면서 MVP 일정이 밀릴 수 있음

대응:

- `docs/scope.md`의 제외 기능을 유지
- P0 완료 전 P1/P2 착수 금지

### 10.5 서버 실행 체인 누락 리스크

위험:

- JPA 엔티티와 migration SQL만 추가하고 실제 migration 실행 체인이 없으면 서버가 부팅되지 않는다.
- `ddl-auto: validate`가 켜진 상태에서는 신규 테이블 누락이 즉시 전체 auth 흐름 실패로 이어진다.

대응:

- 실행 가능 베이스라인의 정의에 migration runner를 포함한다.
- H2 file mode를 유지할 경우 DB 파일 초기화 전략도 같이 둔다.
- 서버 완료 기준은 `compile`이 아니라 `bootRun 가능`으로 잡는다.

### 10.6 보안 계약 불일치 리스크

위험:

- 인증 실패 응답이 문서 계약과 다르면 app이 문자열이나 우연한 status code 패턴에 의존하게 된다.
- `/auth/me` 같은 핵심 bootstrap API에서 `UNAUTHORIZED` envelope가 보장되지 않으면 세션 복구 로직이 불안정해진다.

대응:

- Security layer에서 `UNAUTHORIZED` / `FORBIDDEN` 응답 형식을 명시적으로 고정한다.
- Spring Security 기본 응답에 맡기지 않는다.

### 10.7 앱 루트 구조 중복 리스크

위험:

- 루트와 하위 화면이 동시에 전체 화면 셸을 가지면 safe area, padding, 상태 레이아웃이 중복된다.
- 이후 실제 navigation 도입 시 재작업 범위가 커진다.

대응:

- 루트는 분기만 담당할지, 분기와 셸을 같이 담당할지 먼저 고정한다.
- 상위/하위 이중 컨테이너 구조는 금지한다.

### 10.8 CTA 진실성 리스크

위험:

- 동작하지 않는 CTA나 placeholder action이 사용자용 UI에 남으면 UX 신뢰가 무너진다.

대응:

- 주요 CTA는 반드시 실제 행동과 연결한다.
- 아직 연결되지 않은 동작은 hidden 또는 disabled로 처리한다.

## 11. 최종 정리

이번 MVP 구현 계획은 아래 구조를 중심으로 한다.

- 프론트엔드 앱
- 인증 포함 백엔드 API
- `User`, `Pet`, `Schedule`, `Record`, `Notification` 중심 데이터 모델
- 홈, 일정, 기록 중심 화면 구성

가장 중요한 구현 판단은 다음이다.

- 일정과 기록을 반려동물 중심으로 단순하게 묶는다.
- 반복과 알림은 최소 규칙만 지원한다.
- 고급 건강 관리와 협업은 후속 단계로 넘긴다.

추가로 review annotation 기준으로 상위 계획에서 고정해야 할 사항은 다음이다.

- 서버는 migration 실행 체인과 JPA 안정성까지 포함해 “실행 가능”해야 한다.
- auth는 기능 API뿐 아니라 security 실패 응답까지 계약에 맞아야 한다.
- app은 API 연결만이 아니라 루트 레이아웃 책임과 예외 처리 방식까지 일관돼야 한다.
- UI/UX는 예쁜 화면보다 공통 컴포넌트, 상태 패턴, 실제로 동작하는 CTA를 우선해야 한다.

이 계획은 2~4주 MVP 범위와 일치하며, 이후 확장은 `첨부`, `협업`, `고급 기록 모델`, `리포트`, `외부 연동` 순으로 검토하는 것이 적절하다.

## 12. Review Annotation

`docs/review.md`, `docs/plan-login.md`, `docs/plan-app.md`, `docs/plan-uiux.md`의 annotation을 상위 구현 계획 관점으로 통합하면 아래처럼 정리된다.

### 12.1 백엔드 우선 보정 항목

1. migration 실행 체인 추가
2. JPA 엔티티 안정성 보강
3. auth security 실패 응답 계약 고정
4. signup / resend 부분 실패 전략 정리

즉, 백엔드 “실행 가능 베이스라인”의 정의는 이제 아래를 모두 만족해야 한다.

- Gradle 실행 가능
- Java 21 기준 구동 가능
- migration 반영 가능
- `bootRun` 가능
- auth 실패 응답이 계약과 일치

### 12.2 앱 구조 보정 항목

1. 루트 네비게이션과 화면 셸 책임을 분리
2. API client 헤더 병합 안정화
3. auth submit 예외 처리 기준 고정
4. 푸시 `deviceType` 판별 규칙 고정

즉, app 계획의 핵심은 이제 “화면이 뜬다”를 넘어서 아래를 만족하는 것이다.

- 루트/하위 화면 레이아웃이 중복되지 않음
- 인증 bootstrap이 계약 기반으로 동작함
- API 호출 공통 규칙이 깨지지 않음
- 플랫폼 의존 값이 하드코딩되지 않음

### 12.3 UI/UX 보정 항목

1. 공통 UI 컴포넌트 누락분 정리
2. 상태 UI 패턴 전역 통일
3. dead CTA 제거 또는 실제 연결
4. 루트/화면 컨테이너 규칙 단일화

즉, UI/UX 계획의 완료 기준은 단순 스타일 적용이 아니라 아래여야 한다.

- 공통 토큰과 컴포넌트가 실제로 재사용됨
- 상태 화면이 모든 주요 흐름에서 같은 문법으로 보임
- 사용자에게 보이는 강한 CTA는 모두 실제 동작함

### 12.4 갱신된 전체 우선순위

1. 서버 부팅 복구
2. auth/security 계약 안정화
3. app 루트 구조와 API client 안정화
4. 그 다음 UI/UX polish

상위 계획 기준으로 현재 가장 중요한 작업은 여전히 기능 추가가 아니라 기반 품질을 닫는 것이다.
