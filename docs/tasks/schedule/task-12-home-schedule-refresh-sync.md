# Task 12: Home Schedule Refresh Sync

## Goal

일정 생성/완료 이후 홈 대시보드 일정 섹션과 일정 목록 화면이 같은 refresh 기준으로 동작하도록 맞춘다.

## Files

- `app/src/screens/home/home-screen.tsx`
- `app/src/app/navigation/root-navigator.tsx`
- `app/src/screens/schedules/schedule-list-screen.tsx`

## Requirements

- 일정 생성 후 홈과 일정 목록이 모두 최신 데이터를 반영해야 한다
- 일정 완료 후 홈 overdue/today 섹션도 갱신돼야 한다
- 현재 선택 반려동물 기준이 홈과 일정 목록에서 일치해야 한다
- refresh token 또는 동등한 상위 상태 전달 구조가 명확해야 한다

## Constraints

- 새로운 상태 관리 라이브러리를 도입하지 않는다
- 홈 전체 구조를 다시 설계하지 않는다

## Done Criteria

- 홈과 일정 목록이 생성/완료 이후 서로 다른 데이터를 보여주지 않는다
- 일정 관련 상위 refresh 흐름이 코드상 명확하다
