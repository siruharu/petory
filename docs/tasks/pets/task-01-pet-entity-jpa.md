# Task 01: Pet Entity JPA

## Goal

현재 data class 수준인 반려동물 도메인 모델을 JPA 엔티티로 전환할 준비를 한다.

## Files

- `server/src/main/kotlin/com/petory/pet/PetEntity.kt`

## Requirements

- `pets` 테이블과 매핑 가능한 JPA 엔티티 구조여야 한다
- 기존 필드(`name`, `species`, `breed`, `sex`, `neuteredStatus`, `birthDate`, `ageText`, `weight`, `note`, `photoUrl`)를 유지해야 한다
- `userId`, `createdAt`, `updatedAt`를 persistence 기준으로 다룰 수 있어야 한다

## Constraints

- 계약 필드는 바꾸지 않는다
- 새로운 비즈니스 로직을 넣지 않는다
- 현재 DB migration과 충돌하지 않아야 한다

## Done Criteria

- `PetEntity`가 JPA persistence에 사용할 수 있는 형태가 된다
- 이후 repository 연결이 가능한 상태가 된다
