# Task 06: Android Build Strategy Alignment

## Goal

APK 또는 네이티브 Android 빌드로 넘어가기 전에 `android.package`, prebuild 여부, EAS Build 여부를 결정 가능한 상태로 정리한다.

## Files

- `app/app.json`
- 필요 시 `app/app.config.*`
- 필요 시 Android 빌드 계획 문서

## Requirements

- Android 식별자 결정 항목이 명시돼야 한다
- `expo prebuild`와 `EAS Build` 중 어떤 경로를 쓸지 비교 기준이 정리돼야 한다
- Expo Go 검증 후에야 APK 경로로 넘어간다는 우선순위가 유지돼야 한다

## Constraints

- 아직 `android/` 프로젝트를 생성하지 않는다
- 승인 없이 EAS를 실제 도입하지 않는다
- Firebase/native 설정 구현까지 포함하지 않는다

## Done Criteria

- Android 빌드 전략이 의사결정 가능한 수준으로 정리된다
- 후속 native/APK task 분해가 가능해진다

