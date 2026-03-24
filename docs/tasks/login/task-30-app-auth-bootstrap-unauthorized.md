# Task 30

## Goal
`/auth/me` 401 응답 시 앱 bootstrap을 anonymous 상태로 복구한다.

## Files
- app/src/app/providers/auth-provider.tsx

## Requirements
- `/auth/me` 401 시 token을 지우고 `status='success'`로 복구한다.
- 네트워크 장애와 인증 실패를 구분한다.

## Constraints
- 선행 task: `task-23-auth-controller-me.md`
- 루트 네비게이터 구조는 유지한다.

## Done Criteria
- 만료/무효 token이 앱 전체 에러 상태를 만들지 않는다.

