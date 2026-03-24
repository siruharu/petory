# Task 07

## Goal
`AuthProvider`의 bootstrap 로직을 토큰 기반 사용자 복구 흐름으로 보완한다.

## Files
- app/src/app/providers/auth-provider.tsx
- app/src/types/api.ts

## Requirements
- 저장된 access token을 읽는다.
- token이 있으면 `/auth/me` 응답 타입을 사용할 수 있게 한다.
- bootstrap 성공 시 `user`와 `status`를 함께 갱신한다.

## Constraints
- 선행 task: task-05.md, task-06.md
- 실제 네트워크 실패 재시도는 넣지 않는다.

## Done Criteria
- 앱 재시작 시 토큰 기반 user 복구 흐름이 구조적으로 닫힌다.

