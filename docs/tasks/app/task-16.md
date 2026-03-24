# Task 16

## Goal
홈 화면을 실제 async state 기반 조회 흐름으로 연결한다.

## Files
- app/src/screens/home/home-screen.tsx
- app/src/features/home/home-api.ts

## Requirements
- mount 시 home API를 호출한다.
- `loading / success / empty / error`를 실제 응답 기반으로 파생한다.
- selected pet, pets, todaySchedules, overdueSchedules, recentRecords 섹션을 데이터 기준으로 렌더링한다.

## Constraints
- 선행 task: task-14.md, task-15.md
- 섹션별 상세 UI polish는 최소 수준으로 둔다.

## Done Criteria
- 홈 화면이 실제 홈 집계 응답을 읽어 렌더링할 수 있다.

