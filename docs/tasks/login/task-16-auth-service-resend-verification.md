# Task 16

## Goal
인증 메일 재발송 로직을 AuthService에 추가한다.

## Files
- server/src/main/kotlin/com/petory/auth/AuthService.kt

## Requirements
- email로 사용자 조회 로직을 추가한다.
- 이미 인증된 계정 처리 정책을 반영한다.
- 새 verification token 생성 및 메일 재발송 경로를 추가한다.

## Constraints
- 선행 task: `task-14-auth-service-signup.md`
- 기존 token 정리 정책은 최소 수준으로 둔다.

## Done Criteria
- resend-verification API가 service 계층에서 호출 가능한 상태가 된다.

