# Task 02A: 백엔드 실행 가능 베이스라인 복구

## Goal
현재 실행 불가능한 Kotlin Spring Boot 서버를 최소 부팅 가능한 프로젝트 구조로 정리한다.

## Files
- server/build.gradle.kts
- server/settings.gradle.kts
- server/gradle.properties
- server/src/main/kotlin/com/petory/PetoryApplication.kt
- server/src/main/resources/application.yml

## Requirements
- Kotlin + Spring Boot 프로젝트를 위한 Gradle 설정 파일을 추가한다.
- Spring Boot, Kotlin, Web, Validation, Security 등 최소 의존성 구성을 정의한다.
- 메인 애플리케이션 클래스와 패키지 경로가 빌드 구조와 맞도록 정리한다.
- 기본 실행 프로필 또는 최소 설정값을 정리한다.

## Constraints
- 선행 task: task-01-api-contract.md, task-02-backend-common-response.md
- 상세 비즈니스 로직은 구현하지 않는다.
- DB 연결, 실제 배포 설정, 운영 환경 설정은 최소 수준으로 둔다.

## Done Criteria
- `server`가 실행 가능한 Spring Boot 프로젝트 골격을 가진다.
- 이후 auth/pet/schedule/record task가 동일한 실행 베이스라인 위에서 진행 가능하다.

