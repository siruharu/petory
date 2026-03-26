# Implementation 01: Policy And Backend Foundation

작성일: 2026-03-25

## 범위

- Task 01
- Task 02
- Task 03

## 구현 내용

- `docs/api-contract.md`에 일정 조회/완료/홈 집계 관련 정책 메모를 추가했다.
- `ScheduleEntity`, `ScheduleRepository`를 실제 JPA/JPA repository 구조로 연결했다.
- `ScheduleController`, `ScheduleService`, `ScheduleDtos`를 사용자 인증 문맥과 실제 저장/조회 흐름으로 전환했다.
- 일정 생성 시 반려동물 소유권 검증, type/recurrence/dueAt/title 검증을 넣었다.
- 일정 목록 조회에 `petId`, `status`, `from`, `to` 필터 구조를 반영했다.

## 주요 파일

- `server/src/main/kotlin/com/petory/schedule/ScheduleEntity.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleRepository.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleController.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleService.kt`
- `server/src/main/kotlin/com/petory/schedule/ScheduleDtos.kt`
- `docs/api-contract.md`

## 검증

- 앱 `npm run typecheck` 통과
- 서버 Gradle 검증은 로컬 Kotlin/JDK 26 환경 충돌로 완료되지 않음
