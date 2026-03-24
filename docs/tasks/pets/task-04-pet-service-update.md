# Task 04: Pet Service Update

## Goal

반려동물 수정 로직을 실제 persistence 기반으로 연결한다.

## Files

- `server/src/main/kotlin/com/petory/pet/PetService.kt`

## Requirements

- `updatePet(userId, petId, request)`가 기존 entity를 찾아 patch 적용해야 한다
- `id + userId` 기준으로만 수정되어야 한다
- 수정 후 응답은 최신 저장 결과를 반환해야 한다

## Constraints

- partial update 범위를 현재 DTO 기준으로만 다룬다
- 사용자 권한 검사를 service에서 누락하지 않는다
- 불필요한 validation 확장은 하지 않는다

## Done Criteria

- 반려동물 수정이 실제 DB 반영으로 이어진다
- 다른 사용자 pet 수정이 불가능하다
