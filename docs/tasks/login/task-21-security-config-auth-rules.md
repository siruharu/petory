# Task 21

## Goal
auth 관련 security rule과 JWT filter 연결을 정리한다.

## Files
- server/src/main/kotlin/com/petory/config/SecurityConfig.kt

## Requirements
- `signup`, `verify-email`, `resend-verification`, `login`만 permitAll로 둔다.
- `/api/auth/me`를 authenticated로 전환한다.
- JWT filter를 security chain에 연결한다.
- stateless 설정을 유지한다.

## Constraints
- 선행 task: `task-09-password-encoder-config.md`, `task-20-jwt-authentication-filter.md`
- CORS는 별도 task에서 다룬다.

## Done Criteria
- security chain이 auth API 의도와 일치한다.

