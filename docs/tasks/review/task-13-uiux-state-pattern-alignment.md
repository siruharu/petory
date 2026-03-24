# Task 13: UIUX State Pattern Alignment

## Goal

공통 상태 UI 패턴을 auth/home/list/form 영역까지 일관되게 맞춘다.

## Files

- `app/src/screens/auth/`
- `app/src/screens/home/home-screen.tsx`
- `app/src/screens/pets/pet-list-screen.tsx`
- `app/src/screens/schedules/schedule-list-screen.tsx`
- `app/src/screens/records/record-list-screen.tsx`

## Requirements

- loading/empty/error/success 메시지 톤과 위치 정리
- inline success/info/error 피드백 위치 기준 통일
- 상태 UI가 화면마다 다르게 보이지 않도록 조정

## Constraints

- API 호출 구조는 바꾸지 않는다
- 피그마 문서를 다시 설계하지 않는다

## Done Criteria

- 주요 화면에서 상태 UI가 같은 UX 문법으로 보인다

