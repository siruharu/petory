# Task 20

## Goal
Bearer token 검증 필터를 추가한다.

## Files
- server/src/main/kotlin/com/petory/auth/JwtAuthenticationFilter.kt

## Requirements
- `Authorization` 헤더를 읽는다.
- `Bearer` token을 검증한다.
- userId를 추출한다.
- user 조회 후 `SecurityContext`에 principal을 넣는다.

## Constraints
- 선행 task: `task-05-user-entity-repository.md`, `task-10-jwt-token-provider.md`, `task-19-authenticated-user-model.md`
- SecurityConfig 연결은 별도 task로 둔다.

## Done Criteria
- JWT 기반 current user 주입 필터가 준비된다.

