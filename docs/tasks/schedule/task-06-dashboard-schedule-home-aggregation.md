# Task 06: Dashboard Schedule Home Aggregation

## Goal

홈 대시보드가 실제 `todaySchedules`와 `overdueSchedules`를 선택 반려동물 기준으로 집계해 반환하도록 구현한다.

## Files

- `server/src/main/kotlin/com/petory/dashboard/DashboardService.kt`
- `server/src/main/kotlin/com/petory/dashboard/DashboardDtos.kt`
- 필요 시 schedule repository/service 협력 코드

## Requirements

- 홈 응답에 `todaySchedules`가 실제 일정 데이터로 채워져야 한다
- 홈 응답에 `overdueSchedules`가 실제 overdue 일정으로 채워져야 한다
- `selectedPet` 기준으로 집계가 맞아야 한다
- 정렬 기준이 문서와 코드에서 일치해야 한다

## Constraints

- 홈 전체 구조를 재설계하지 않는다
- 반려동물/기록 집계와 섞더라도 일정 집계 책임을 분명히 유지한다

## Done Criteria

- 홈 API에서 일정 섹션이 더 이상 항상 빈 배열이 아니다
- 홈과 일정 목록이 같은 사용자/반려동물 기준을 따른다
