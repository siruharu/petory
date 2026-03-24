# Task 25

## Goal
이메일 인증 포함 auth API 타입을 app 쪽에 반영한다.

## Files
- app/src/types/api.ts
- app/src/types/domain.ts

## Requirements
- signup response 타입을 재정의한다.
- verify-email / resend-verification 타입을 추가한다.
- user에 `emailVerified` 필드를 반영한다.

## Constraints
- 선행 task: `task-07-auth-dto-contract-update.md`
- 아직 화면 연결은 하지 않는다.

## Done Criteria
- app이 새 auth API 계약을 타입 수준에서 이해할 수 있다.

