# Task 19

## Goal
SecurityContext에 저장할 authenticated user principal 모델을 추가한다.

## Files
- server/src/main/kotlin/com/petory/auth/AuthenticatedUser.kt

## Requirements
- current user id와 email을 표현할 모델을 추가한다.
- JWT filter와 `/auth/me`에서 공통으로 사용할 수 있게 설계한다.

## Constraints
- 선행 task: `task-05-user-entity-repository.md`
- principal 모델만 추가한다.

## Done Criteria
- 인증된 사용자 표현 모델이 별도 파일로 존재한다.

