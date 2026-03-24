# Task 08: 일정 생성/목록 API 스켈레톤 정리

## Goal
일정 생성과 목록 조회를 위한 Controller/Service/DTO 스켈레톤을 정리한다.

## Files
- server/src/main/kotlin/com/petory/schedule/ScheduleController.kt
- server/src/main/kotlin/com/petory/schedule/ScheduleService.kt
- server/src/main/kotlin/com/petory/schedule/ScheduleDtos.kt

## Requirements
- GET /api/schedules
- POST /api/schedules
- petId 필터 시그니처 반영
- DTO 필드명을 모바일 계약과 맞춘다.

## Constraints
- 선행 task: task-07-backend-schedule-domain-repository.md
- 일정 상태 계산의 상세 로직은 넣지 않는다.

## Done Criteria
- 일정 목록/생성 API 골격이 준비된다.
- Controller, Service, DTO 책임이 분리된다.
