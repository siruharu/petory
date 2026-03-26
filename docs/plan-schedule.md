# 일정관리 상세 구현 계획

작성일: 2026-03-25  
기준 문서: `docs/research-schedule.md`, `docs/api-contract.md`  
목적: 현재 스켈레톤 상태에 머물러 있는 일정관리 기능을, 서버 저장/조회/완료/홈 집계와 앱 화면 흐름까지 닫힌 상태로 전환하기 위한 상세 구현 계획을 정리한다.  
중요: 이 문서는 설계 문서다. 구현은 포함하지 않는다.

---

## Notes

- `docs/review-schedule.md` 기준 후속 수정 필요 항목:
  - `NotificationJobRepository.findPendingJobsBefore(...)`는 Spring Data JPA derived query 규칙에 맞지 않아 서버 기동 blocker가 되므로, `status`와 `sendAt` 필드 기준 메서드명으로 수정해야 한다.
  - 서버 빌드 검증은 toolchain 21 명시와 별개로 실제 Gradle/Kotlin daemon이 JDK 26을 사용할 수 있으므로, Gradle 실행 JVM을 21로 고정하는 보강이 필요하다.
- 일정 등록 시 대상 반려동물이 자동으로 지정되지 않는점(한마리일경우)
- 여러마리의 동물이 있을경우 해당 동물목록을 띄워 선택할 수 있게 해야함
---

## 진행 상태

- [x] Task 01: Schedule Policy And Contract Alignment
- [x] Task 02: Schedule Domain JPA Repository
- [x] Task 03: Schedule Create List Service
- [x] Task 04: Schedule Complete Record Flow
- [x] Task 05: Schedule Overdue Today Logic
- [x] Task 06: Dashboard Schedule Home Aggregation
- [x] Task 07: Schedule Notification Job Hook
- [x] Task 08: App Schedule Routes Flow
- [x] Task 09: App Schedule Form Inputs
- [x] Task 10: App Schedule List Refresh
- [x] Task 11: App Schedule Complete UX
- [x] Task 12: Home Schedule Refresh Sync
- [x] Task 13: Schedule End To End Review
- [x] Task 14: Notification Job Repository Fix
- [x] Task 15: Gradle JDK 21 Lock
- [x] Task 16: Schedule Single Pet Auto Target
- [x] Task 17: Schedule Multi Pet Picker

검증 메모:

- 앱 `npm run typecheck`는 통과했다.
- Task 16, 17 반영 후 앱 `npm run typecheck`를 다시 통과했다.
- 서버 Gradle 검증은 로컬 Kotlin/JDK 26 환경 충돌로 정상 완료되지 않아, 코드 기준 검토와 앱 typecheck 중심으로 확인했다.

---

## 0. 명시적 가정

이 문서는 다음 가정을 전제로 한다.

- 일정 도메인의 기준 계약은 `docs/api-contract.md`를 유지한다.
- 백엔드는 Kotlin + Spring Boot 구조를 유지한다.
- 모바일은 React Native 구조를 유지한다.
- 현재 스케줄 기능은 UI skeleton과 API skeleton은 있으나, 서버 실구현과 화면 연결이 비어 있다.
- 이번 단계의 우선순위는 “실제 동작하는 일정 저장/조회/완료 흐름”이며, 고급 캘린더 UI보다 데이터 정합성과 흐름 완성이 먼저다.
- 반복 일정은 MVP에서 `none`, `daily`, `weekly`, `monthly`만 지원한다.
- 일정 완료 시 기록 자동 생성은 계약에 맞춰 유지하되, 타입 매핑 정책은 명시적으로 닫아야 한다.
- 일정의 source of truth는 서버다. 앱 로컬 상태는 화면 상태 관리와 일시적 UX 보조로만 사용한다.

---

## 1. 접근 방식

현재 일정관리의 핵심 문제는 화면이 없어서가 아니라, 도메인 진실 원천과 집계 경로가 비어 있다는 점이다.

현재 상태:

