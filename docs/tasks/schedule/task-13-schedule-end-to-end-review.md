# Task 13: Schedule End To End Review

## Goal

일정 생성, 목록 조회, 완료, 홈 집계, 기록 연계까지 전체 흐름이 계획과 계약 기준으로 닫혔는지 검토하고 리뷰 문서를 갱신한다.

## Files

- `docs/plan-schedule.md`
- 필요 시 `docs/review.md`
- 필요 시 schedule 관련 후속 문서

## Requirements

- 반려동물 선택 기준 일정 조회 점검
- 일정 생성 후 목록/홈 반영 점검
- 일정 완료 후 record 생성 점검
- 반복 일정 `nextSchedule` 생성 점검
- 홈 `todaySchedules`, `overdueSchedules` 반영 점검
- 남은 리스크와 미해결 edge case를 문서에 반영

## Constraints

- 새로운 기능을 추가하지 않는다
- 검토 결과와 문서 정리 중심으로 수행한다

## Done Criteria

- 일정관리 구현 상태를 문서로 다시 확인할 수 있다
- 해결된 항목과 남은 리스크가 명확히 분리된다
