# Task 12: 홈 집계 API 스켈레톤 정리

## Goal
홈 화면에서 사용할 집계 응답 구조와 Controller/Service 스켈레톤을 정리한다.

## Files
- server/src/main/kotlin/com/petory/dashboard/DashboardController.kt
- server/src/main/kotlin/com/petory/dashboard/DashboardService.kt
- server/src/main/kotlin/com/petory/dashboard/DashboardDtos.kt

## Requirements
- GET /api/dashboard/home 응답 구조를 확정한다.
- selectedPet, pets, todaySchedules, overdueSchedules, recentRecords 필드를 포함한다.
- 여러 반려동물 전환을 고려한 petId query 시그니처를 둔다.

## Constraints
- 선행 task: task-06-backend-pet-controller-service.md, task-08-backend-schedule-create-list.md, task-11-backend-record-controller-service.md
- 집계 쿼리의 실제 구현은 하지 않는다.

## Done Criteria
- 홈 화면이 기대하는 서버 응답 골격이 준비된다.
- 프론트 홈 화면 작업이 이 API 계약을 기준으로 진행 가능하다.