1. `ScheduleService`는 실제 repository를 쓰지 않는다.
2. `GET /api/schedules`는 항상 빈 배열을 준다.
3. `POST /api/schedules`는 요청값을 echo하는 수준이다.
4. `POST /api/schedules/:scheduleId/complete`는 placeholder 응답만 만든다.
5. 홈 대시보드의 `todaySchedules`, `overdueSchedules`는 항상 빈 배열이다.
6. 앱 일정 화면은 호출은 하지만 라우팅, 검증, refresh, 선택 pet 연동이 약하다.
7. 일정 알림 job 연계 과정에서 Spring Data derived query 메서드명이 엔티티 필드 규칙과 어긋나면 서버 자체가 기동되지 않을 수 있다.
8. 서버 검증은 toolchain 설정만으로 닫히지 않고, 실제 Gradle/Kotlin daemon 실행 JVM을 21로 고정해야 안정적으로 재현된다.

따라서 구현은 아래 세 축으로 나뉜다.

### 1.1 1차 축: 서버를 실제 일정 source of truth로 만든다

- 일정 entity/repository/service/controller를 실제 persistence와 연결한다.
- 인증 사용자 기준으로 일정 소유권을 강제한다.
- 일정 생성, 목록 조회, 완료 처리, 반복 일정 생성 규칙을 서버에서 책임진다.

### 1.2 2차 축: 홈 대시보드와 기록/알림 연계를 닫는다

- 홈 API가 실제 `todaySchedules`, `overdueSchedules`를 집계하도록 만든다.
- 일정 완료 시 record 생성 흐름을 실제 저장과 연결한다.
- 알림 job 생성/정리 지점을 후속 확장 가능한 구조로 마련한다.

### 1.3 3차 축: 앱은 서버 truth를 기준으로 일정 UX를 닫는다

- 일정 목록/생성/완료 화면을 실제 서버 응답과 연결한다.
- `selectedPetId`를 기준으로 필터 조회와 생성 대상을 일관되게 맞춘다.
- 반려동물이 한 마리일 때는 일정 생성 대상이 자동으로 지정돼야 한다.
- 반려동물이 여러 마리일 때는 생성 화면에서 대상 반려동물 목록을 보여주고 선택할 수 있어야 한다.
- 홈과 일정 목록이 같은 서버 데이터 기준으로 보이게 한다.

---

## 2. 구현 목표

이번 계획의 최종 목표는 아래와 같다.

1. 일정이 실제 DB에 저장되고 사용자별로 조회된다.
2. 선택 반려동물 기준 일정 목록 조회가 동작한다.
3. 일정 생성이 반려동물 선택 상태와 연결된다.
4. 일정 완료가 실제 상태 변경으로 저장된다.
5. `createRecord = true`일 때 기록이 실제 생성된다.
6. 반복 일정 완료 시 `nextSchedule` 생성 규칙이 명시적으로 반영된다.
7. 홈 대시보드가 오늘 일정과 overdue 일정을 실제로 보여준다.
8. 앱 일정 화면이 `loading / success / empty / error` 상태를 실제 데이터 기준으로 렌더링한다.
9. 홈과 일정 목록의 refresh 흐름이 서로 어긋나지 않는다.
10. 입력 검증, 소유권 검증, 시간 처리 정책이 문서와 구현에서 일치한다.
11. notification job repository 메서드가 Spring Data 규칙에 맞아 서버 기동 blocker가 남지 않는다.
12. 서버 빌드/테스트 실행 JVM이 21로 고정돼 로컬 검증이 반복 가능하다.
13. 일정 생성 화면은 반려동물이 한 마리일 때 대상이 자동 지정된다.
14. 일정 생성 화면은 반려동물이 여러 마리일 때 선택 가능한 반려동물 목록을 제공한다.

---

## 3. 핵심 설계 결정

### 3.1 일정 상태 관리 방식

정책:

- DB에는 `status`를 유지한다.
- 기본 생성 상태는 `scheduled`다.
- 완료 API 호출 시 `completed`로 전환한다.
- `overdue`는 조회 시점 계산이 아니라 저장 상태와 집계 로직을 함께 사용하는 방향보다, MVP에서는 조회 시 계산으로 두는 편이 더 안전하다.

현재 판단:

- 스키마에 `status` 컬럼은 유지한다.
- 그러나 “시간이 흘렀다”는 이유만으로 DB row를 즉시 갱신하는 배치까지 이번 단계에서 강제하지 않는다.
- 홈 집계와 목록 응답에서 `dueAt < now && completedAt == null`인 항목은 overdue로 노출하는 규칙을 우선 적용한다.

이유:

- 배치/스케줄러 기반 status 승격은 후속 과제다.
- 현재는 일관된 조회 결과가 더 중요하다.

