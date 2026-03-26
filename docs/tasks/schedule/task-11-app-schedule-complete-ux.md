# Task 11: App Schedule Complete UX

## Goal

일정 완료 버튼의 중복 제출 방지, completing 상태 표시, 실패 처리 UX를 안정화한다.

## Files

- `app/src/screens/schedules/schedule-list-screen.tsx`
- `app/src/components/cards/schedule-card.tsx`

## Requirements

- 완료 처리 중인 일정 버튼은 중복 클릭이 막혀야 한다
- 완료 중 상태가 카드에 명확히 표시돼야 한다
- 완료 실패 시 기존 목록을 유지하면서 오류를 보여줘야 한다
- 완료 성공 후 refresh 흐름이 자연스럽게 이어져야 한다

## Constraints

- 일정 완료 API 구조를 바꾸지 않는다
- 디자인 전면 개편으로 범위를 넓히지 않는다

## Done Criteria

- 완료 버튼 연타로 중복 요청이 발생하지 않는다
- 실패 시 목록 화면이 불필요하게 전체 error로 무너지지 않는다
