# Task 07: Auth Root State Layout

## Goal

루트 네비게이터의 loading/error/auth 상태 레이아웃을 사용자용 UI로 정리한다.

## Files

- `app/src/app/navigation/root-navigator.tsx`

## Requirements

- 개발용 `Auth Stack`, `App Stack` 텍스트 제거
- loading/error 상태를 공통 feedback 컴포넌트로 교체
- auth 상태에서 로그인/회원가입 전환 UI를 단순 상단 탭 또는 segmented control 형태로 정리

## Constraints

- 실제 navigation 라이브러리 도입은 하지 않는다
- home/settings 이후 앱 내 탭 구조까지 바꾸지 않는다

## Done Criteria

- root navigator가 개발용 디버그 UI 없이 사용자용 레이아웃을 보여준다

