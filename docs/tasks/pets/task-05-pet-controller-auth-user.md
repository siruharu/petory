# Task 05: Pet Controller Auth User

## Goal

PetController가 인증 사용자 기준으로 service를 호출하도록 연결한다.

## Files

- `server/src/main/kotlin/com/petory/pet/PetController.kt`
- 필요 시 auth/current-user 관련 파일

## Requirements

- `GET /api/pets`, `POST /api/pets`, `PATCH /api/pets/{petId}`가 모두 current user 기준으로 동작해야 한다
- userId를 안전하게 service에 전달해야 한다
- 응답 계약은 그대로 유지해야 한다

## Constraints

- 기존 JWT 인증 구조를 따른다
- controller에서 비즈니스 로직을 늘리지 않는다
- 인증되지 않은 요청 처리 방식은 기존 security 설정을 따른다

## Done Criteria

- pet 관련 API가 사용자별 데이터 격리 전제로 동작한다
