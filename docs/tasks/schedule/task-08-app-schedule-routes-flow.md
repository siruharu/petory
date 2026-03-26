# Task 08: App Schedule Routes Flow

## Goal

앱 루트에서 일정 목록과 일정 생성 화면으로 실제 진입/복귀 가능한 흐름을 연결한다.

## Files

- `app/src/app/navigation/root-navigator.tsx`
- `app/src/screens/home/home-screen.tsx`
- `app/src/screens/schedules/schedule-list-screen.tsx`
- `app/src/screens/schedules/schedule-form-screen.tsx`

## Requirements

- 홈에서 일정 목록으로 이동 가능한 경로를 추가한다
- 일정 목록에서 일정 생성으로 이동 가능한 경로를 추가한다
- 현재 선택 반려동물 ID를 일정 화면에 전달한다
- 생성 성공 후 일정 목록 또는 홈으로 복귀하는 정책을 반영한다

## Constraints

- 현재 단순 상태 분기 구조를 유지한다
- 새로운 라우팅 라이브러리를 도입하지 않는다

## Done Criteria

- 사용자가 앱 내에서 일정 목록과 일정 생성 화면에 실제로 접근할 수 있다
- 생성/복귀 흐름에서 선택 반려동물 컨텍스트를 잃지 않는다
