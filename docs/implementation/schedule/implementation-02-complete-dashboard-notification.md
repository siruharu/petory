# Implementation 02: Complete Flow, Dashboard, Notification Hook

작성일: 2026-03-25

## 범위

- Task 04
- Task 05
- Task 06
- Task 07

## 구현 내용

- 일정 완료 시 실제 완료 상태 저장, `completedAt` 반영, 중복 완료 방지 로직을 넣었다.
- `createRecord = true`일 때 schedule type을 record type으로 매핑해 실제 record 생성 경로를 연결했다.
- 반복 일정은 `dueAt` cadence 기준으로 `nextSchedule`을 생성하도록 구현했다.
- overdue/today 판정 로직을 `ScheduleService`에 모아 목록/홈 집계에서 같은 기준을 쓰도록 맞췄다.
- `DashboardService`가 선택 반려동물 기준 `todaySchedules`, `overdueSchedules`, `recentRecords`를 실제 집계하도록 변경했다.
- `NotificationService`에 schedule job 생성/취소 hook을 추가했다.

## 주요 파일

- `server/src/main/kotlin/com/petory/schedule/ScheduleService.kt`
- `server/src/main/kotlin/com/petory/dashboard/DashboardService.kt`
- `server/src/main/kotlin/com/petory/record/RecordEntity.kt`
- `server/src/main/kotlin/com/petory/record/RecordRepository.kt`
- `server/src/main/kotlin/com/petory/record/RecordService.kt`
- `server/src/main/kotlin/com/petory/record/RecordController.kt`
- `server/src/main/kotlin/com/petory/notification/NotificationJobEntity.kt`
- `server/src/main/kotlin/com/petory/notification/NotificationRepository.kt`
- `server/src/main/kotlin/com/petory/notification/NotificationService.kt`

## 검증

- 앱 `npm run typecheck` 통과
- 서버 Gradle 검증은 로컬 Kotlin/JDK 26 환경 충돌로 완료되지 않음
