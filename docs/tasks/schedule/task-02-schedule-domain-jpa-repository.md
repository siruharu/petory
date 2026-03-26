# Task 02: Schedule Domain JPA Repository

## Goal

일정 도메인을 실제 persistence 가능한 JPA 엔티티와 repository로 연결해 서버 일정 기능의 저장 기반을 마련한다.

## Files

- `server/src/main/kotlin/com/petory/schedule/ScheduleEntity.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleRepository.kt`
- 필요 시 `server/src/main/resources/db/migration/`

## Requirements

- `ScheduleEntity`를 JPA 기준으로 실제 저장 가능한 형태로 정리한다
- 사용자/반려동물/일정 조회에 필요한 repository 메서드를 추가한다
- dueAt 기준 정렬 조회 메서드를 제공한다
- 현재 migration 스키마와 엔티티 필드가 맞도록 정합성을 맞춘다

## Constraints

- 일정 데이터 모델을 임의로 크게 확장하지 않는다
- 승인 없는 계약 변경은 하지 않는다
- controller/service 구현까지 한 task에 과도하게 섞지 않는다

## Done Criteria

- 일정 생성/조회/완료 service가 실제 repository를 사용할 수 있다
- 엔티티와 repository 책임이 분리돼 있다
