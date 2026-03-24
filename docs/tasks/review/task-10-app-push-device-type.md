# Task 10: App Push Device Type

## Goal

푸시 토큰 등록 시 `deviceType`을 실제 플랫폼 기준으로 보내도록 수정한다.

## Files

- `app/src/screens/settings/settings-screen.tsx`
- `app/src/services/notifications/push-service.ts`

## Requirements

- `Platform.OS` 기준으로 `ios` / `android` 분기
- web preview에서는 안전한 fallback 처리
- 서버 API 계약과 맞는 값만 전송

## Constraints

- 푸시 SDK 자체를 교체하지 않는다
- 토큰 영속 저장 구조까지 확장하지 않는다

## Done Criteria

- 플랫폼별로 올바른 `deviceType`이 서버에 전달된다

