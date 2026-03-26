# Task 12: Android Prebuild Local Debug Build

## Goal

`expo prebuild` 기반으로 `android/` 프로젝트를 생성하고, 로컬 Android 디버그 빌드 또는 APK 생성까지 이어질 수 있는 최소 경로를 연다.

## Files

- `app/app.json`
- 필요 시 `app/app.config.*`
- 생성될 `app/android/`
- 관련 실행 문서

## Requirements

- `expo prebuild` 수행 전후 관리 전략이 명확해야 한다
- Android Studio/Gradle 기반 디버그 빌드 절차가 정리돼야 한다
- 실기기 설치 후 Metro 연결 또는 디버그 실행 기준이 포함돼야 한다

## Constraints

- prebuild 산출물은 사용자가 승인한 경로에서만 생성한다
- unrelated native refactor는 하지 않는다
- signing/release 배포까지 범위를 넓히지 않는다

## Done Criteria

- 로컬 Android 디버그 빌드 경로가 실제 수행 가능한 수준으로 정리된다
- Expo Go 없이도 안드로이드 실기기 실행 경로가 열린다
