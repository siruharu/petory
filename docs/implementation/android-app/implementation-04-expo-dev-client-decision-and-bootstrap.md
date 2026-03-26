# Implementation 04: Expo Dev Client Decision And Bootstrap

작성일: 2026-03-25

## 범위

- Task 09
- Task 10
- Task 11

## 구현 내용

- Expo Go를 계속 고집하지 않고, 현재 프로젝트의 1차 Android 실기기 우회 경로를 `Expo Dev Client`로 확정했다.
- Expo Go 종료 조건을 문서에 명시했다.
- `app/app.json`에 Android 식별자 `com.petory.app`과 앱 scheme `petory`를 추가했다.
- `app/app.json`에 `expo-dev-client` config plugin을 추가했다.
- `app/package.json`에 `start:dev-client` 스크립트를 추가했다.
- `expo-dev-client` 패키지를 실제 설치해 SDK 55 기준 config에 반영되도록 했다.

## 결정 근거

- 현재 프로젝트는 Expo SDK 기반이지만 `@react-native-firebase/messaging`를 포함한다.
- 이 조합은 일반 Expo Go보다 custom native runtime과 더 잘 맞는다.
- Expo Go에서 앱이 전혀 부팅하지 않는 현재 증상에서는, Expo Go를 계속 디버깅하는 것보다 dev client 경로를 여는 편이 더 직접적이다.
- `expo prebuild` 기반 로컬 Android 디버그 빌드는 여전히 유효한 2차 경로지만, 이번 단계에서는 `android/` 생성 없이 dev client 진입점만 먼저 마련했다.

## 실행 절차

1. `cd app`
2. 실기기에서 접근 가능한 API 값을 준비한다.
3. 예시:
   `EXPO_PUBLIC_API_BASE_URL=http://<LAN-IP>:8080/api npm run start:dev-client`
4. 이후 Android dev build가 설치된 기기에서 Metro에 연결한다.

주의:

- 이 단계만으로는 아직 기기에 설치 가능한 dev build APK가 자동 생성되지 않는다.
- 실제 Android native project 생성과 dev build 실행은 Task 12에서 진행한다.
- 현재 `scheme`은 식별자 정렬 목적이며, 이메일 인증 deep link를 즉시 닫는 범위는 아니다.

## 주요 파일

- `app/app.json`
- `app/package.json`
- `app/package-lock.json`
- `docs/plan-android-app.md`

## 검증

- `npx expo install expo-dev-client`
- `npm run typecheck`
- `npx expo config --json`
- `npx expo install --check`
