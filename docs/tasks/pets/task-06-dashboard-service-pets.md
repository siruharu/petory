# Task 06: Dashboard Service Pets

## Goal

홈 대시보드 응답에서 `pets`와 `selectedPet`를 실제 데이터로 반환하도록 구현한다.

## Files

- `server/src/main/kotlin/com/petory/dashboard/DashboardService.kt`
- 필요 시 `server/src/main/kotlin/com/petory/dashboard/DashboardDtos.kt`

## Requirements

- 현재 사용자 기준 반려동물 목록을 반환해야 한다
- `petId` query가 있으면 그 반려동물을 `selectedPet` 우선 후보로 삼아야 한다
- 목록이 있을 때 `selectedPet`이 비정상적으로 `null`이 되지 않게 해야 한다
- 일정/기록은 현재 단계에서 빈 리스트 유지 가능하다

## Constraints

- 일정/기록 도메인 구현까지 확장하지 않는다
- 홈 계약 필드는 유지한다
- 선택 로직은 최소 규칙으로 제한한다

## Done Criteria

- 홈 API가 실제 반려동물 목록과 선택된 반려동물 정보를 반환한다
