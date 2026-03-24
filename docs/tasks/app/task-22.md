# Task 22

## Goal
설정 화면에 로그아웃과 푸시 권한/토큰 동기화 진입점을 추가한다.

## Files
- app/src/screens/settings/settings-screen.tsx
- app/src/features/auth/use-auth.ts
- app/src/services/notifications/push-service.ts

## Requirements
- 로그아웃 버튼을 추가한다.
- 푸시 권한 요청/토큰 등록 시작 버튼 자리를 둔다.
- 상태 메시지 자리를 둔다.

## Constraints
- 선행 task: task-08.md, task-24-mobile-notification-service.md
- 실제 UI polish는 최소 수준으로 둔다.

## Done Criteria
- 설정 화면이 세션 종료와 알림 설정의 진입점 역할을 한다.

