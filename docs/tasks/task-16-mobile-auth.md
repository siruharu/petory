# Task 16: 모바일 인증 화면/서비스 정리

## Goal
로그인/회원가입 화면과 인증 API 호출 스켈레톤을 정리한다.

## Files
- app/src/screens/auth/login-screen.tsx
- app/src/screens/auth/signup-screen.tsx
- app/src/features/auth/use-auth.ts
- app/src/services/api/client.ts
- app/src/services/storage/session-storage.ts

## Requirements
- 로그인 화면 skeleton
- 회원가입 화면 skeleton
- 인증 훅 또는 컨텍스트 연결 지점 정리
- 세션 토큰 저장 함수 자리를 둔다.

## Constraints
- 선행 task: task-01-api-contract.md, task-15-mobile-app-bootstrap.md, task-03-backend-auth-controller-dto.md
- 실제 폼 검증과 네트워크 에러 처리 로직은 최소 수준으로 둔다.

## Done Criteria
- 인증 화면에서 API 계약 기준 요청 구조를 사용할 준비가 된다.
- loading/success/error 상태를 넣을 자리 구조가 보인다.

