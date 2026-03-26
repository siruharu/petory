# Task 05: Schedule Overdue Today Logic

## Goal

일정 목록과 홈 집계에서 동일하게 사용할 overdue/today 판정 규칙과 시간 계산 유틸을 정리한다.

## Files

- `server/src/main/kotlin/com/petory/schedule/`
- `server/src/main/kotlin/com/petory/dashboard/DashboardService.kt`
- 필요 시 `server/src/test/` 또는 유틸 파일

## Requirements

- overdue 판정 기준을 코드로 분리한다
- today 범위 판정 기준을 코드로 분리한다
- completed schedule은 overdue/today 집계에서 제외해야 한다
- 반복 일정 next due 계산과 충돌하지 않는 구조여야 한다

## Constraints

- 사용자 timezone 확장까지 이번 task에서 과도하게 넓히지 않는다
- 배치 기반 status 승격을 전제로 하지 않는다

## Done Criteria

- 일정 목록과 홈 집계가 같은 판정 로직을 사용한다
- overdue/today 계산 기준이 테스트 가능한 수준으로 분리된다