### 3.2 반복 일정 다음 시각 계산 기준

정책:

- `nextSchedule` 계산 기준은 `completedAt`이 아니라 원래 `dueAt`를 기준으로 한다.
- 이유는 늦게 완료한 일정이 있어도 이후 반복 cadence가 밀리지 않도록 하기 위해서다.

예시:

- daily 일정이 `2026-03-25T09:00:00Z`이고 사용자가 `2026-03-26T12:00:00Z`에 완료해도 다음 일정은 `2026-03-26T09:00:00Z`가 아니라, MVP에서는 “원래 cadence 유지” 기준으로 `2026-03-26T09:00:00Z` 또는 이미 지난 경우 다음 유효 시각으로 보정하는 정책 중 하나를 명시해야 한다.

현재 권장:

- MVP에서는 `dueAt + recurrence unit`으로 next schedule을 만든다.
- 다만 계산 결과가 이미 과거면, 현재 시각보다 뒤의 다음 slot까지 밀어주는 보정 규칙을 추가 검토한다.

### 3.3 일정 완료와 기록 생성의 트랜잭션 범위

정책:

- 일정 완료와 record 생성은 하나의 유스케이스로 본다.
- `createRecord = true`일 경우 같은 서비스 트랜잭션 안에서 일정 완료, 기록 생성, 다음 일정 생성까지 처리한다.

이유:

- 중간 실패 시 정합성이 쉽게 깨진다.
- schedule만 완료되고 record가 없거나, record만 있고 schedule이 미완료인 상태를 피해야 한다.

### 3.4 기록 타입 매핑 정책

문제:

- `ScheduleType`과 `RecordType`이 완전히 일치하지 않는다.
- 예를 들어 `prevention`은 현재 `RecordType`에 없다.

정책 후보:

1. schedule type을 그대로 record type에 재사용한다
2. 일부 schedule type은 `memo`나 `medication`으로 매핑한다
3. record type 계약을 확장한다

현재 권장:

- 명시적 승인 없는 계약 변경은 금지이므로, 우선 계약을 유지하는 범위에서 매핑 테이블을 둔다.
- 예:
  - `vaccination` -> `vaccination`
  - `medication` -> `medication`
  - `vet_visit` -> `vet_visit_memo`
  - `prevention` -> `memo` 또는 별도 title 기반 memo
  - `custom` -> `memo`

이 매핑 규칙은 `docs/api-contract.md` 또는 후속 contract 문서에 반영할 필요가 있다.

### 3.5 시간대 정책

정책:

- API 입출력은 ISO-8601 offset datetime 문자열을 기준으로 한다.
- 서버 내부 계산은 `OffsetDateTime`을 사용한다.
- 클라이언트 입력은 최종 submit 전에 ISO-8601 문자열로 정규화한다.

추가 원칙:

- 홈의 `todaySchedules` 판정은 서버 기준 현재 시각과 사용자 로컬 날짜 정책 사이 차이가 생길 수 있으므로, MVP에서는 서버 기준 today 범위를 사용한다.
- 이후 사용자 timezone 요구가 생기면 별도 확장한다.

### 3.6 일정 생성 대상 반려동물 지정 정책

정책:

- 일정 생성 요청은 서버 계약대로 `petId`를 명시적으로 제출한다.
- 앱 입력 UX에서는 자유 텍스트 `petId` 입력을 허용하지 않는다.
- 반려동물이 한 마리인 사용자는 해당 반려동물을 자동 지정 대상으로 처리한다.
- 반려동물이 여러 마리인 사용자는 생성 화면에서 반려동물 목록을 보고 하나를 명시적으로 선택해야 한다.

현재 권장:

- `selectedPetId`가 있는 경우 다두 사용자에게는 초기 선택값으로만 사용하고, 선택 UI는 유지한다.
- 단일 반려동물 사용자는 별도 선택 UI를 강제하지 않고 대상 요약만 보여준다.
- 반려동물 목록이 아직 준비되지 않았거나 비어 있으면 생성 제출을 막고 원인을 화면에 표시한다.

---

## 4. 서버 구현 계획

### 4.1 현재 서버 상태

현재 파일 기준:

- `ScheduleEntity.kt`: domain shape 존재
- `ScheduleRepository.kt`: 인터페이스 존재
- `ScheduleService.kt`: 스텁
- `ScheduleController.kt`: 스켈레톤
- `DashboardService.kt`: pets만 실제 조회, schedules는 빈 배열

