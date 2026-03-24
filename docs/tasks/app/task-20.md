# Task 20

## Goal
기록 목록 화면을 실제 조회 흐름으로 연결한다.

## Files
- app/src/screens/records/record-list-screen.tsx
- app/src/features/records/record-api.ts

## Requirements
- `fetchRecords()`를 호출한다.
- petId/type/page 필터 자리를 유지한다.
- `loading / success / empty / error` 상태를 실제 결과로 전환한다.

## Constraints
- 선행 task: task-14.md, task-21-mobile-record-api-types.md
- pagination UI는 최소 수준으로 둔다.

## Done Criteria
- 기록 목록 화면이 실제 API 응답을 렌더링할 수 있다.

