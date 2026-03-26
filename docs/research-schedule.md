# 일정관리 연구

작성일: 2026-03-25  
대상 범위: 앱 일정 화면/컴포넌트, 앱 API/타입, 서버 schedule 모듈, 대시보드 집계 연계, 기록/알림 연계, 계약 및 기존 task 문서

## 1. 전체 구조

### 1.1 파일 맵

앱:

- `app/src/types/domain.ts`
- `app/src/types/api.ts`
- `app/src/features/schedules/schedule-api.ts`
- `app/src/screens/schedules/schedule-list-screen.tsx`
- `app/src/screens/schedules/schedule-form-screen.tsx`
- `app/src/components/forms/schedule-form.tsx`
- `app/src/components/cards/schedule-card.tsx`
- `app/src/components/cards/schedule-alert-card.tsx`
- `app/src/screens/home/home-screen.tsx`
- `app/src/services/api/client.ts`

서버:

- `server/src/main/kotlin/com/petory/schedule/ScheduleEntity.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleRepository.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleDtos.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleService.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleController.kt`
- `server/src/main/kotlin/com/petory/dashboard/DashboardService.kt`
- `server/src/main/kotlin/com/petory/dashboard/DashboardDtos.kt`
- `server/src/main/kotlin/com/petory/record/RecordService.kt`
- `server/src/main/kotlin/com/petory/record/RecordDtos.kt`
- `server/src/main/kotlin/com/petory/notification/NotificationRepository.kt`
- `server/src/main/kotlin/com/petory/notification/NotificationJobEntity.kt`
- `server/src/main/resources/db/migration/V003__create_schedules.sql`
- `server/src/main/resources/db/migration/V004__create_records.sql`
- `server/src/main/resources/db/migration/V006__create_notification_jobs.sql`

문서/계약:

- `docs/api-contract.md`
- `docs/plan.md`
- `docs/plan-app.md`
- `docs/research-app.md`
- `docs/tasks/task-07-backend-schedule-domain-repository.md`
- `docs/tasks/task-08-backend-schedule-create-list.md`
- `docs/tasks/task-09-backend-schedule-complete.md`
- `docs/tasks/task-19-mobile-schedule-api-types.md`
- `docs/tasks/task-20-mobile-schedule-screens.md`

### 1.2 계층 구조

현재 일정관리는 아래 5계층으로 나뉜다.

1. 계약/타입 계층  
   `docs/api-contract.md`, `app/src/types/domain.ts`, `app/src/types/api.ts`

2. 앱 호출 계층  
   `app/src/features/schedules/schedule-api.ts`, `app/src/services/api/client.ts`

3. 앱 UI 계층  
   `schedule-list-screen`, `schedule-form-screen`, `schedule-form`, `schedule-card`, `schedule-alert-card`, `home-screen`

4. 서버 HTTP 계층  
   `ScheduleController.kt`, `ScheduleDtos.kt`

5. 서버 도메인/저장 계층  
   `ScheduleEntity.kt`, `ScheduleRepository.kt`, DB migration

### 1.3 현재 구현 성숙도

구조만 놓고 보면 일정관리의 뼈대는 존재한다. 하지만 실제 동작 완성도는 계층마다 다르다.

- 계약 문서와 앱 타입은 비교적 구체적이다.
- 앱 API 함수는 실제 호출 가능하다.
- 앱 일정 화면은 skeleton을 넘어 최소 호출은 하지만, UX와 상태 연결은 매우 얕다.
- 서버 controller와 DTO는 존재한다.
- 서버 service는 실질적으로 스텁이며 repository를 주입받지도 않는다.
- 대시보드의 일정 섹션은 계약상 존재하지만 서버는 항상 빈 리스트를 반환한다.

즉, 일정관리는 “파일은 많지만 실제 기능 중심축은 아직 비어 있는 상태”다.

## 2. 핵심 로직 흐름

### 2.1 타입과 계약 정의 흐름

시작점은 `docs/api-contract.md`다.

- `GET /api/schedules`
- `POST /api/schedules`
- `POST /api/schedules/:scheduleId/complete`
- 홈 응답의 `todaySchedules`, `overdueSchedules`

