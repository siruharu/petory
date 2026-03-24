# Task 07: 일정 Domain/Repository 스켈레톤 추가

## Goal
일정 기능의 핵심 데이터 구조와 repository 스켈레톤을 정리한다.

## Files
- server/src/main/kotlin/com/petory/schedule/ScheduleEntity.kt
- server/src/main/kotlin/com/petory/schedule/ScheduleRepository.kt
- server/src/main/resources/db/migration/V003__create_schedules.sql

## Requirements
- 일정 엔티티 필드와 상태 값을 정의한다.
- petId 기준 조회를 고려한 repository 인터페이스를 만든다.
- 반복 유형과 완료 상태를 모델에 반영한다.

## Constraints
- 선행 task: task-02a-backend-runnable-bootstrap.md, task-05-backend-pet-domain-repository.md
- 반복 일정의 실제 생성 로직은 구현하지 않는다.

## Done Criteria
- 일정 저장 구조의 기본 파일이 준비된다.
- 일정 service/controller가 기대하는 모델 기반이 생긴다.
