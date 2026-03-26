# Task 15: Android Safe Area Container Alignment

## Goal

Android 실기기에서 상단 헤더와 하단 CTA가 시스템 상태바/내비게이션 바와 충돌하지 않도록 공통 `ScreenContainer`의 safe area 정책을 정렬한다.

## Files

- `app/src/components/common/screen-container.tsx`
- 필요 시 `app/package.json`
- 필요 시 `app/App.tsx` 또는 앱 루트 provider

## Requirements

- `react-native-safe-area-context` 기반 여부를 정리하고 Android inset을 실제로 반영해야 한다
- scrollable 화면과 non-scrollable 화면이 같은 safe area 원칙을 따라야 한다
- 로그인, 홈, 반려동물 등록 화면에서 상단/하단 여백이 실기기 기준으로 개선돼야 한다

## Constraints

- 특정 화면에 개별 padding을 덧붙이는 방식으로 끝내지 않는다
- 기존 화면 구조를 임의로 대규모 재배치하지 않는다
- iOS/web 동작을 깨지 않는 범위에서 공통 컨테이너 중심으로 수정한다

## Done Criteria

- Android 실기기에서 주요 화면의 상단/하단 여백이 시스템 UI와 충돌하지 않는다
- 공통 컨테이너 한 곳에서 safe area 정책을 이해할 수 있다
