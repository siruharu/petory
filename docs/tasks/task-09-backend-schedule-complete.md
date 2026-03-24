# Task 09: 일정 완료 API 스켈레톤 정리

## Goal
일정 완료 처리 전용 엔드포인트와 응답 구조를 별도 task로 정리한다.

## Files
- server/src/main/kotlin/com/petory/schedule/ScheduleController.kt
- server/src/main/kotlin/com/petory/schedule/ScheduleService.kt
- server/src/main/kotlin/com/petory/schedule/ScheduleDtos.kt

## Requirements
- POST /api/schedules/:scheduleId/complete 시그니처를 확정한다.
- 완료 응답에 schedule, recordId, nextScheduleId 형태를 반영한다.
- 이후 반복 일정/기록 자동 생성 로직이 들어갈 자리를 명확히 둔다.

## Constraints
- 선행 task: task-08-backend-schedule-create-list.md
- 실제 완료 처리, 반복 생성, 기록 생성은 구현하지 않는다.

## Done Criteria
- 완료 API가 create/list와 분리된 책임으로 정리되어 있다.
- 후속 구현자가 이 엔드포인트만 독립적으로 작업할 수 있다.

