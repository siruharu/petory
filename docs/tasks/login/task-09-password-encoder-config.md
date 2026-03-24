# Task 09

## Goal
비밀번호 해시를 위한 PasswordEncoder bean을 추가한다.

## Files
- server/src/main/kotlin/com/petory/config/SecurityConfig.kt

## Requirements
- `PasswordEncoder` bean을 추가한다.
- BCrypt 기반 인코더를 사용한다.

## Constraints
- 선행 task: `task-01-server-auth-dependencies.md`
- 인증 필터 연결까지는 포함하지 않는다.

## Done Criteria
- AuthService가 비밀번호 인코딩/검증에 사용할 bean이 준비된다.

