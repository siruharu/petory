# Task 07: Native APK Preflight

## Goal

실제 APK 또는 native Android 빌드를 시작하기 전에 필요한 선행 조건과 누락 설정을 preflight 체크리스트로 정리한다.

## Files

- 관련 Android 빌드/implementation 문서
- 필요 시 `app/package.json`
- 필요 시 `app/app.json`

## Requirements

- `android/`, `eas.json`, `google-services.json`, Firebase 설정, signing, JDK/SDK 등 선행 조건이 정리돼야 한다
- 현재 코드베이스에서 바로 APK 빌드가 어려운 이유가 항목별로 명시돼야 한다
- prebuild를 시작하면 구조가 바뀐다는 점이 포함돼야 한다

## Constraints

- 실제 prebuild나 APK 생성은 수행하지 않는다
- native 파일을 새로 만들지 않는다
- 승인 없는 Firebase 설정 도입을 하지 않는다

## Done Criteria

- APK/native 빌드 착수 전에 필요한 준비물이 체크리스트 형태로 정리된다
- 구현 전 blocker와 범위 확장이 명확해진다

