# Implementation 05: Prebuild EAS Firebase Readiness

작성일: 2026-03-25

## 범위

- Task 12
- Task 13
- Task 14

## 구현 내용

- `expo prebuild --platform android --no-install`를 실행해 `app/android/` native 프로젝트를 생성했다.
- 생성된 Android 프로젝트에서 `namespace`와 `applicationId`가 `com.petory.app`으로 반영된 것을 확인했다.
- `./gradlew assembleDebug`를 시도해 로컬 Android 디버그 빌드 가능 여부를 검증했다.
- 현재 로컬 Java가 `openjdk 26`이라 Gradle 빌드가 `Unsupported class file major version 70`으로 실패하는 것을 확인했다.
- 현재 단계의 Android 내부 테스트 경로는 `EAS Build`가 아니라 로컬 `Expo Dev Client`/prebuild 경로로 유지하기로 정리했다.
- `@react-native-firebase/app` 직접 의존성을 추가해 `messaging`와 같은 메이저 버전 `21.14.0`으로 정렬했다.
- Firebase config plugin 반영 후 prebuild를 다시 시도했고, `expo.android.googleServicesFile` 및 실제 `google-services.json` 부재가 현재 native push 준비의 직접 blocker임을 확인했다.

## 핵심 결론

### Task 12

- Android prebuild 자체는 성공했다.
- 하지만 로컬 debug build는 JDK 21 계열이 준비돼야 계속 진행할 수 있다.

### Task 13

- 지금은 EAS가 아니라 로컬 디버깅 경로가 먼저다.
- JDK/Firebase 선행 조건이 닫히지 않은 상태에서 EAS를 먼저 여는 것은 순서가 맞지 않는다.

### Task 14

- `@react-native-firebase/messaging`를 유지하려면 `@react-native-firebase/app` 직접 의존성이 필요하다.
- 다만 native Firebase 준비는 여기서 끝나지 않는다.
- 계속 진행하려면 다음이 추가로 필요하다.
  1. 실제 `google-services.json`
  2. `app.json`의 `expo.android.googleServicesFile`
  3. 이후 prebuild 재실행

## 주요 파일

- `app/android/`
- `app/package.json`
- `app/package-lock.json`
- `docs/plan-android-app.md`

## 검증

- `npx expo prebuild --platform android --no-install`
- `./gradlew assembleDebug`
- `java -version`
- `npm ls @react-native-firebase/app @react-native-firebase/messaging --depth=0`
- `npm run typecheck`
