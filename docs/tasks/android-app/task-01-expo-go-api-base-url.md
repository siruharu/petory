# Task 01: Expo Go API Base URL

## Goal

안드로이드 실기기 Expo Go 실행 시 앱이 `localhost`가 아니라 개발 머신 LAN IP 기반 API URL을 안정적으로 사용하도록 설정 경로를 정리한다.

## Files

- `app/src/services/api/client.ts`
- 필요 시 `app/package.json`
- 필요 시 `app/.env` 또는 동등한 실행 가이드 문서

## Requirements

- `EXPO_PUBLIC_API_BASE_URL` 사용 방식이 실기기 기준으로 명확해야 한다
- `localhost` fallback 때문에 폰에서 API가 실패하는 상황을 줄여야 한다
- 실기기에서 사용할 URL 예시가 문서나 설정에 반영돼야 한다
- 로그인과 홈 API smoke test에 필요한 최소 실행 기준이 남아 있어야 한다

## Constraints

- API 계약 자체는 변경하지 않는다
- Android native project를 새로 만들지 않는다
- APK 빌드 준비까지 범위를 넓히지 않는다

## Done Criteria

- 안드로이드 실기기용 API base URL 설정 방식이 재현 가능하게 정리된다
- Expo Go 실행 시 폰이 `localhost:8080`을 바라보는 기본 실패 경로가 문서나 설정으로 보완된다

