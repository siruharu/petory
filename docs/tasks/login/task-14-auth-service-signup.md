# Task 14

## Goal
회원가입 실제 로직을 구현할 수 있는 구조로 AuthService를 수정한다.

## Files
- server/src/main/kotlin/com/petory/auth/AuthService.kt

## Requirements
- email 중복 체크를 추가한다.
- password hash 저장 경로를 추가한다.
- `emailVerified=false` 사용자 생성 로직을 추가한다.
- verification token 생성 및 메일 발송 호출 자리를 추가한다.
- signup 응답을 email verification 기반 구조로 바꾼다.

## Constraints
- 선행 task: `task-05-user-entity-repository.md`, `task-09-password-encoder-config.md`, `task-12-smtp-mail-adapter.md`, `task-13-mail-verification-service.md`
- 로그인 토큰 발급은 넣지 않는다.

## Done Criteria
- signup이 더 이상 즉시 로그인 응답이 아니라 인증 대기 흐름을 반환한다.

