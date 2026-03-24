# Task 17

## Goal
일정 목록 화면을 실제 조회 흐름으로 연결한다.

## Files
- app/src/screens/schedules/schedule-list-screen.tsx
- app/src/features/schedules/schedule-api.ts

## Requirements
- `fetchSchedules()`를 호출한다.
- 현재 선택된 petId를 필터로 사용할 수 있게 한다.
- `loading / success / empty / error`를 실제 상태로 전환한다.

## Constraints
- 선행 task: task-14.md, task-19-mobile-schedule-api-types.md
- 완료 액션은 이 task에 포함하지 않는다.

## Done Criteria
- 일정 목록 화면이 실제 API 응답을 렌더링할 수 있다.

