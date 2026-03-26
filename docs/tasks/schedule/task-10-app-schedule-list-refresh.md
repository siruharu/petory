# Task 10: App Schedule List Refresh

## Goal

일정 목록 화면이 서버 일정 데이터 기준으로 loading/success/empty/error/refreshing 상태를 안정적으로 처리하도록 보강한다.

## Files

- `app/src/screens/schedules/schedule-list-screen.tsx`
- `app/src/features/schedules/schedule-api.ts`
- 필요 시 공통 피드백 컴포넌트

## Requirements

- 선택 반려동물 기준 조회가 동작해야 한다
- 수동 refresh 또는 생성 후 refresh 경로가 있어야 한다
- 기존 목록이 있을 때 refresh 실패가 full-screen error로 바로 전환되지 않아야 한다
- empty/error/loading 상태가 실제 서버 응답 기준으로 보이게 해야 한다

## Constraints

- 새로운 전역 상태 라이브러리를 도입하지 않는다
- 홈 집계 구현과 별개로 목록 화면의 상태 책임을 유지한다

## Done Criteria

- 일정 목록이 생성/완료 이후 자연스럽게 다시 그려진다
- refresh 실패 시 사용자 경험이 과도하게 끊기지 않는다
