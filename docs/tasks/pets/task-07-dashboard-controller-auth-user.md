# Task 07: Dashboard Controller Auth User

## Goal

DashboardController가 인증 사용자 기준으로 홈 집계 service를 호출하도록 연결한다.

## Files

- `server/src/main/kotlin/com/petory/dashboard/DashboardController.kt`
- 필요 시 auth/current-user 관련 파일

## Requirements

- `GET /api/dashboard/home`이 current user 기준으로 동작해야 한다
- `petId` query는 유지해야 한다
- 응답 구조는 기존 계약을 유지해야 한다

## Constraints

- security 구조는 기존 흐름을 따른다
- controller에서 집계 로직을 직접 넣지 않는다
- 일정/기록 미구현 상태를 유지할 수 있다

## Done Criteria

- 홈 API가 로그인 사용자 기준 데이터만 조회한다
