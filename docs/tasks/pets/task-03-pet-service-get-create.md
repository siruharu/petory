# Task 03: Pet Service Get Create

## Goal

반려동물 조회/생성 로직을 실제 persistence 기반으로 연결한다.

## Files

- `server/src/main/kotlin/com/petory/pet/PetService.kt`

## Requirements

- `getPets(userId)`가 실제 DB 목록을 반환해야 한다
- `createPet(userId, request)`가 실제 저장 후 저장 결과를 반환해야 한다
- DTO 응답 구조는 기존 계약을 유지해야 한다

## Constraints

- 수정 로직은 다음 task로 분리한다
- request/response 필드를 바꾸지 않는다
- 인증 사용자 식별자는 service 인자로 받는 구조를 따른다

## Done Criteria

- 반려동물 생성 결과가 persistence에 남는다
- 같은 사용자 기준 목록 조회가 가능하다
