# Task 15: 모바일 앱 부트스트랩 구조 정리

## Goal
React Native 앱의 공통 진입 구조를 정리한다.

## Files
- app/src/app/navigation/root-navigator.tsx
- app/src/app/providers/auth-provider.tsx
- app/src/components/common/screen-container.tsx

## Requirements
- AuthProvider 구조를 정리한다.
- RootNavigator에서 인증 여부에 따른 화면 분기 자리를 둔다.
- 공통 ScreenContainer의 최소 UI 레이아웃 기준을 둔다.

## Constraints
- 선행 task: task-01-api-contract.md
- 실제 네비게이션 라이브러리 상세 연결은 최소 수준으로 둔다.
- mock 데이터 주입은 하지 않는다.

## Done Criteria
- 앱이 공통 provider와 navigator 골격 위에서 확장 가능하다.
- 화면 task들이 같은 레이아웃과 인증 컨텍스트를 사용할 수 있다.

