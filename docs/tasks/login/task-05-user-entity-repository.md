# Task 05

## Goal
사용자 JPA 엔티티와 리포지토리를 추가한다.

## Files
- server/src/main/kotlin/com/petory/user/UserEntity.kt
- server/src/main/kotlin/com/petory/user/UserRepository.kt

## Requirements
- users 테이블에 대응되는 엔티티를 추가한다.
- email 조회, id 조회가 가능한 리포지토리를 추가한다.
- `emailVerified` 필드를 모델에 포함한다.

## Constraints
- 선행 task: `task-03-users-migration.md`
- JPA 기준으로 작성한다.
- 비즈니스 로직은 넣지 않는다.

## Done Criteria
- 사용자 영속 모델과 조회 인터페이스가 준비된다.

