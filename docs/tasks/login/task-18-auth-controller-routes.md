# Task 18

## Goal
확장된 auth API route를 AuthController에 반영한다.

## Files
- server/src/main/kotlin/com/petory/auth/AuthController.kt

## Requirements
- signup route를 새 DTO 구조에 맞춘다.
- verify-email route를 추가한다.
- resend-verification route를 추가한다.
- login route를 새 DTO 구조에 맞춘다.

## Constraints
- 선행 task: `task-07-auth-dto-contract-update.md`, `task-14-auth-service-signup.md`, `task-15-auth-service-verify-email.md`, `task-16-auth-service-resend-verification.md`, `task-17-auth-service-login.md`
- `/auth/me` current user 주입은 별도 task에서 한다.

## Done Criteria
- auth controller가 계획한 public auth API들을 모두 노출한다.