즉, 저장소 구조는 보이지만 wiring과 비즈니스 로직이 없다.

### 4.2 목표 서버 구조

#### 4.2.1 ScheduleRepository 실제화

필요 변경:

- `ScheduleEntity`를 JPA entity 기준으로 실제 persistence 가능 상태로 만든다.
- `ScheduleRepository`를 Spring Data JPA 기반으로 전환한다.

예상 변경 파일:

- `server/src/main/kotlin/com/petory/schedule/ScheduleEntity.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleRepository.kt`

필요 메서드:

- `findAllByUserIdOrderByDueAtAsc(...)`
- `findAllByUserIdAndPetIdOrderByDueAtAsc(...)`
- `findByIdAndUserId(...)`
- `save(...)`
- 필요 시 home 집계용 범위 조회 메서드

#### 4.2.2 ScheduleService 실구현

예상 변경 파일:

- `server/src/main/kotlin/com/petory/schedule/ScheduleService.kt`

핵심 메서드:

- `getSchedules(userId, petId, status?, from?, to?)`
- `createSchedule(userId, request)`
- `completeSchedule(userId, scheduleId, request)`

서비스 책임:

- request validation 보강
- pet 소유권 검증
- DTO <-> entity 매핑
- overdue 계산 반영
- 반복 일정 next schedule 생성
- `createRecord` 시 record 생성 호출 또는 내부 협력 메서드 호출

#### 4.2.3 ScheduleController 인증 사용자 연결

예상 변경 파일:

- `server/src/main/kotlin/com/petory/schedule/ScheduleController.kt`
- 인증 principal 관련 파일

필요 변경:

- controller에서 current user를 service에 전달
- 잘못된 petId, scheduleId, 권한 없는 접근을 명시적 에러 응답으로 변환

유지 원칙:

- controller/service/repository/domain 책임은 분리한다.

#### 4.2.4 DTO와 validation 정리

예상 변경 파일:

- `server/src/main/kotlin/com/petory/schedule/ScheduleDtos.kt`

필요 변경:

- request DTO validation annotation 또는 service validation
- 잘못된 enum/string, 비어 있는 title, 잘못된 dueAt 형식 처리

검증 항목:

- `petId` 필수
- `type` 허용값
- `title` 공백 금지
- `dueAt` ISO datetime 파싱 가능 여부
- `recurrenceType` 허용값

#### 4.2.5 Record 연계 구현

예상 변경 파일:

- `server/src/main/kotlin/com/petory/record/RecordService.kt`
- 필요 시 `RecordRepository`, `RecordEntity` 관련 파일

필요 변경:

- 일정 완료 시 실제 record 저장 로직 연결
- `sourceScheduleId` 세팅
- schedule type -> record type 매핑 테이블 도입

주의:

- 계약 변경이 필요해지면 `docs/api-contract.md` 갱신이 선행돼야 한다.

#### 4.2.6 Notification repository/서비스 기동 안정화

예상 변경 파일:

- `server/src/main/kotlin/com/petory/notification/NotificationRepository.kt`
- `server/src/main/kotlin/com/petory/notification/NotificationService.kt`

필요 변경:

- Spring Data JPA derived query 규칙에 맞는 repository 메서드명으로 정리한다
- `status`, `sendAt` 기준 pending job 조회가 실제 엔티티 필드명과 일치해야 한다
- schedule service의 알림 hook 호출부와 메서드 시그니처를 함께 맞춘다

주의:

- 임의 커스텀 query 도입보다, 현재 필드 구조에서 충분히 표현 가능한 derived query를 우선 사용한다
- 서버 기동 자체를 막는 blocker이므로 우선순위를 높게 둔다

#### 4.2.7 Dashboard 일정 집계 구현

예상 변경 파일:

- `server/src/main/kotlin/com/petory/dashboard/DashboardService.kt`
- 필요 시 dashboard controller/dto

필요 변경:

- 선택 pet 기준 `todaySchedules` 계산
- `overdueSchedules` 계산
- 일정 정렬 기준 통일

권장 정렬:

- `todaySchedules`: `dueAt ASC`
- `overdueSchedules`: 가장 오래 지난 항목 먼저 또는 `dueAt ASC`

### 4.3 서버 완료 기준

