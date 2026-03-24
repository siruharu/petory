# Task 08

## Goal
인증 훅 `useAuth`를 실제 submit 흐름 중심으로 정리한다.

## Files
- app/src/features/auth/use-auth.ts

## Requirements
- `login`, `signup`, `logout` 흐름을 유지한다.
- submit/loading/error 상태를 정리한다.
- access token 저장과 provider 상태 갱신이 실제로 연결되게 한다.

## Constraints
- 선행 task: task-05.md, task-06.md, task-07.md
- form validation 라이브러리 도입은 하지 않는다.

## Done Criteria
- 화면이 `useAuth`만으로 인증 요청을 실행할 수 있다.

