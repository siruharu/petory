# 일정관리 구현 리뷰

작성일: 2026-03-25  
기준 문서: `docs/plan-schedule.md`, `docs/research-schedule.md`

## Findings

### 1. `NotificationJobRepository` 메서드명이 Spring Data 파싱 규칙에 맞지 않음

관련 파일:

- `server/src/main/kotlin/com/petory/notification/NotificationRepository.kt`

문제:

- `findPendingJobsBefore(sendAt: OffsetDateTime)`는 Spring Data JPA derived query 규칙에 맞지 않는다.
- Spring은 이를 `findPendingJobs`라는 존재하지 않는 프로퍼티를 찾는 메서드로 해석해 애플리케이션 시작 시 bean 생성에 실패한다.

실제 증상:

- `No property 'findPendingJobs' found for type 'NotificationJobEntity'`
- `dashboardService -> scheduleService -> notificationService -> notificationJobRepository` 순으로 의존성이 전파되며 앱이 기동되지 않는다.

수정 방향:

- 메서드명을 엔티티 필드 기준으로 바꿔야 한다.
- 권장 예시:
  - `findAllByStatusAndSendAtLessThanEqual(...)`
  - 필요 시 `OrderBySendAtAsc` 추가

영향 범위:

- notification repository
- notification service 호출부
- schedule service의 notification hook 경로

### 2. 서버 검증 환경이 JDK 26을 물고 있어 Kotlin 1.9.25가 컴파일 단계에서 실패할 수 있음

관련 파일:

- `server/build.gradle.kts`
- 필요 시 `server/gradle.properties`

문제:

- `build.gradle.kts`에는 toolchain 21이 명시돼 있어도, 실제 Gradle/Kotlin daemon이 JDK 26으로 뜨면 Kotlin compiler가 `JavaVersion.parse(26)`에서 실패할 수 있다.
- 이 문제는 코드 오류가 아니라 빌드 실행 JVM 문제다.

실제 증상:

- `java.lang.IllegalArgumentException: 26`
- `:compileKotlin FAILED`

수정 방향:

- Gradle 실행 JVM을 21로 고정해야 한다.
- 권장 대응:
  - `server/gradle.properties`에 `org.gradle.java.home=.../corretto-21...` 추가
  - 기존 daemon 정리 후 재실행
  - IntelliJ의 Gradle JVM도 21인지 재확인

영향 범위:

- 서버 전체 빌드/테스트 검증
- 일정 모듈뿐 아니라 전체 Kotlin 컴파일 안정성

## Open Questions

- `findPendingJobsBefore(...)`가 현재 실제 호출 경로에서 필요한 조회인지, 아니면 더 구체적인 `status + sendAt` 조건으로 고정할지 결정이 필요하다.
- JDK 21 고정을 프로젝트 공통 `gradle.properties`에 둘지, 로컬 개발 환경 가이드로만 둘지 정해야 한다.

## Summary

현재 일정관리 구현의 직접적인 기동 blocker는 notification repository 메서드명 오류다.  
추가로 서버 검증 안정성을 위해 Gradle/JDK 21 고정이 필요하다.
