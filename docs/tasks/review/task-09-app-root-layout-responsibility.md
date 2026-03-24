# Task 09: App Root Layout Responsibility

## Goal

`RootNavigator`와 하위 화면의 `ScreenContainer` 책임을 분리한다.

## Files

- `app/src/app/navigation/root-navigator.tsx`
- `app/src/screens/auth/login-screen.tsx`
- `app/src/screens/auth/signup-screen.tsx`
- `app/src/screens/home/home-screen.tsx`
- `app/src/screens/settings/settings-screen.tsx`

## Requirements

- 상위/하위 이중 전체 화면 컨테이너 제거
- 루트가 셸을 가지는지, 화면이 셸을 가지는지 하나로 통일
- 현재 UI 구조가 시각적으로 분리된 두 화면처럼 보이지 않도록 정리

## Constraints

- 실제 navigation library 도입은 이 task 범위가 아니다
- 화면 내용 자체를 다시 디자인하지 않는다

## Done Criteria

- auth/home/settings 진입 시 safe area/padding이 한 단계에서만 적용된다

