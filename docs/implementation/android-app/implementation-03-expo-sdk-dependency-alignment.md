# Implementation 03: Expo SDK Dependency Alignment

작성일: 2026-03-25

## 범위

- Task 08

## 구현 내용

- `app/package.json`의 Expo SDK 55 핵심 런타임 의존성을 권장 조합으로 정렬했다.
- `@expo/metro-runtime`, `@react-native-async-storage/async-storage`, `react`, `react-dom`, `react-native`, `react-native-web` 버전을 Expo 55 기준에 맞췄다.
- `@types/react`를 React 19 계열로 올리고 불필요한 `@types/react-native` 의존성을 제거했다.
- `typescript`를 Expo SDK 55의 `tsconfig.base.json`과 호환되는 버전으로 올렸다.
- `app/tsconfig.json`에서 Expo 기본 DOM/lib 설정을 덮어쓰던 항목을 제거해 `URLSearchParams` 관련 타입 오류를 해소했다.
- `app/src/screens/schedules/schedule-form-screen.tsx`에서 `catch` 블록의 `unknown` 타입 처리 문제를 수정했다.
- `app/package-lock.json`을 갱신해 실제 설치 결과를 반영했다.

## 핵심 원인 정리

- 기존 상태는 Expo SDK 55 대비 런타임 의존성 조합이 크게 어긋나 있었다.
- 이 상태에서는 웹은 렌더링되더라도 Expo Go Android 런타임에서 QR 진입 직후 앱이 뜨지 않거나 불안정할 수 있다.
- 추가로 TypeScript 설정이 Expo base의 `DOM` 라이브러리를 덮어써 `URLSearchParams` 타입 오류를 만들고 있었다.

## 주요 파일

- `app/package.json`
- `app/package-lock.json`
- `app/tsconfig.json`
- `app/src/screens/schedules/schedule-form-screen.tsx`
- `docs/plan-android-app.md`

## 검증

- `npm install`
- `npm ls expo react react-dom react-native react-native-web @expo/metro-runtime @react-native-async-storage/async-storage typescript --depth=0`
- `npx expo install --check`
- `npm run typecheck`
- `npx expo export --platform android`