- `GET /api/schedules`가 실제 사용자 일정 목록을 반환한다.
- `petId` 필터가 실제 동작한다.
- `POST /api/schedules`가 실제 저장된 row를 기준으로 응답한다.
- `POST /api/schedules/:scheduleId/complete`가 실제 완료 처리와 record/nextSchedule 생성을 반영한다.
- 권한 없는 petId/scheduleId 접근이 차단된다.
- 홈 API가 `todaySchedules`, `overdueSchedules`를 실제로 반환한다.
- notification repository 메서드명이 Spring Data 규칙에 맞아 서버가 정상 기동된다.

---

## 5. 앱 구현 계획

### 5.1 현재 앱 상태

현재 앱 일정 기능은 아래 수준이다.

- API 함수는 존재한다.
- 화면 컴포넌트도 존재한다.
- 하지만 루트에서 일정 화면 진입 경로가 보이지 않는다.
- 생성 폼은 자유 텍스트 입력이다.
- 생성 성공/완료 성공 후 상위 화면 갱신이 없다.
- 홈 일정 섹션은 dashboard API 결과에 전적으로 의존한다.

### 5.2 목표 앱 구조

#### 5.2.1 일정 라우팅 연결

예상 변경 파일:

- `app/src/app/navigation/root-navigator.tsx`
- 필요 시 홈 화면

필요 변경:

- 일정 목록 화면 진입 경로 추가
- 일정 생성 화면 진입 경로 추가
- 현재 선택 pet 기준 전달
- 완료/생성 후 홈 또는 일정 목록 복귀 정책 정의

권장 흐름:

1. 홈 -> 일정 목록
2. 일정 목록 -> 일정 생성
3. 일정 생성 성공 -> 일정 목록 복귀 + refresh
4. 일정 완료 -> 목록 soft refresh
5. 필요 시 홈 refresh token 증가

#### 5.2.2 ScheduleListScreen 실사용 흐름 보강

예상 변경 파일:

- `app/src/screens/schedules/schedule-list-screen.tsx`
- `app/src/components/cards/schedule-card.tsx`

필요 변경:

- `selectedPetId`가 없을 때 정책 명확화
- 생성 화면 이동 CTA 추가
- 완료 성공 후 full error가 아니라 soft refresh 유지
- 중복 완료 방지
- 완료 실패 메시지 처리

권장 상태:

- `loading`
- `success`
- `empty`
- `error`
- `refreshing`
- `completing`

#### 5.2.3 ScheduleFormScreen / ScheduleForm UX 보강

예상 변경 파일:

- `app/src/screens/schedules/schedule-form-screen.tsx`
- `app/src/components/forms/schedule-form.tsx`

필요 변경:

- `petId` 직접 입력 제거 또는 숨김
- 반려동물 1마리 사용자 대상 자동 지정
- 반려동물 여러 마리 사용자 대상 선택 목록 표시
- 현재 선택 pet은 다두 사용자에게 초기 선택값으로만 사용
- `type`, `recurrenceType` 선택형 입력으로 전환
- `dueAt` 입력 형식 보정
- field error 표시
- 생성 성공 후 이동/안내/refresh 연결

유지 원칙:

- 임의 mock 구조는 만들지 않는다.
- API 응답 구조는 계약 기준을 따른다.

#### 5.2.4 HomeScreen 일정 섹션 연동

예상 변경 파일:

- `app/src/screens/home/home-screen.tsx`

필요 변경:

- 실제 `todaySchedules`, `overdueSchedules` 렌더링 유지
- 일정 목록 이동 CTA 또는 완료 CTA 연결 여부 검토
- 일정 완료 후 홈 refresh 경로 연결

주의:

- 홈은 dashboard endpoint 기준으로 동작하므로 schedule list endpoint와 별도 refresh를 고려해야 한다.

### 5.3 앱 완료 기준

- 일정 목록 화면에 실제 서버 일정이 보인다.
- 선택 pet 기준 필터 조회가 반영된다.
- 일정 생성 후 목록 또는 홈에 반영된다.
- 단일 반려동물 사용자는 별도 선택 없이 일정 생성이 가능하다.
- 다두 반려동물 사용자는 일정 생성 전 대상 반려동물을 선택할 수 있다.
- 완료 버튼 중복 제출이 막힌다.
- 완료 실패 시 기존 목록이 사라지지 않는다.
- 홈과 일정 목록이 같은 사용자/반려동물 기준 데이터를 보여준다.

