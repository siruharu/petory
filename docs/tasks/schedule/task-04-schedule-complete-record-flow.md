# Task 04: Schedule Complete Record Flow

## Goal

일정 완료를 실제 상태 변경, record 생성, `nextSchedule` 생성까지 포함하는 서버 유스케이스로 구현한다.

## Files

- `server/src/main/kotlin/com/petory/schedule/ScheduleService.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleController.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleDtos.kt`
- `server/src/main/kotlin/com/petory/record/RecordService.kt`
- 필요 시 record repository/entity 관련 파일

## Requirements

- `scheduleId`가 현재 사용자 소유인지 검증해야 한다
- 완료 시 일정 status와 completedAt이 실제 저장돼야 한다
- `createRecord = true`일 때 record가 실제 생성돼야 한다
- 반복 일정이면 `nextSchedule`가 정책에 맞게 생성돼야 한다
- 응답의 `schedule`, `record`, `nextSchedule`가 실제 저장 결과를 반영해야 한다

## Constraints

- 일정 생성/목록 구현과 별개로 완료 유스케이스에 집중한다
- record type 매핑은 확정된 정책 범위 안에서만 처리한다
- 임의 mock record를 만들지 않는다

## Done Criteria

- `POST /api/schedules/:scheduleId/complete`가 실제 완료 처리로 동작한다
- record 생성 여부와 next schedule 생성 여부가 요청/정책과 일치한다
- 중간 실패 시 정합성이 깨지지 않도록 한 유스케이스로 정리된다
