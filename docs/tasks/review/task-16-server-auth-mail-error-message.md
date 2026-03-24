# Task 16: Server Auth Mail Error Message

## Goal

회원가입/인증 메일 재전송 실패 시 내부 SMTP 예외를 그대로 노출하지 않도록 서버 응답 메시지 정책을 정리한다.

## Files

- `server/src/main/kotlin/com/petory/auth/AuthService.kt`
- `server/src/main/kotlin/com/petory/common/`

## Requirements

- 메일 발송 실패 시 서버 내부 로그와 클라이언트 노출 메시지를 분리
- `signup`, `resendVerification` 흐름에서 일반화된 예외 메시지 사용
- 현재 공통 에러 envelope 구조와 충돌하지 않도록 정리

## Constraints

- SMTP provider 교체는 하지 않는다
- 메일 인증 자체를 optional로 바꾸지 않는다

## Done Criteria

- 클라이언트는 내부 구현 세부사항이 아닌 일반화된 에러 메시지를 받는다
- 서버 내부에서는 원인 추적이 가능한 수준의 정보가 유지된다
