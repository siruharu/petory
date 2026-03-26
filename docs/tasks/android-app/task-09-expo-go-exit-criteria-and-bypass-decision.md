# Task 09: Expo Go Exit Criteria And Bypass Decision

## Goal

Expo Go를 계속 검증 경로로 유지할지, 아니면 `Expo Dev Client` 또는 `expo prebuild` 기반 Android 빌드로 즉시 우회할지를 현재 증상 기준으로 결정 가능한 상태로 정리한다.

## Files

- `docs/plan-android-app.md`
- 필요 시 Android 실행/빌드 비교 문서

## Requirements

- Expo Go를 포기해야 하는 명확한 종료 조건이 문서에 있어야 한다
- 우회 경로 후보인 `Expo Dev Client`, `expo prebuild`, `EAS Build`의 선택 기준이 있어야 한다
- 현재 프로젝트의 `@react-native-firebase/messaging` 의존성이 판단 기준에 반영돼야 한다

## Constraints

- 이 task에서는 실제 prebuild나 EAS 도입을 수행하지 않는다
- 명시적 승인 없는 기술 전환 결정을 구현으로 밀어붙이지 않는다

## Done Criteria

- 팀이 다음 실기기 검증 경로를 하나로 선택할 수 있다
- Expo Go 실패 시 다음 단계가 모호하지 않다
