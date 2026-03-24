# Task 26

## Goal
app의 signup 흐름을 이메일 인증 대기 구조로 바꾼다.

## Files
- app/src/features/auth/use-auth.ts

## Requirements
- signup이 더 이상 access token을 저장하지 않도록 바꾼다.
- signup response를 호출자에게 반환한다.
- verify-email / resend-verification API 함수 자리를 추가하거나 연결할 수 있게 정리한다.

## Constraints
- 선행 task: `task-25-app-auth-api-types.md`
- login token 저장 흐름은 유지한다.

## Done Criteria
- app auth 훅이 이메일 인증 포함 auth 플로우와 일치한다.

