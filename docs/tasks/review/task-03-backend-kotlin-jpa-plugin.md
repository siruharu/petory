# Task 03: Backend Kotlin JPA Plugin

## Goal

Kotlin JPA 엔티티가 런타임에서 안정적으로 동작하도록 JPA 플러그인 또는 동등한 구성을 추가한다.

## Files

- `server/build.gradle.kts`

## Requirements

- Kotlin JPA plugin 추가 또는 no-arg/open 대응
- 현재 `UserEntity`, `EmailVerificationTokenEntity` 기준 Hibernate 경고를 줄일 수 있는 설정 반영

## Constraints

- 엔티티 필드 구조 자체는 바꾸지 않는다
- 다른 도메인 엔티티 리팩토링은 하지 않는다

## Done Criteria

- Kotlin JPA 엔티티 생성 관련 기본 구성이 빌드 설정에 반영된다

