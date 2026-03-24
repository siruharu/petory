# Task 15

## Goal
이메일 인증 완료 로직을 AuthService에 추가한다.

## Files
- server/src/main/kotlin/com/petory/auth/AuthService.kt

## Requirements
- verification token 조회 로직을 추가한다.
- 만료/사용 완료 token 검증을 추가한다.
- 사용자 `emailVerified=true` 업데이트를 추가한다.
- verify-email 응답 구조를 맞춘다.

## Constraints
- 선행 task: `task-13-mail-verification-service.md`, `task-14-auth-service-signup.md`
- 로그인 로직은 포함하지 않는다.

## Done Criteria
- verify-email service 경로가 계획한 응답 구조를 반환할 수 있다.

