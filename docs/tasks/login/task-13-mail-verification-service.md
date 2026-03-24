# Task 13

## Goal
이메일 인증 토큰 생성/검증 서비스 골격을 추가한다.

## Files
- server/src/main/kotlin/com/petory/auth/MailVerificationService.kt

## Requirements
- verification token 생성 메서드를 추가한다.
- token 만료 검사 메서드를 추가한다.
- used 상태 검사 메서드를 추가한다.

## Constraints
- 선행 task: `task-06-email-verification-entity-repository.md`, `task-08-auth-properties.md`
- 아직 AuthService 전체 연결은 하지 않는다.

## Done Criteria
- 이메일 인증 토큰 도메인 로직이 별도 서비스로 분리된다.

