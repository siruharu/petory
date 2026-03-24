# Task 10: 기록 Domain/Repository 스켈레톤 추가

## Goal
기록 기능의 데이터 구조와 repository 스켈레톤을 정리한다.

## Files
- server/src/main/kotlin/com/petory/record/RecordEntity.kt
- server/src/main/kotlin/com/petory/record/RecordRepository.kt
- server/src/main/resources/db/migration/V004__create_records.sql

## Requirements
- 자유 메모 기반 병원 기록 방식을 모델에 반영한다.
- 체중 기록을 위한 value/unit 필드를 포함한다.
- sourceScheduleId 연결 가능 구조를 둔다.

## Constraints
- 선행 task: task-02a-backend-runnable-bootstrap.md, task-05-backend-pet-domain-repository.md
- 기록 유형별 세부 validation은 아직 넣지 않는다.

## Done Criteria
- 기록 저장 구조가 준비된다.
- 병원 기록을 별도 엔티티 없이 다룰 수 있는 형태가 된다.
