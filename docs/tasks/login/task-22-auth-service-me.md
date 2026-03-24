# Task 22

## Goal
current user 기반 `/auth/me` service 로직을 추가한다.

## Files
- server/src/main/kotlin/com/petory/auth/AuthService.kt

## Requirements
- principal에서 current user id를 읽는 경로를 추가한다.
- user 조회 후 `MeResponse`를 반환한다.
- 없는 user 또는 비정상 principal 처리 정책을 반영한다.

## Constraints
- 선행 task: `task-19-authenticated-user-model.md`, `task-05-user-entity-repository.md`
- controller 연결은 별도 task에서 한다.

## Done Criteria
- `/auth/me`가 실제 current user를 읽는 service 경로를 갖는다.

