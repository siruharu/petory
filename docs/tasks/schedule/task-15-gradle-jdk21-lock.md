# Task 15: Gradle JDK 21 Lock

## Goal

일정 모듈을 포함한 서버 검증이 JDK 26 기본 환경에 흔들리지 않도록 Gradle 실행 JVM을 21로 고정하는 기준을 정리하고 반영한다.

## Files

- `server/build.gradle.kts`
- 필요 시 `server/gradle.properties`
- 필요 시 관련 구현/가이드 문서

## Requirements

- Gradle 실행 JVM이 21로 고정되거나, 최소한 21 기준으로 재현 가능한 설정이 있어야 한다
- IntelliJ Gradle JVM과 CLI 실행 JVM 불일치 가능성을 문서 또는 설정으로 줄여야 한다
- daemon 재사용으로 다른 JDK가 물리는 상황을 줄일 수 있어야 한다

## Constraints

- 기술 스택 자체를 변경하지 않는다
- Kotlin/Gradle 대규모 업그레이드로 범위를 넓히지 않는다
- 로컬 개발자 환경을 파괴적으로 바꾸지 않는다

## Done Criteria

- 서버 `compileKotlin`/검증 단계가 JDK 21 기준으로 반복 가능해진다
- toolchain 21과 실제 실행 JVM 21 사이의 차이가 문서나 설정으로 닫힌다
