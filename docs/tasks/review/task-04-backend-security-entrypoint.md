# Task 04: Backend Security Entrypoint

## Goal

비인증/권한 부족 응답을 `docs/api-contract.md`와 일치하도록 고정한다.

## Files

- `server/src/main/kotlin/com/petory/config/SecurityConfig.kt`
- `server/src/main/kotlin/com/petory/common/`

## Requirements

- `UNAUTHORIZED` 응답 entry point 추가
- `FORBIDDEN` 응답 handler 추가
- JSON envelope가 공통 에러 구조를 따르도록 정리

## Constraints

- 비즈니스 예외 매핑 전체를 재설계하지 않는다
- JWT filter 로직 자체는 최소 수정에 그친다

## Done Criteria

- 보호 API에 인증 없이 접근하면 계약 문서 형태의 `UNAUTHORIZED` 응답이 반환된다
- 권한 부족 시 `FORBIDDEN` 응답이 반환된다

