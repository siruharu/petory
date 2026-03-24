# Task 11: 기록 Controller/Service 정리

## Goal
기록 목록 조회와 기록 생성 API의 Controller/Service/DTO 스켈레톤을 정리한다.

## Files
- server/src/main/kotlin/com/petory/record/RecordController.kt
- server/src/main/kotlin/com/petory/record/RecordService.kt
- server/src/main/kotlin/com/petory/record/RecordDtos.kt

## Requirements
- GET /api/records
- POST /api/records
- petId 필터 시그니처 지원
- 병원 방문 메모용 type 처리 자리를 둔다.

## Constraints
- 선행 task: task-10-backend-record-domain-repository.md
- 타임라인 정렬의 상세 구현은 하지 않는다.

## Done Criteria
- 기록 API 골격이 준비된다.
- DTO와 서비스 메서드가 계약 기준으로 정리된다.
