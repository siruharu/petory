# Task 24

## Goal
푸시 토큰 서버 동기화와 logout 시 토큰 정리 흐름을 연결한다.

## Files
- app/src/services/notifications/push-service.ts
- app/src/screens/settings/settings-screen.tsx
- app/src/features/notifications/notification-api.ts

## Requirements
- 토큰 등록 응답의 `tokenId` 저장 방식을 정리한다.
- 삭제 API 호출 흐름을 연결한다.
- logout 시 토큰 삭제를 수행할 자리를 만든다.

## Constraints
- 선행 task: task-22.md, task-23.md
- 중복 토큰 정리 정책은 최소 수준으로 둔다.

## Done Criteria
- 토큰 등록과 제거 흐름이 실제 앱 이벤트와 연결된다.

