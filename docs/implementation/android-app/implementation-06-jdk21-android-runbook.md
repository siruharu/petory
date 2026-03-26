# Implementation 06: JDK21 Android Runbook

작성일: 2026-03-25

## 범위

- Android 실행 blocker 해소
- JDK 21 실행 경로 정리

## 구현 내용

- 이 머신에 설치된 `Amazon Corretto 21` 경로를 확인했다.
- 기존 Android 빌드 실패 원인이 기본 Java 26 선택 때문임을 확인했다.
- `app/android/gradle/wrapper/gradle-wrapper.properties`를 `Gradle 8.13`으로 조정했다.
- Homebrew로 `android-commandlinetools`, `android-platform-tools`를 설치했다.
- `sdkmanager`로 `platform-tools`, `platforms;android-36`, `build-tools;36.0.0`를 설치했다.
- `app/package.json`에 JDK 21을 강제하는 Android 실행 스크립트를 추가했다.
  - `npm run android`
  - `npm run android:prebuild`
  - `npm run android:assemble:debug`
- `ANDROID_HOME`, `ANDROID_SDK_ROOT`, `JAVA_HOME`를 함께 설정하도록 스크립트를 보강했다.
- `ANDROID_HOME=$HOME/Library/Android/sdk ANDROID_SDK_ROOT=$HOME/Library/Android/sdk JAVA_HOME=$(/usr/libexec/java_home -v 21) ./gradlew assembleDebug`가 실제로 성공하는 것을 확인했다.

## 확인된 JDK 21 경로

- `/Users/zephyr/Library/Java/JavaVirtualMachines/corretto-21.0.10/Contents/Home`

실행 시에는 위 절대 경로를 하드코딩하지 않고, macOS 기본 명령으로 동적으로 찾는다.

- `/usr/libexec/java_home -v 21`

## 실행 순서

1. 서버 실행
2. `app/.env.example`를 참고해 실기기 API 주소 준비
3. Metro 실행
   `EXPO_PUBLIC_API_BASE_URL=http://<LAN-IP>:8080/api npm run start:dev-client`
4. Android native 프로젝트가 없거나 갱신이 필요하면
   `npm run android:prebuild`
5. 디버그 APK 빌드
   `npm run android:assemble:debug`
6. 필요 시 연결된 Android 기기 또는 에뮬레이터로 실행
   `npm run android`

실기기 수동 설치 경로:

1. USB 디버깅이 켜진 안드로이드 폰을 연결한다.
2. APK 경로:
   `app/android/app/build/outputs/apk/debug/app-debug.apk`
3. 설치 예시:
   `adb install -r app/android/app/build/outputs/apk/debug/app-debug.apk`
4. 앱 설치 후 Metro는 다음 명령으로 연다.
   `EXPO_PUBLIC_API_BASE_URL=http://<LAN-IP>:8080/api npm run start:dev-client`

## 주의

- 현재 푸시까지 포함한 native build를 계속 진행하려면 `google-services.json`과 `expo.android.googleServicesFile`이 추가로 필요하다.
- 따라서 지금 시점의 목표는 “JDK 21로 Android build/runtime blocker 제거”와 “dev client 실행 경로 고정”이다.
- 현재 `app.json`에 Firebase plugin이 들어 있으므로, `android/`를 다시 prebuild로 재생성할 때는 `google-services.json`이 없으면 멈춘다.
- 그러나 이미 생성된 `app/android/` 기준 디버그 빌드는 JDK 21 + Android SDK 설정 후 통과한다.
- 실기기 스크린샷에서 보인 `expo-keep-awake` rejection은 현재 앱 코드 검색 결과 직접 사용 흔적이 없었다.
- `expo` 패키지 내부 `src/launch/withDevTools.tsx`에서 optional `expo-keep-awake` 사용이 확인돼, 현재는 앱 로직보다 dev client/runtime 관찰 이슈로 분류한다.

## 검증

- `/usr/libexec/java_home -V`
- `brew install --cask android-commandlinetools`
- `brew install android-platform-tools`
- `sdkmanager --sdk_root=$HOME/Library/Android/sdk "platform-tools" "platforms;android-36" "build-tools;36.0.0"`
- `ANDROID_HOME=$HOME/Library/Android/sdk ANDROID_SDK_ROOT=$HOME/Library/Android/sdk JAVA_HOME=$(/usr/libexec/java_home -v 21) ./gradlew assembleDebug`
