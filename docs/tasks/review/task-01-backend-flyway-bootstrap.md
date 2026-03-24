# Task 01: Backend Flyway Bootstrap

## Goal

서버가 migration SQL을 실제로 실행할 수 있도록 migration runner 베이스를 추가한다.

## Files

- `server/build.gradle.kts`
- `server/src/main/resources/application.yml`

## Requirements

- Flyway 의존성 추가
- H2 file mode에서 startup 시 migration이 실행되는 기본 구성을 추가
- `ddl-auto: validate`와 migration 실행 순서가 충돌하지 않도록 설정 정리

## Constraints

- 엔티티 구조는 이 task에서 바꾸지 않는다
- migration SQL 본문은 이 task에서 수정하지 않는다

## Done Criteria

- 서버가 migration runner를 인식한다
- startup 시 `db/migration`을 실행할 수 있는 설정이 준비된다