앱은 이 계약을 `app/src/types/domain.ts`, `app/src/types/api.ts`로 옮긴다.

핵심 타입:

- `ScheduleType`: `vaccination | prevention | medication | vet_visit | custom`
- `ScheduleStatus`: `scheduled | completed | overdue`
- `RecurrenceType`: `none | daily | weekly | monthly`
- `Schedule`
- `CreateSchedulePayload`
- `CompleteSchedulePayload`
- `CompleteScheduleResponse`

관찰:

- 앱 타입은 문자열 유니언 기반이라 프론트에서 상태 오타를 어느 정도 막는다.
- 서버 DTO는 모두 `String` 기반이라 서버 입력 검증은 아직 타입 수준에서 강제되지 않는다.

### 2.2 앱 일정 목록 조회 흐름

관련 파일:

- `app/src/screens/schedules/schedule-list-screen.tsx`
- `app/src/features/schedules/schedule-api.ts`
- `app/src/services/api/client.ts`

실행 순서:

1. `ScheduleListScreen`이 `selectedPetId` prop을 받는다.
2. `useEffect`가 `selectedPetId` 변경 시 `loadSchedules()`를 호출한다.
3. `loadSchedules()`는 `fetchSchedules(selectedPetId)`를 호출한다.
4. `fetchSchedules()`는 `GET /api/schedules?petId=...` 또는 `GET /api/schedules`를 호출한다.
5. `apiRequest()`가 `/api` envelope에서 `data`를 꺼내 반환한다.
6. 응답 길이에 따라 `success` 또는 `empty`로 상태를 정한다.
7. 에러가 나면 `error` 상태로 간다.

현재 실제 서버 동작:

- 서버 `ScheduleService.getSchedules()`는 무조건 `emptyList()`를 반환한다.
- 따라서 실제 서버와 연결되면 목록 화면은 사실상 항상 `empty`다.

즉, 프론트 목록 화면의 상태 분기는 존재하지만, 정상 데이터가 들어올 수 있는 백엔드가 아직 없다.

### 2.3 앱 일정 생성 흐름

관련 파일:

- `app/src/screens/schedules/schedule-form-screen.tsx`
- `app/src/components/forms/schedule-form.tsx`
- `app/src/features/schedules/schedule-api.ts`

실행 순서:

1. `ScheduleFormScreen`이 로컬 state `values`를 가진다.
2. `ScheduleForm`은 `values`를 받아 텍스트 입력 UI만 렌더링한다.
3. 사용자가 `petId`, `type`, `title`, `dueAt`, `recurrenceType`, `note`를 문자열로 입력한다.
4. `handleSubmit()`는 `petId`, `title`, `dueAt`의 빈 값만 확인한다.
5. 통과하면 `createSchedule(values)` 호출.
6. 서버는 현재 `ScheduleService.createSchedule()`에서 요청값을 거의 그대로 echo한 `ScheduleResponse`를 반환한다.

현재 문제:

- 생성 성공 후 화면 이동이 없다.
- 생성 성공 메시지나 폼 초기화가 없다.
- `type`, `recurrenceType`, `dueAt` 형식 검증이 없다.
- `petId`를 사람이 직접 입력해야 한다.
- 홈/일정 목록 새로고침과 연결되지 않는다.

즉, 생성 API 호출은 가능하지만 실사용 흐름은 닫혀 있지 않다.

### 2.4 앱 일정 완료 흐름

관련 파일:

- `app/src/screens/schedules/schedule-list-screen.tsx`
- `app/src/components/cards/schedule-card.tsx`
- `app/src/features/schedules/schedule-api.ts`

실행 순서:

1. `ScheduleListScreen`이 일정별 `ScheduleCard`를 렌더링한다.
2. 카드에서 `status !== completed`이면 완료 버튼이 보인다.
3. 완료 버튼 클릭 시 `handleCompleteSchedule(schedule.id)` 호출.
4. `completeSchedule(scheduleId, { completedAt: new Date().toISOString(), createRecord: true })`
5. 성공하면 다시 `loadSchedules()` 호출.

