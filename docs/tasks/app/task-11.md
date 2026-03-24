# Task 11

## Goal
반려동물 목록 조회 화면을 실제 async state 기반으로 연결한다.

## Files
- app/src/screens/pets/pet-list-screen.tsx
- app/src/features/pets/pet-api.ts

## Requirements
- mount 시 `fetchPets()`를 호출한다.
- `loading / success / empty / error` 상태를 실제 결과에서 파생한다.

## Constraints
- 선행 task: task-03.md, task-06.md
- 생성/수정 이동은 placeholder 수준으로 둔다.

## Done Criteria
- 반려동물 목록 화면이 실제 API 결과에 따라 상태를 바꾼다.

