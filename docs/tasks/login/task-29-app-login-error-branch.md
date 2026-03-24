# Task 29

## Goal
로그인 화면에서 인증 미완료/인증 실패 메시지를 분기한다.

## Files
- app/src/screens/auth/login-screen.tsx
- app/src/features/auth/use-auth.ts

## Requirements
- invalid credential 메시지를 정리한다.
- 이메일 인증 미완료 메시지를 분기한다.
- 제출 중 버튼 비활성화 또는 중복 제출 방지 구조를 보강한다.

## Constraints
- 선행 task: `task-17-auth-service-login.md`, `task-26-app-use-auth-signup-flow.md`
- 화면 구조 자체는 크게 바꾸지 않는다.

## Done Criteria
- 로그인 실패 메시지가 서버 auth 상태와 더 잘 대응한다.

