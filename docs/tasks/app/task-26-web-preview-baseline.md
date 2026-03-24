# Task 26

## Goal
Expo web 기준으로 앱이 브라우저에서 열리도록 실행 베이스를 정리한다.

## Files
- app/package.json
- app/app.json
- app/metro.config.js
- app/src/services/notifications/push-service.ts
- 필요 시 app/src/services/api/client.ts

## Requirements
- `expo start --web`로 앱을 열 수 있어야 한다.
- 앱 초기 진입 시 네이티브 전용 모듈 때문에 런타임이 깨지면 안 된다.
- 브라우저에서 첫 화면 확인이 가능해야 한다.
- 백엔드 base URL이 웹 브라우저 기준으로 동작해야 한다.

## Constraints
- 선행 기준 문서: `docs/plan-app.md`
- React Native UI 계층은 유지한다.
- 모바일 전용 푸시 기능을 완전히 구현하려고 하지 않는다.
- 웹에서 동작하지 않는 기능은 안전한 fallback 또는 비활성화로 둔다.

## Done Criteria
- `npx expo start --web` 후 브라우저에서 앱 루트가 열린다.
- 첫 화면 렌더링과 기본 입력/버튼 상호작용을 확인할 수 있다.
- 푸시 같은 네이티브 전용 기능이 웹 런타임을 깨뜨리지 않는다.
