# Task 05: Backend Auth Transaction Boundary

## Goal

signup / resend verification 흐름의 부분 실패 리스크를 줄이기 위한 transaction 및 실패 처리 기준을 구현한다.

## Files

- `server/src/main/kotlin/com/petory/auth/AuthService.kt`
- 관련 config 또는 common 예외 파일

## Requirements

- signup과 resend 흐름에서 user/token 저장과 mail 발송 실패 전략 정리
- 재시도 가능한 실패와 영구 실패를 구분할 최소 구조 추가
- 최소한 “가입 실패처럼 보였지만 user는 남는 상태”를 줄이는 방향으로 수정

## Constraints

- 메일 발송 provider 교체는 하지 않는다
- refresh token 같은 인증 범위 확장은 하지 않는다

## Done Criteria

- signup / resend의 부분 실패 리스크가 문서 기준보다 줄어든다

