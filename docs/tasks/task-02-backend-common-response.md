# Task 02: 백엔드 공통 응답/에러 구조 정리

## Goal
Spring Boot 서버에서 사용할 공통 성공 응답과 에러 응답 스켈레톤을 정리한다.

## Files
- server/src/main/kotlin/com/petory/common/ApiResponse.kt
- server/src/main/kotlin/com/petory/common/ErrorResponse.kt
- server/src/main/kotlin/com/petory/common/GlobalExceptionHandler.kt

## Requirements
- 성공 응답 래퍼를 유지하거나 정리한다.
- 에러 응답 DTO를 추가한다.
- 전역 예외 핸들러 스켈레톤을 추가한다.
- `docs/api-contract.md`의 공통 응답 구조와 맞춘다.

## Constraints
- 선행 task: task-01-api-contract.md
- 상세 예외 매핑 로직은 최소 수준으로 둔다.
- 실제 비즈니스 예외 구현은 하지 않는다.

## Done Criteria
- 공통 성공/실패 응답 구조 파일이 존재한다.
- 컨트롤러가 같은 응답 규칙을 따를 수 있는 기반이 준비된다.

