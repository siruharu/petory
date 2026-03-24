# Task 03: 인증 Controller/DTO 정리

## Goal
회원가입, 로그인, 현재 사용자 조회를 위한 인증 DTO와 Controller 스켈레톤을 계약 기준으로 정리한다.

## Files
- server/src/main/kotlin/com/petory/auth/AuthController.kt
- server/src/main/kotlin/com/petory/auth/AuthDtos.kt

## Requirements
- signup/login/me 엔드포인트 시그니처를 확정한다.
- 요청 DTO와 응답 DTO를 명시적으로 분리한다.
- `docs/api-contract.md`와 필드명을 맞춘다.

## Constraints
- 선행 task: task-02a-backend-runnable-bootstrap.md
- 실제 인증 검증 로직은 구현하지 않는다.

## Done Criteria
- 인증 관련 DTO가 명시적 클래스로 정리되어 있다.
- AuthController가 계약에 맞는 엔드포인트 골격을 가진다.