---

## 6. 단계별 실행 계획

### Step 1. 계약과 정책 확정

목적:

- 구현 전 애매한 정책을 먼저 닫는다.

세부 항목:

- overdue 계산 기준 확정
- next schedule 계산 기준 확정
- schedule type -> record type 매핑 확정
- `selectedPetId` 없을 때 목록 정책 확정
- 생성/완료 후 복귀 및 refresh 정책 확정

### Step 2. 서버 schedule persistence 연결

목적:

- 일정 생성/조회가 실제 DB를 보도록 만든다.

세부 항목:

- entity/repository 실제화
- service create/list 구현
- controller 인증 사용자 연결
- validation/error response 정리

### Step 3. 서버 complete 유스케이스 구현

목적:

- 일정 완료가 실제 상태 변경이 되도록 만든다.

세부 항목:

- schedule ownership 검증
- completedAt 처리
- createRecord 분기
- nextSchedule 생성
- 완료 응답 DTO 매핑

### Step 4. dashboard 일정 집계 구현

목적:

- 홈에서 일정이 실제로 보이게 만든다.

세부 항목:

- todaySchedules 계산
- overdueSchedules 계산
- selectedPet 기준 집계
- 홈 응답 정렬 규칙 적용

### Step 5. notification repository 기동 blocker 정리

목적:

- schedule/notification 연계 코드 때문에 서버 bean 생성이 깨지지 않도록 repository 메서드와 호출부를 정리한다.

세부 항목:

- `NotificationJobRepository` derived query 메서드명 수정
- `NotificationService` 호출부 시그니처 정리
- schedule service의 job 생성/취소 흐름과 일치 여부 확인

### Step 6. 앱 일정 화면 연결

목적:

- 사용자 접근 경로를 닫는다.

세부 항목:

- 루트 일정 route 추가
- 홈 -> 일정 목록 진입
- 일정 목록 -> 일정 생성 진입
- 생성 성공 복귀 정책 반영

### Step 7. 앱 일정 폼 UX 정리

목적:

- 실사용 가능한 입력 흐름으로 전환한다.

세부 항목:

- pet 선택 상태 연결
- 단일 반려동물 자동 지정 정책 반영
- 다두 반려동물 선택 목록 UI 반영
- type/recurrenceType 선택형 입력
- dueAt 입력 보정
- submit error/field error 표시

### Step 8. 앱 일정 완료 UX 정리

목적:

- 완료 처리 중복/실패 UX를 안정화한다.

세부 항목:

- 완료 버튼 disable
- completing 상태 표시
- soft refresh 유지
- 실패 시 inline message 처리

### Step 9. Gradle/JDK 21 검증 환경 고정

목적:

- 일정 모듈 검증이 개발자 환경 우연에 좌우되지 않도록 Gradle 실행 JVM을 21로 고정한다.

세부 항목:

- `gradle.properties` 또는 동등한 설정으로 Gradle JVM 고정 여부 결정
- daemon 재사용 이슈를 피할 수 있는 실행 기준 정리
- IntelliJ Gradle JVM과 CLI 실행 JVM 일치 여부 확인

### Step 10. 통합 검증

목적:

- 목록/생성/완료/홈 집계가 한 흐름으로 닫히는지 본다.

세부 항목:

- 반려동물 선택 후 일정 목록 조회
- 일정 생성 후 목록 반영
- 일정 완료 후 목록 반영
- createRecord true 시 기록 생성 확인
- 반복 일정 nextSchedule 생성 확인
- 홈 today/overdue 반영 확인

---

## 7. 변경 대상 범위

### 7.1 서버

- `server/src/main/kotlin/com/petory/schedule/`
- `server/src/main/kotlin/com/petory/dashboard/`
- `server/src/main/kotlin/com/petory/record/`
- `server/src/main/kotlin/com/petory/notification/`
- 필요 시 `server/gradle.properties`
- 필요 시 인증 principal 관련 코드
- 필요 시 migration 보강

### 7.2 앱

- `app/src/app/navigation/root-navigator.tsx`
- `app/src/screens/schedules/`
- `app/src/components/forms/schedule-form.tsx`
- `app/src/components/cards/schedule-card.tsx`
- `app/src/screens/home/home-screen.tsx`
- 필요 시 공통 입력 컴포넌트

