# Task 14: Notification Job Repository Fix

## Goal

일정 알림 job 연계 과정에서 Spring Data JPA derived query 메서드명을 엔티티 필드 규칙에 맞게 수정해 서버 기동 blocker를 제거한다.

## Files

- `server/src/main/kotlin/com/petory/notification/NotificationRepository.kt`
- `server/src/main/kotlin/com/petory/notification/NotificationService.kt`
- 필요 시 `server/src/main/kotlin/com/petory/schedule/ScheduleService.kt`

## Requirements

- `NotificationJobRepository` 메서드명이 Spring Data JPA 파싱 규칙에 맞아야 한다
- pending job 조회는 `status`, `sendAt` 필드 기준으로 명시돼야 한다
- notification service 호출부와 repository 시그니처가 일치해야 한다
- schedule service의 알림 hook 흐름과 충돌하지 않아야 한다

## Constraints

- 새로운 notification 구조를 만들지 않는다
- 실제 push 발송 구현까지 확장하지 않는다
- 현재 엔티티 필드 구조 안에서 해결한다

## Done Criteria

- 서버가 notification job repository bean 생성 오류 없이 기동된다
- schedule/notification 연계 코드가 Spring Data 규칙을 어기지 않는다