현재 실제 서버 동작:

- `ScheduleService.completeSchedule()`는 DB를 읽지 않는다.
- `buildCompletedSchedule()`는 `petId = "TODO_PET_ID"`, `title = "TODO_TITLE"`, `type = "custom"` 같은 placeholder를 반환한다.
- `buildCompletedRecord()`도 `TODO_RECORD_ID`, `TODO_PET_ID`를 반환한다.
- `buildNextSchedule()`는 내부에서 `recurrenceType = "none"`으로 고정돼 있어 항상 `null`이다.

즉, 완료 버튼은 호출 자체는 되지만, 의미 있는 완료 처리라고 보기는 어렵다.

### 2.5 홈 대시보드 일정 표시 흐름

관련 파일:

- `app/src/screens/home/home-screen.tsx`
- `app/src/features/home/home-api.ts`
- `server/src/main/kotlin/com/petory/dashboard/DashboardService.kt`

실행 순서:

1. `HomeScreen`이 `fetchHome({ petId })`를 호출한다.
2. 응답의 `todaySchedules`, `overdueSchedules`, `recentRecords`, `pets`, `selectedPet`를 합쳐 홈 상태를 만든다.
3. `todaySchedules`는 목록 형태로 렌더링된다.
4. `overdueSchedules.length > 0`이면 `ScheduleAlertCard`가 보인다.

현재 실제 서버 동작:

- `DashboardService.getHome()`는 `pets`만 실제 repository에서 읽는다.
- `todaySchedules = emptyList()`
- `overdueSchedules = emptyList()`
- `recentRecords = emptyList()`

즉, 홈에서 일정 UI는 렌더링 구조만 존재하고, 서버 기준으로는 항상 비어 있다.

### 2.6 서버 일정 API 흐름

관련 파일:

- `ScheduleController.kt`
- `ScheduleService.kt`
- `ScheduleDtos.kt`

실행 순서:

1. 클라이언트가 `/api/schedules`로 요청
2. `ScheduleController`가 request body/query를 그대로 `ScheduleService`에 전달
3. `ScheduleService`가 DTO를 조립해 `ApiResponse.of(...)`로 반환

현재 특징:

- controller는 인증 사용자 문맥을 받지 않는다.
- service는 repository를 주입받지 않는다.
- service는 entity 변환도 하지 않는다.
- validation, error response, ownership 체크가 없다.

즉, HTTP 스켈레톤은 존재하지만 도메인 서비스는 아직 붙지 않았다.

### 2.7 저장소/스키마 흐름

관련 파일:

- `ScheduleEntity.kt`
- `ScheduleRepository.kt`
- `V003__create_schedules.sql`

도메인 모델:

- `ScheduleEntity`는 `userId`, `petId`, `type`, `title`, `note`, `dueAt`, `recurrenceType`, `status`, `completedAt`를 가진다.

repository 인터페이스:

- 사용자 단위 조회
- 사용자 + 반려동물 단위 조회
- 사용자 소유 일정 단건 조회
- 특정 시각 이전 도래 일정 조회
- 저장

스키마:

- `schedules` 테이블은 `user_id`, `pet_id`, `due_at`, `status`, `recurrence_type`, `completed_at`를 가진다.
- 인덱스는 `user_id`, `pet_id`, `due_at`만 있다.

관찰:

- status 기준 인덱스가 없다.
- 반복 생성에 필요한 원본/다음 일정 연결 키가 없다.
- 알림과의 연결은 `notification_jobs.schedule_id`로 간접만 존재한다.

### 2.8 일정 완료 시 기록/알림 연계 의도 흐름

관련 파일:

- `RecordService.kt`
- `RecordDtos.kt`
- `V004__create_records.sql`
- `NotificationJobEntity.kt`
- `NotificationRepository.kt`
- `V006__create_notification_jobs.sql`

의도된 구조:

- 일정 완료 시 `record`를 자동 생성 가능
- 생성된 기록은 `sourceScheduleId`로 원본 일정과 연결 가능
- 일정 시각 기준으로 알림 job을 생성/조회 가능

현재 실제 상태:

