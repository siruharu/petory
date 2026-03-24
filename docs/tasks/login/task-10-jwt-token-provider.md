# Task 10

## Goal
JWT 발급/검증/subject 추출 로직을 실제 구현 수준으로 바꾼다.

## Files
- server/src/main/kotlin/com/petory/auth/JwtTokenProvider.kt

## Requirements
- secret 기반 JWT 발급을 구현한다.
- expiration을 포함한다.
- token 검증 로직을 추가한다.
- userId(subject) 추출 로직을 추가한다.

## Constraints
- 선행 task: `task-08-auth-properties.md`
- 아직 security filter 연결은 하지 않는다.

## Done Criteria
- 더 이상 `TODO_ACCESS_TOKEN_FOR_*` 문자열이 아니라 실제 JWT 처리기가 된다.

