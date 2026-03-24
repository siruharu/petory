# Task 23

## Goal
`/auth/me`를 실제 인증 사용자 기준 응답으로 연결한다.

## Files
- server/src/main/kotlin/com/petory/auth/AuthController.kt

## Requirements
- `Authentication` 또는 principal을 받아 service에 전달한다.
- 하드코딩된 TODO user 응답을 제거한다.

## Constraints
- 선행 task: `task-18-auth-controller-routes.md`, `task-22-auth-service-me.md`

## Done Criteria
- `/auth/me`가 TODO 응답이 아니라 current user 기반 응답을 반환한다.

