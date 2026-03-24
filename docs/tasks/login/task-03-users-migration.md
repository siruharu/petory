# Task 03

## Goal
users 테이블 마이그레이션을 작성한다.

## Files
- server/src/main/resources/db/migration/V001__create_users.sql

## Requirements
- `users` 테이블을 생성한다.
- `email_verified` 컬럼을 포함한다.
- `email` unique index를 추가한다.
- 생성/수정 시각 컬럼을 포함한다.

## Constraints
- 선행 task: `task-02-auth-application-config.md`
- H2 호환 SQL로 작성한다.

## Done Criteria
- users persistence에 필요한 최소 스키마가 마이그레이션으로 정의된다.

