# Implementation 07: Android UI Fixes

작성일: 2026-03-26

## 범위

- Task 15
- Task 16
- Task 17

## 구현 내용

- `react-native-safe-area-context`를 추가하고 앱 루트를 `SafeAreaProvider`로 감쌌다.
- 공통 `ScreenContainer`에서 Android/iOS safe area inset을 직접 읽어 상단/하단 padding에 반영하도록 수정했다.
- scrollable 화면과 non-scrollable 화면이 동일한 inset 정책을 사용하도록 맞췄다.
- `expo-image-picker`를 추가하고, 웹/앱 공통 이미지 선택 유틸을 만들었다.
- 웹은 기존 DOM file picker를 유지하고, Android/iOS는 native media library picker를 사용하도록 분리했다.
- 반려동물 등록 화면의 사진 선택 로직을 공통 picker로 교체했다.
- 반려동물 폼의 안내 문구를 실제 지원 정책과 맞게 수정했다.
- `expo-keep-awake` 로그는 앱 코드가 아니라 Expo dev tools 경로 가능성이 높다는 triage 결과를 Android runbook에 반영했다.

## 주요 파일

- `app/App.tsx`
- `app/src/components/common/screen-container.tsx`
- `app/src/components/forms/pet-form.tsx`
- `app/src/screens/pets/pet-form-screen.tsx`
- `app/src/utils/image-picker.ts`
- `docs/plan-android-ui-fixes.md`
- `docs/implementation/android-app/implementation-06-jdk21-android-runbook.md`

## triage 메모

- `app/src`와 `App.tsx`에서는 `expo-keep-awake`, `activateKeepAwake`, `useKeepAwake` 사용 흔적이 검색되지 않았다.
- 대신 `expo/src/launch/withDevTools.tsx`에서 optional `expo-keep-awake` 사용이 확인됐다.
- 따라서 현재 스크린샷의 rejection 로그는 앱 화면 로직보다 dev client/runtime 계층의 관찰 이슈로 분류한다.

## 검증

- `npm run typecheck`
- `npx expo install --check`
- `npx expo export --platform android`