- `RecordService`도 스텁이다.
- 일정 완료가 실제 record persistence를 호출하지 않는다.
- notification job은 테이블/엔티티/리포지토리 인터페이스만 있고 일정 모듈과 연결 코드가 없다.

즉, 일정은 기록/알림과 개념적으로 연결돼 있지만 현재 런타임에서는 거의 분리돼 있다.

## 3. 사용 기술 및 패턴

### 3.1 프론트엔드

- React
- React Native + React Native Web
- 함수형 컴포넌트 + `useState` / `useEffect`
- API wrapper 패턴: `apiRequest<T>()`
- 앱 상태 패턴: 화면 내부 `loading/success/empty/error` 분기
- 타입 패턴: `domain.ts`와 `api.ts` 분리

현재 프론트 패턴 특징:

- 화면이 자체적으로 API 호출 책임을 가진다.
- 별도 query cache나 전역 store가 없다.
- 폼은 controlled component 패턴이지만 값 검증이 약하다.
- schedule form은 아직 선택형 입력이 아닌 자유 텍스트 입력 위주다.

### 3.2 백엔드

- Kotlin
- Spring Boot
- Controller / Service / Repository / Entity 분리 구조
- DTO 분리 구조
- Flyway migration

현재 백엔드 패턴 특징:

- 구조는 전형적이지만 구현은 skeleton 단계다.
- repository 인터페이스는 존재하나 Spring Data 구현체가 보이지 않는다.
- service가 실제 비즈니스 규칙보다 응답 스텁 생성 역할에 머물러 있다.

### 3.3 공통 패턴

- API envelope: `{ data: ... }`
- 상태 문자열 직접 사용
- 일정, 기록, 홈이 각각 별도 endpoint를 가지되 홈이 교차 집계 endpoint 역할을 맡음

## 4. 숨겨진 의존성

### 4.1 일정 목록은 `selectedPetId`에 암묵적으로 의존한다

`ScheduleListScreen`은 `selectedPetId`를 prop으로 받아 필터 조회하도록 되어 있다. 하지만 현재 코드베이스에서 이 화면을 실제로 mount하는 상위 연결이 보이지 않는다.

영향:

- 화면 단독 개발은 가능해도 실제 앱 내 진입 흐름이 없다.
- `selectedPetId`가 없으면 전체 일정 조회가 되는데, 서버가 이 경로를 어떤 의미로 처리해야 하는지 정책이 모호하다.

### 4.2 일정 폼은 반려동물 선택 UX 대신 `petId` 직접 입력에 의존한다

현재 일정 생성은 사실상 내부 개발용 입력 수준이다.

영향:

- 반려동물 목록/선택 상태가 없으면 일정 생성이 성립하지 않는다.
- 반려동물 생성 흐름과 일정 생성 흐름이 실사용 기준으로 분리돼 있다.

### 4.3 홈 일정 UI는 dashboard endpoint 품질에 전적으로 의존한다

홈 화면은 개별 일정 endpoint를 사용하지 않고 `/dashboard/home` 하나에 의존한다.

영향:

- schedule API가 완성돼도 dashboard가 비어 있으면 홈 일정 섹션은 계속 빈 상태다.
- 일정 기능 완료 여부를 schedule 모듈만 봐서는 판단할 수 없다.

### 4.4 일정 완료는 기록 생성 기능에 암묵적으로 의존한다

`completeSchedule()` payload에는 `createRecord`가 들어간다.

영향:

- 일정 완료의 의미가 단순 상태 변경인지, 기록 생성까지 포함한 복합 트랜잭션인지 아직 확정되지 않았다.
- record 모듈이 미완성이면 schedule complete도 절반만 구현될 가능성이 높다.

### 4.5 반복 일정은 next schedule 생성 정책에 의존한다

계약상 완료 응답은 `nextSchedule`를 포함할 수 있다.

영향:

- recurrence 계산 규칙이 없으면 완료 로직을 완성할 수 없다.
- timezone, dueAt 기준, completedAt 기준 중 어떤 시점을 다음 일정 계산 기준으로 삼을지 정해야 한다.

