# Task 03: Schedule Create List Service

## Goal

일정 생성과 목록 조회를 실제 사용자/반려동물 데이터 기준으로 동작하는 service/controller 흐름으로 구현한다.

## Files

- `server/src/main/kotlin/com/petory/schedule/ScheduleService.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleController.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleDtos.kt`
- 필요 시 인증 principal 관련 파일

## Requirements

- 인증 사용자 기준으로 일정 목록 조회가 동작해야 한다
- `petId` 필터가 실제로 적용돼야 한다
- 일정 생성이 DB 저장으로 이어져야 한다
- 생성 응답은 실제 저장된 일정 기준으로 반환해야 한다
- title, dueAt, type, recurrenceType 입력 검증을 반영해야 한다

## Constraints

- 일정 완료 로직과 반복 일정 생성은 이 task의 중심이 아니다
- controller/service/repository/domain 책임 분리를 유지한다
- DTO는 API 계약 기준을 유지한다

## Done Criteria

- `GET /api/schedules`가 실제 일정 목록을 반환한다
- `POST /api/schedules`가 실제 저장 후 응답한다
- 잘못된 요청과 잘못된 petId 접근이 명시적 에러로 처리된다
