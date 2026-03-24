# Task 06

## Goal
API 클라이언트에 bearer token 주입 구조를 추가한다.

## Files
- app/src/services/api/client.ts

## Requirements
- `Authorization: Bearer <token>` 헤더를 주입할 수 있는 구조를 추가한다.
- 공통 error/data envelope 처리를 유지한다.

## Constraints
- 선행 task: task-05.md
- 네트워크 retry/offline 처리는 포함하지 않는다.

## Done Criteria
- 인증이 필요한 API 호출에서 공통 헤더 주입이 가능해진다.

