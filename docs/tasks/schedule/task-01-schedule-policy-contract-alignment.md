# Task 01: Schedule Policy And Contract Alignment

## Goal

일정관리 구현 전에 overdue 계산, 반복 일정 next schedule 기준, schedule type -> record type 매핑, 홈/목록 refresh 정책을 문서 기준으로 먼저 확정한다.

## Files

- `docs/plan-schedule.md`
- `docs/research-schedule.md`
- `docs/api-contract.md`

## Requirements

- overdue를 조회 시 계산으로 볼지 저장 상태 승격으로 볼지 기준을 확정한다
- `nextSchedule` 계산 기준을 `dueAt` 기준으로 할지 `completedAt` 기준으로 할지 확정한다
- `ScheduleType`과 `RecordType` 불일치에 대한 매핑 정책을 명시한다
- 홈 일정과 일정 목록이 어떤 refresh 기준을 따를지 정리한다

## Constraints

- 명시적 승인 없는 계약 변경은 하지 않는다
- 구현에 들어가기 전 정책과 계약 정합성만 정리한다

## Done Criteria

- 후속 구현자가 일정 상태/반복/기록 연계 정책을 문서만 보고 구현할 수 있다
- 계약 변경이 필요한 항목과 아닌 항목이 분리돼 있다
