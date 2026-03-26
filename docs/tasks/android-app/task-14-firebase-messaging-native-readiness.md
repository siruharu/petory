# Task 14: Firebase Messaging Native Readiness

## Goal

현재 `@react-native-firebase/messaging` 기반 푸시 기능을 Android native/dev build 경로에서 유지할지, 보류할지 결정하고 필요한 네이티브 준비 범위를 정리한다.

## Files

- `app/package.json`
- `app/app.json`
- 필요 시 `google-services.json`
- 필요 시 `eas.json`
- `app/src/services/notifications/push-service.ts`
- 관련 계획 문서

## Requirements

- `@react-native-firebase/app` 직접 의존성 필요 여부를 판단해야 한다
- Firebase 설정 파일과 native/plugin 설정 필요 여부가 정리돼야 한다
- 푸시를 이번 Android 실행 범위에 포함할지 제외할지 정책이 명확해야 한다

## Constraints

- 임의 mock Firebase 구조를 만들지 않는다
- 승인 없이 푸시 스택을 다른 기술로 바꾸지 않는다
- 서버 API 계약 변경은 포함하지 않는다

## Done Criteria

- Android native/dev build에서 푸시 범위가 명확해진다
- Firebase 준비가 필요한 경우 파일/설정 목록이 확정된다
