# Task 08: Expo SDK Dependency Alignment

## Goal

안드로이드 Expo Go 실기기에서 앱이 부팅되지 않는 문제를 해결하기 위해, 현재 Expo SDK 55와 어긋난 핵심 런타임 의존성을 권장 조합으로 정렬한다.

## Files

- `app/package.json`
- `app/package-lock.json`
- 필요 시 `app/tsconfig.json`
- 필요 시 타입 오류가 발생하는 앱 소스 파일

## Requirements

- `npx expo install --check` 기준 핵심 런타임 mismatch를 줄이거나 제거해야 한다
- Expo Go QR 진입 시 앱이 최소 부팅 가능한 상태여야 한다
- `npm run typecheck`가 통과해야 한다
- 기존 API 계약과 화면 흐름은 임의로 변경하지 않는다

## Constraints

- Expo managed 구조를 임의로 bare/native 전환하지 않는다
- Android `android/` 프로젝트 생성까지 범위를 넓히지 않는다
- 푸시 알림 설계 변경은 포함하지 않는다
- 명시적 승인 없는 기술 변경은 하지 않는다

## Done Criteria

- Expo SDK 55 기준 핵심 의존성 조합이 정리된다
- 타입체크가 통과한다
- 이후 Task 01, 02의 실기기 LAN/API 검증을 진행할 수 있는 상태가 된다