### 7.3 문서

- `docs/api-contract.md`
- `docs/tasks/` 하위 schedule 관련 task
- 구현 후 필요 시 `docs/review.md` 또는 별도 review 문서

---

## 8. 트레이드오프

### 8.1 overdue를 DB status로 강하게 관리하는 경우

장점:

- 조회 로직이 단순해질 수 있다.

단점:

- 배치 또는 스케줄러가 필요하다.
- 상태 동기화 책임이 늘어난다.

현재 판단:

- MVP에서는 조회 시 overdue 계산이 더 현실적이다.

### 8.2 `completedAt` 기준으로 next schedule을 만드는 경우

장점:

- 사용자가 실제 완료한 시점에 맞춰 cadence가 이동한다.

단점:

- 늦게 완료할수록 반복 리듬이 계속 밀린다.

현재 판단:

- 우선 `dueAt` 기준 반복 유지 쪽이 안정적이다.

### 8.3 앱에서 optimistic update를 강하게 쓰는 경우

장점:

- UI 반응이 즉각적이다.

단점:

- 홈 집계와 일정 목록이 쉽게 어긋난다.
- 반복 일정/record 생성 응답을 반영하기 어렵다.

현재 판단:

- 일정은 서버 응답 기반 refresh가 더 안전하다.

### 8.4 `prevention`용 record type 계약을 바로 확장하는 경우

장점:

- 데이터 의미가 더 명확해진다.

단점:

- 계약 변경이 필요하다.
- 앱/서버 타입 동시 수정이 필요하다.

현재 판단:

- 명시적 승인 전까지는 매핑 테이블로 우회하고, 필요 시 별도 계약 변경 문서를 만든다.

---

## 9. 리스크

### 높음

- schedule service를 실제 구현하지 않으면 앱 작업이 대부분 가짜 흐름 위에 머문다.
- 완료 처리와 record 생성이 분리되면 정합성이 쉽게 깨진다.
- 홈 집계와 일정 목록이 서로 다른 기준을 쓰면 사용자 신뢰도가 크게 떨어진다.
- notification repository 메서드명이 Spring Data 규칙에 맞지 않으면 서버가 일정 모듈 이전에 기동조차 되지 않는다.

### 중간

- timezone 처리 미정으로 today/overdue 판정이 흔들릴 수 있다.
- 반복 일정 계산 규칙이 모호하면 edge case가 계속 누적된다.
- `prevention` 타입의 기록 매핑이 애매하면 분석/기록 화면에서 의미가 흐려질 수 있다.
- Gradle/Kotlin daemon이 JDK 26을 물면 코드 상태와 무관하게 로컬 검증이 실패할 수 있다.

### 낮음

- 일정 카드 디자인 자체는 이번 단계의 핵심 리스크가 아니다.
- 고급 캘린더 UI 부재는 현재 핵심 blocker가 아니다.

---

## 10. 완료 기준

이 계획이 완료됐다고 볼 기준은 아래와 같다.

- 일정 생성/조회/완료 API가 실제 저장 데이터를 기준으로 동작한다.
- 사용자 소유권 검증이 schedule과 pet 모두에 반영된다.
- 반복 일정 완료 시 `nextSchedule` 정책이 코드와 문서에서 일치한다.
- `createRecord = true`일 때 일정 완료와 함께 record가 생성된다.
- 홈 대시보드가 `todaySchedules`, `overdueSchedules`를 실제로 보여준다.
- 앱에서 일정 목록과 홈 일정 섹션이 같은 사용자/반려동물 기준으로 동작한다.
- 일정 생성 화면이 현재 선택 반려동물과 연결된다.
- 반려동물이 한 마리일 때 일정 생성 대상이 자동 지정된다.
- 반려동물이 여러 마리일 때 일정 생성 대상 목록이 노출되고 선택 결과가 제출 `petId`와 일치한다.
- 완료 버튼 중복 제출과 실패 처리 UX가 안정적이다.
- 필요한 계약 변경이 있다면 `docs/api-contract.md`가 함께 갱신된다.
- notification repository 메서드와 service 호출부가 Spring Data JPA 규칙에 맞아 서버가 정상 기동된다.
- 서버 검증 시 Gradle 실행 JVM이 21로 고정돼 로컬/IDE 환경 차이로 인한 컴파일 실패가 줄어든다.
