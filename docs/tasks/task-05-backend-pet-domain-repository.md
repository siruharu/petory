# Task 05: 반려동물 Domain/Repository 스켈레톤 추가

## Goal
여러 반려동물 지원을 전제로 반려동물 domain/entity와 repository 스켈레톤을 정리한다.

## Files
- server/src/main/kotlin/com/petory/pet/PetEntity.kt
- server/src/main/kotlin/com/petory/pet/PetRepository.kt
- server/src/main/resources/db/migration/V002__create_pets.sql

## Requirements
- 반려동물 엔티티 필드를 plan 기준으로 정리한다.
- 사용자 1명 대 반려동물 N 구조를 반영한다.
- repository 인터페이스 스켈레톤을 추가한다.
- pets 테이블 마이그레이션 초안 주석 또는 컬럼 구조를 정리한다.

## Constraints
- 선행 task: task-02a-backend-runnable-bootstrap.md
- DB 세부 제약과 인덱스는 최소 범위만 다룬다.

## Done Criteria
- 반려동물 저장 구조의 기본 파일이 준비된다.
- 이후 service/controller가 repository를 참조할 수 있다.
