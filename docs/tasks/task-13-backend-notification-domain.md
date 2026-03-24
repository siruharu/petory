# Task 13: 알림 Domain/Migration 스켈레톤 추가

## Goal
푸시 토큰과 알림 작업 예약을 위한 도메인 구조와 마이그레이션 초안을 정리한다.

## Files
- server/src/main/kotlin/com/petory/notification/NotificationTokenEntity.kt
- server/src/main/kotlin/com/petory/notification/NotificationJobEntity.kt
- server/src/main/kotlin/com/petory/notification/NotificationRepository.kt
- server/src/main/resources/db/migration/V005__create_notification_tokens.sql
- server/src/main/resources/db/migration/V006__create_notification_jobs.sql

## Requirements
- 푸시 토큰 엔티티 스켈레톤을 추가한다.
- 일정 기반 알림 예약 엔티티 스켈레톤을 추가한다.
- 토큰/알림 작업 repository 인터페이스를 추가한다.

## Constraints
- 선행 task: task-02a-backend-runnable-bootstrap.md, task-07-backend-schedule-domain-repository.md
- 실제 스케줄러 구현은 하지 않는다.

## Done Criteria
- 알림 저장 구조가 파일 단위로 준비된다.
- 후속 알림 구현을 위한 domain 기반이 생긴다.
