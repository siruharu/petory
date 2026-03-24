# Task 14: 알림 토큰 API 스켈레톤 정리

## Goal
모바일 푸시 토큰 등록/삭제 API의 Controller/Service/DTO 스켈레톤을 정리한다.

## Files
- server/src/main/kotlin/com/petory/notification/NotificationController.kt
- server/src/main/kotlin/com/petory/notification/NotificationService.kt
- server/src/main/kotlin/com/petory/notification/NotificationDtos.kt

## Requirements
- POST /api/notifications/tokens
- DELETE /api/notifications/tokens/:tokenId
- deviceType, pushToken DTO를 명시적으로 둔다.

## Constraints
- 선행 task: task-13-backend-notification-domain.md
- 실제 푸시 발송 연동은 구현하지 않는다.

## Done Criteria
- 모바일 앱이 토큰을 등록할 수 있는 API 골격이 준비된다.
