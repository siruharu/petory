# Task 07: Schedule Notification Job Hook

## Goal

일정 생성/완료 이후 알림 job 생성 또는 정리 지점을 후속 확장 가능하도록 최소 구조로 연결한다.

## Files

- `server/src/main/kotlin/com/petory/schedule/ScheduleService.kt`
- `server/src/main/kotlin/com/petory/notification/NotificationRepository.kt`
- `server/src/main/kotlin/com/petory/notification/NotificationJobEntity.kt`
- 필요 시 notification service 관련 파일

## Requirements

- 일정 생성 후 알림 job을 만들거나, 최소한 생성 지점이 명확해야 한다
- 일정 완료 후 기존 schedule 알림 job 정리 기준이 있어야 한다
- 후속 알림 발송 구현이 붙기 쉬운 구조여야 한다

## Constraints

- 실제 push 발송 구현까지 확장하지 않는다
- 알림 정책을 임의로 크게 넓히지 않는다

## Done Criteria

- schedule 유스케이스와 notification job 사이 협력 지점이 코드상 명확하다
- 완료된 일정에 대한 불필요한 알림 job이 남지 않는 구조를 만들 수 있다