### 4.6 알림 시스템은 schedule 저장 성공 이후 후처리에 의존한다

`notification_jobs` 테이블 구조상 일정과 알림은 연결되도록 설계돼 있다.

영향:

- 일정 생성/수정/완료 시 job 생성, 갱신, 취소가 뒤따라야 한다.
- 현재는 schedule 모듈에 이 후처리 지점이 전혀 없다.

### 4.7 서버의 인증/소유권 문맥에 의존하지만 schedule controller에는 드러나지 않는다

repository는 `userId` 기준 메서드를 가진다. 그런데 controller/service에는 현재 userId 인자가 없다.

영향:

- 실제 구현 시 인증 사용자 주입 구조를 새로 연결해야 한다.
- 지금의 controller 시그니처는 나중에 바뀔 가능성이 높다.

### 4.8 API 클라이언트는 서버 에러 포맷에 의존한다

`apiRequest()`는 `{ error: { code, message, fieldErrors } }` 포맷을 기대한다.

영향:

- schedule validation이 도입돼도 이 포맷을 지키지 않으면 앱은 일반 `API request failed: 400` 수준으로만 처리한다.
- 폼 필드별 에러 연결은 아직 구현되지 않았지만 클라이언트 구조상 가능성은 열려 있다.

## 5. 문제 가능성

### 5.1 가장 큰 구조 문제: 계약과 구현의 간극

계약 문서:

- 일정 목록 필터
- 일정 생성
- 일정 완료 시 기록 생성
- 반복 일정의 `nextSchedule`
- 홈 대시보드 일정/지연 일정 집계

실제 구현:

- 목록은 항상 빈 리스트
- 생성은 입력 echo
- 완료는 placeholder 응답
- next schedule 없음
- 홈 일정 항상 빈 리스트

즉, 현재 일정관리는 계약 문서가 구현을 앞서고 있다.

### 5.2 edge case: 완료 버튼 중복 클릭

`ScheduleCard`는 `isCompleting` 텍스트만 바꾸고 버튼 자체를 disable하지 않는다.

가능한 문제:

- 사용자가 빠르게 여러 번 누르면 중복 완료 요청 발생 가능
- 반복 일정이라면 중복 `nextSchedule` 생성 위험
- 기록 자동 생성이 붙으면 중복 record 생성 위험

### 5.3 edge case: 완료 중 다른 일정 버튼 클릭

`completingScheduleId`는 단일 id다.

가능한 문제:

- 한 일정 완료 중 다른 일정 완료 버튼은 여전히 눌릴 수 있다.
- 병렬 완료 요청 시 상태와 새로고침 순서가 꼬일 수 있다.

### 5.4 edge case: 완료 실패 후 목록 상태 손실

`handleCompleteSchedule()` 실패 시 `setStatus('error')`만 수행한다.

가능한 문제:

- 기존에 성공적으로 불러온 일정 목록이 있어도 화면 전체가 error로 전환된다.
- 부분 실패와 전체 조회 실패가 같은 UI로 처리된다.

### 5.5 edge case: `dueAt` 형식 불일치

폼 placeholder는 `YYYY-MM-DDTHH:mm:ss`이고 계약 예시는 `Z`가 붙은 UTC ISO string이다.

가능한 문제:

- 사용자 입력이 timezone 없는 문자열일 수 있다.
- 서버가 `OffsetDateTime`으로 파싱할 경우 실패 가능
- 웹/모바일/서버 시간대가 다르면 overdue/today 계산이 흔들린다.

### 5.6 edge case: `type`, `recurrenceType` 자유 입력

현재 폼은 텍스트 입력이다.

가능한 문제:

- `vaccinaton`, `wekly` 같은 오타가 그대로 서버로 갈 수 있다.
- 서버 DTO는 string 기반이라 validation 없으면 저장 오염 가능
- 서버 enum 매핑이 붙으면 400 에러가 늘어날 수 있다.

### 5.7 edge case: `petId` 위변조 또는 잘못된 입력

현재 폼은 임의 문자열 `petId`를 받는다.

가능한 문제:

