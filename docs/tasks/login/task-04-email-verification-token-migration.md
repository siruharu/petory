# Task 04

## Goal
이메일 인증 토큰 테이블 마이그레이션을 추가한다.

## Files
- server/src/main/resources/db/migration/V007__create_email_verification_tokens.sql

## Requirements
- `email_verification_tokens` 테이블을 생성한다.
- `user_id`, `token`, `expires_at`, `used_at` 컬럼을 포함한다.
- `token` unique index를 추가한다.

## Constraints
- 선행 task: `task-03-users-migration.md`
- H2 호환 SQL로 작성한다.

## Done Criteria
- 이메일 인증 토큰 저장용 스키마가 준비된다.

