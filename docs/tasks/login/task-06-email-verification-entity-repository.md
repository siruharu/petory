# Task 06

## Goal
이메일 인증 토큰 JPA 엔티티와 리포지토리를 추가한다.

## Files
- server/src/main/kotlin/com/petory/user/EmailVerificationTokenEntity.kt
- server/src/main/kotlin/com/petory/user/EmailVerificationTokenRepository.kt

## Requirements
- verification token 테이블에 대응되는 엔티티를 추가한다.
- token 조회, userId 기준 조회가 가능한 리포지토리를 추가한다.
- `expiresAt`, `usedAt` 필드를 포함한다.

## Constraints
- 선행 task: `task-04-email-verification-token-migration.md`
- JPA 기준으로 작성한다.

## Done Criteria
- 이메일 인증 토큰 영속 모델과 조회 인터페이스가 준비된다.

