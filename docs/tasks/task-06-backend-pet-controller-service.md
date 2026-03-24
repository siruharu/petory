# Task 06: 반려동물 Controller/Service 정리

## Goal
반려동물 목록, 생성, 수정 API의 Controller/Service 스켈레톤을 정리한다.

## Files
- server/src/main/kotlin/com/petory/pet/PetController.kt
- server/src/main/kotlin/com/petory/pet/PetService.kt
- server/src/main/kotlin/com/petory/pet/PetDtos.kt

## Requirements
- GET /api/pets
- POST /api/pets
- PATCH /api/pets/:petId
- DTO와 응답 형식을 `docs/api-contract.md`와 맞춘다.

## Constraints
- 선행 task: task-05-backend-pet-domain-repository.md
- 상세 CRUD 로직은 placeholder 수준으로 유지한다.

## Done Criteria
- 반려동물 API의 엔드포인트 골격이 준비된다.
- 다중 반려동물 전제가 DTO와 서비스 시그니처에 반영된다.
