# Task 05: Push Scope Separation

## Goal

안드로이드 실기기 Expo Go 테스트 범위에서 푸시 알림을 필수 성공 기준으로 두지 않도록 정책과 안내를 정리한다.

## Files

- `app/src/screens/settings/settings-screen.tsx`
- `app/src/services/notifications/push-service.ts`
- 필요 시 관련 문서

## Requirements

- Expo Go에서 푸시가 제한적이거나 미지원일 수 있다는 점이 드러나야 한다
- 푸시 실패가 앱 전체 실패처럼 보이지 않게 해야 한다
- native build 또는 dev client 이후 검증할 범위가 별도로 정리돼야 한다

## Constraints

- 현재 푸시 기술 스택을 임의로 교체하지 않는다
- Firebase native 설정 도입까지 확장하지 않는다

## Done Criteria

- Expo Go 실기기 테스트와 푸시 테스트 범위가 명확히 분리된다
- 설정 화면 또는 문서에서 푸시 제약이 이해 가능하게 정리된다

