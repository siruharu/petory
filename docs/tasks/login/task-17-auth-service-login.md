# Task 17

## Goal
로그인 실제 검증 로직을 AuthService에 추가한다.

## Files
- server/src/main/kotlin/com/petory/auth/AuthService.kt

## Requirements
- email 기준 사용자 조회를 추가한다.
- password hash 검증을 추가한다.
- 이메일 인증 완료 여부 검사를 추가한다.
- 성공 시 access token 발급을 추가한다.

## Constraints
- 선행 task: `task-05-user-entity-repository.md`, `task-09-password-encoder-config.md`, `task-10-jwt-token-provider.md`
- `/auth/me` 구현은 포함하지 않는다.

## Done Criteria
- login이 더 이상 UUID를 새로 만드는 가짜 응답이 아니라 실제 사용자 검증 기반으로 동작한다.

