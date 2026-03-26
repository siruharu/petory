# Implementation 05: Repository And JDK 21 Fix

작성일: 2026-03-25

## 범위

- Task 14
- Task 15

## 구현 내용

- `NotificationJobRepository`의 derived query 메서드명을 Spring Data JPA 규칙에 맞게 수정했다.
- pending notification job 조회는 `status`와 `sendAt` 필드 기준으로 해석 가능한 시그니처로 고정했다.
- `server/gradle.properties`에 `org.gradle.java.home`를 추가해 Gradle 실행 JVM을 Corretto 21로 고정했다.
- `docs/plan-schedule.md` 진행 상태에 task 14, 15 완료 표시를 추가했다.

## 주요 파일

- `server/src/main/kotlin/com/petory/notification/NotificationRepository.kt`
- `server/gradle.properties`
- `docs/plan-schedule.md`

## 검증

- 서버 Gradle daemon을 재시작한 뒤 JDK 21 기준으로 검증이 가능해야 한다.
