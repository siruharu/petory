# Task 07

## Goal
이메일 인증 포함 auth DTO 구조를 재정의한다.

## Files
- server/src/main/kotlin/com/petory/auth/AuthDtos.kt

## Requirements
- signup request/response DTO를 분리한다.
- login request/response DTO를 분리한다.
- verify-email request/response DTO를 추가한다.
- resend-verification request/response DTO를 추가한다.
- `AuthUserDto`에 `emailVerified`를 포함할지 여부를 계획과 일치시킨다.

## Constraints
- 선행 task: 없음
- `docs/plan-login.md` 기준 구조를 따른다.
- 아직 controller/service 연결은 최소 수준으로 둔다.

## Done Criteria
- auth API별 명시적 DTO가 파일 수준에서 정리된다.

