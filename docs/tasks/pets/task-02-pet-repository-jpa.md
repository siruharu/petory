# Task 02: Pet Repository JPA

## Goal

반려동물 저장/조회에 사용할 Spring Data JPA repository를 만든다.

## Files

- `server/src/main/kotlin/com/petory/pet/PetRepository.kt`

## Requirements

- 사용자별 반려동물 목록 조회 메서드가 있어야 한다
- `id + userId` 기준 단건 조회가 가능해야 한다
- 생성/수정 저장에 사용할 `save` 경로가 있어야 한다

## Constraints

- 사용자 격리 전제를 유지한다
- 쿼리 메서드는 현재 필요한 최소 범위로 제한한다
- 새로운 custom infra는 추가하지 않는다

## Done Criteria

- `PetService`가 실제 persistence를 호출할 수 있는 repository가 준비된다