- 존재하지 않는 petId 제출
- 현재 사용자 소유가 아닌 petId 제출
- 서버가 ownership 체크를 누락하면 보안 문제로 이어질 수 있다.

### 5.8 edge case: status 계산 책임 불명확

DB에는 `status` 컬럼이 있고 계약에는 `overdue` 상태가 있다.

가능한 문제:

- overdue를 저장 시점에 materialize할지, 조회 시 계산할지 불명확
- 시간이 지나며 `scheduled -> overdue` 전환을 누가 수행하는지 정의가 없다
- `findDueSchedules(beforeOrEqual)`는 존재하지만 이행 job이 없다

### 5.9 edge case: 반복 일정 완료 시 다음 일정 시점 계산

미정 요소:

- 기준 시각을 `dueAt`로 할지 `completedAt`로 할지
- monthly에서 1월 31일 다음 달 처리
- timezone/DST 경계
- overdue 일정 완료 시 다음 일정이 과거로 밀리는 문제

현재 구현은 이 케이스를 전혀 처리하지 않는다.

### 5.10 edge case: 홈과 일정 목록의 데이터 불일치

홈은 `/dashboard/home`, 일정 목록은 `/schedules`를 사용한다.

가능한 문제:

- schedule API가 완성돼도 dashboard 집계가 늦으면 홈과 목록이 다르게 보일 수 있다.
- 완료 직후 목록은 갱신되지만 홈은 갱신되지 않을 수 있다.

### 5.11 edge case: 기록 생성 타입 호환성

앱 `CompletedScheduleRecord.type`은 `ScheduleType | RecordType`이다.

가능한 문제:

- 일정 타입 `prevention`은 기록 타입에 없다.
- 서버가 일정 완료 record type을 무엇으로 매핑할지 기준이 없다.
- 타입 호환을 대충 처리하면 프론트의 기록 리스트/필터와 어긋날 수 있다.

### 5.12 edge case: DB와 Kotlin 시간 타입 불일치 가능성

DB migration은 `timestamp`를 쓰고, Kotlin entity는 `OffsetDateTime`을 쓴다.

가능한 문제:

- timezone 정보 손실
- JDBC 매핑 정책에 따라 값이 로컬 시간으로 저장/읽힘
- overdue/today 계산이 환경마다 달라질 수 있다.

### 5.13 edge case: 취소/수정 부재

계약 문서 `plan.md`에는 조회/생성/수정/완료가 보이지만 실제 구현은 수정/삭제가 없다.

가능한 문제:

- 잘못 만든 일정을 바로잡는 경로가 없다.
- 반복 일정 변경 시 기존 알림/다음 일정과의 정합성 문제가 커진다.

### 5.14 edge case: 화면 연결 자체의 부재

현재 검색 결과 기준으로 `ScheduleListScreen`, `ScheduleFormScreen`을 실제로 사용하는 상위 라우트 연결은 보이지 않는다.

가능한 문제:

- 기능이 구현돼도 사용자 접근 경로가 없을 수 있다.
- 테스트가 화면 단독 렌더 수준에 머문다.

## 6. 개선 포인트

### 6.1 1단계: 일정 도메인 실제 구현 연결

우선순위가 가장 높다.

- `ScheduleService`에 실제 repository 주입
- 인증 사용자 문맥 주입
- `getSchedules`, `createSchedule`, `completeSchedule` 실제 구현
- DTO <-> Entity 매핑 정리
- ownership 검증 추가

이 단계가 없으면 프론트 개선은 대부분 가짜 데이터 위에 머문다.

### 6.2 2단계: 입력 검증과 enum 강제

- 서버 request DTO validation 추가
- `type`, `recurrenceType`, `petId`, `dueAt` 검증
- 클라이언트도 자유 텍스트 대신 선택형 입력 사용

구체 포인트:

- `ScheduleForm`의 `type`, `recurrenceType`는 select로 전환
- `petId`는 직접 입력이 아니라 반려동물 선택값 사용
- `dueAt`는 date/time picker 또는 최소 ISO helper 사용

### 6.3 3단계: 완료 트랜잭션 의미 확정

완료 처리에서 아래를 먼저 결정해야 한다.

- 일정 상태 변경만 할지
- 기록 자동 생성까지 원자적으로 묶을지
- 반복 일정 next schedule 생성까지 같은 트랜잭션으로 볼지
- 알림 job 정리까지 포함할지

권장 방향:

- 완료, 기록 생성, 반복 다음 일정 생성은 하나의 서비스 트랜잭션으로 본다.
- 알림 job 갱신/취소도 같은 유스케이스에서 후속 처리한다.

### 6.4 4단계: overdue 정책 명문화

반드시 문서로 닫아야 하는 항목:

- overdue를 저장 컬럼으로 운영할지 조회 시 계산할지
- 배치 잡으로 승격할지
- 홈 `todaySchedules`와 `overdueSchedules` 분류 기준
- 자정 경계와 timezone 기준

현재 repository의 `findDueSchedules(beforeOrEqual)`는 이 정책이 정해져야 의미가 생긴다.

### 6.5 5단계: 홈과 일정 목록의 동기화 전략 통일

- 일정 생성 후 일정 목록 refresh
- 일정 생성 후 홈 refresh
- 일정 완료 후 홈/목록 모두 갱신
- 선택 pet 기준을 홈/일정 화면에서 동일하게 사용

권장 방향:

- 현재 구조에서는 최소한 상위 route state에서 refresh token을 공유하는 방식이 현실적이다.
- 나중에 query cache를 도입하더라도 지금은 홈 endpoint와 schedules endpoint를 둘 다 refresh할 수 있어야 한다.

### 6.6 6단계: 화면 연결과 실사용 경로 확보

- 루트 내비게이션에 일정 목록/생성 진입 경로 추가
- 홈의 일정 섹션에서 일정 목록/생성으로 이동 가능하게 연결
- 반려동물 선택 상태를 일정 화면에 전달

현재는 파일은 있지만 사용자가 접근할 수 없는 상태에 가깝다.

### 6.7 7단계: 완료 UX 안전성 보강

- 완료 버튼 disable
- 중복 제출 방지
- 실패 시 전체 error 대신 inline error 또는 toast
- 기존 목록 유지하면서 재시도 가능 구조

### 6.8 8단계: 시간/반복 로직 전용 유틸 분리

다음 로직은 서비스 내부 임시 코드로 두지 않는 편이 낫다.

- overdue 판정
- today 범위 판정
- recurrence 다음 시각 계산
- completedAt 기본값 계산

이 로직은 edge case가 많아 단위 테스트가 가능한 순수 함수로 분리하는 것이 안전하다.

### 6.9 9단계: 데이터 모델 보강 검토

필요 시 아래 필드를 검토할 가치가 있다.

- 반복 시리즈 추적용 `source_schedule_id` 또는 `series_id`
- 알림 offset 정보
- 수동 완료 vs 자동 완료 구분
- 일정 수정 이력 또는 soft delete

현재 스키마는 MVP용 최소 구조지만 반복/알림/수정까지 가면 금방 한계가 드러난다.

### 6.10 10단계: 테스트 전략 추가

최소 필요 테스트:

- 일정 생성 validation
- 사용자 소유권 검증
- petId 필터 조회
- 일정 완료 + record 생성
- 반복 일정 완료 + next schedule 생성
- overdue/today 분류
- 홈 dashboard 일정 집계

현재는 이 기능이 문서와 스텁에 많이 의존하고 있어, 테스트 없이 확장하면 회귀 가능성이 높다.

## 결론

현재 일정관리는 “타입/계약/화면 뼈대/DB 뼈대는 존재하지만 실제 기능 중심은 아직 스텁”인 상태다.  
특히 서버 `ScheduleService`, 대시보드 일정 집계, 기록 자동 생성, 반복 일정 계산, 화면 라우팅 연결이 핵심 공백이다.

후속 구현은 프론트 UI 개선보다 먼저 아래 순서가 맞다.

1. 서버 일정 실구현
2. 홈/일정 집계 연결
3. 완료 트랜잭션 정의
4. 프론트 입력 UX 정리
5. 화면 라우팅 연결
