# 안드로이드 앱 실행/테스트 상세 계획

작성일: 2026-03-25  
기준 문서: `docs/research-android-app.md`  
목적: 현재 Expo 기반 앱을 안드로이드 실기기에서 우선 `Expo Go`로 검증 가능한 상태로 만들고, 이후 `APK` 또는 네이티브 Android 빌드 경로를 안전하게 열기 위한 단계별 계획을 정리한다.  
중요: 이 문서는 설계/계획 문서다. 구현은 포함하지 않는다.

---

## 진행 상태

- [x] Task 01: Expo Go API Base URL
- [x] Task 02: Expo Go Device Runbook
- [x] Task 03: API Debug Surface
- [x] Task 04: Mobile Auth Verification Policy
- [x] Task 05: Push Scope Separation
- [x] Task 06: Android Build Strategy Alignment
- [x] Task 07: Native APK Preflight
- [x] Task 08: Expo SDK Dependency Alignment
- [x] Task 09: Expo Go Exit Criteria And Bypass Decision
- [x] Task 10: Android App Identifier And Scheme
- [x] Task 11: Expo Dev Client Bootstrap
- [x] Task 12: Android Prebuild Local Debug Build
- [x] Task 13: EAS Internal APK Evaluation
- [x] Task 14: Firebase Messaging Native Readiness

검증 메모:

- 2026-03-25 현재 앱 `npm run typecheck`는 통과하지 않는다.
- 2026-03-25 Task 08 구현 후 앱 `npm run typecheck`를 통과한다.
- `npx expo install --check`는 오프라인 검증 기준 `Dependencies are up to date`를 반환한다.
- `npx expo export --platform android`는 성공했고 Android bundle 산출물을 생성했다.
- Task 09에서 Expo Go 우회 1차 경로를 `Expo Dev Client`로 확정했다.
- Task 10에서 `scheme=petory`, `android.package=com.petory.app`를 설정했다.
- Task 11에서 `expo-dev-client` 기반 실행 스크립트와 config plugin을 추가했다.
- Task 12에서 `expo prebuild --platform android --no-install`로 `app/android/`를 생성했다.
- Task 12에서 초기 `./gradlew assembleDebug`는 로컬 JDK 26 때문에 실패했지만, 이후 JDK 21 + Gradle 8.13 + Android SDK 설치 후 성공했다.
- Task 13에서 현재 단계의 내부 테스트 경로는 EAS가 아니라 로컬 dev client/prebuild 경로를 유지하기로 정리했다.
- Task 14에서 `@react-native-firebase/app` 직접 의존성을 추가했고, Android prebuild는 `expo.android.googleServicesFile` 누락으로 더 진행되지 않음을 확인했다.
- Expo Go 실기기 연결과 설치형 APK 생성은 이 단계에서 실제 완료하지 않았다.
- Expo SDK 55 권장 런타임 의존성 불일치는 Task 08에서 정리했다.

---

## 0. 명시적 가정

이 문서는 다음 가정을 전제로 한다.

- 현재 앱은 Expo SDK 51 기반 managed Expo에 가까운 구조를 유지한다.
- 현재 `app/` 아래에는 `android/`, `ios/`, `eas.json`, `.env*`가 없다.
- 안드로이드 실기기 첫 목표는 “앱이 뜬다”가 아니라 “로그인과 핵심 API가 실제로 동작한다”이다.
- 현재 푸시 알림은 `@react-native-firebase/messaging` 기반이지만, Expo Go에서의 동작 보장은 없다.
- 명시적 승인 없는 대규모 기술 전환은 금지이므로, 바로 bare/native 중심으로 이동하지 않는다.
- 회원가입/이메일 인증 플로우는 현재 서버 메일 설정과 verify URL 정책에 영향을 받는다.
- 이번 단계의 우선순위는 `Expo Go 실기기 검증 가능 상태 확보`이고, `APK 빌드 파이프라인 정리`는 그 다음 단계다.

---

## 1. 접근 방식

현재 안드로이드 테스트의 핵심 문제는 앱 코드 자체보다 “실행 경로와 환경 설정이 닫혀 있지 않다”는 점이다.

현재 상태:

1. 앱은 Expo 구조지만 Android 식별자와 빌드 설정이 최소 수준이다.
2. API 기본 URL이 `http://localhost:8080/api`라서 실기기에서 거의 항상 실패한다.
3. `.env` 또는 동등한 환경 변수 주입 방식이 정리돼 있지 않다.
4. `scheme`과 deep link 구성이 없어 모바일 이메일 인증 UX가 닫혀 있지 않다.
5. 푸시 알림은 native/Firebase 의존성이 강하지만 해당 설정 파일이 없다.
6. `android/`와 `eas.json`이 없어서 APK 경로는 아직 계획 단계조차 닫히지 않았다.

따라서 구현 및 검증은 아래 세 축으로 분리해야 한다.

### 1.1 1차 축: Expo Go 실기기 API 연결을 먼저 닫는다

- 실기기에서 접근 가능한 API host 전략을 정한다.
- 실행 환경에서 `EXPO_PUBLIC_API_BASE_URL`이 안정적으로 주입되게 한다.
- 로그인, 홈, 반려동물, 일정 조회까지 실기기 smoke test가 가능해야 한다.

단, 2026-03-25 기준 현재 상태에서는 이 축보다 더 앞선 선행조건이 생겼다.

- Expo Go가 프로젝트를 정상 부팅할 수 있도록 Expo SDK 의존성 정합성을 먼저 복구해야 한다.
- 앱이 부팅되지 않는 상태에서는 API host 정책을 검증할 수 없다.

### 1.2 2차 축: 모바일 인증/운영 흐름의 현실적인 제약을 문서와 UI에 반영한다

- 이메일 인증의 모바일 한계를 명시한다.
- deep link가 없는 현재 구조에서 수동 인증 또는 웹 인증을 공식 흐름으로 정리한다.
- 필요 시 디버그 정보와 사용자 메시지를 보강한다.

### 1.3 3차 축: APK/네이티브 Android 경로는 별도 준비 단계로 연다

- `android.package`, `eas.json`, Firebase/native 설정 여부를 먼저 결정한다.
- Expo Go 범위와 native build 범위를 분리한다.
- 푸시 포함 여부에 따라 dev client 또는 standalone build 전략을 나눈다.

---

## 2. 구현 목표

이번 계획의 최종 목표는 아래와 같다.

1. 안드로이드 실기기에서 Expo Go로 앱 진입이 가능하다.
2. Expo SDK 55 기준 권장 런타임 의존성 조합이 회복된다.
3. 실기기에서 로그인, 세션 복원, 홈 조회가 실제 API 기준으로 동작한다.
4. 실기기 테스트용 API base URL 설정 경로가 문서와 실행 방식에서 일치한다.
5. `localhost` fallback 때문에 실기기 API가 실패하는 상태를 줄인다.
6. 이메일 인증 흐름의 모바일 제약이 문서나 UX에서 명확히 드러난다.
7. 푸시 알림이 Expo Go 범위 밖인지, native build 범위인지 정책이 명확해진다.
8. Android APK 또는 네이티브 빌드에 필요한 식별자/설정 준비 범위가 계획으로 분리된다.
9. Android 빌드 전환이 필요한 시점과 Expo Go로 충분한 시점을 구분할 수 있다.

---

## 3. 핵심 설계 결정

### 3.1 실기기 API host 정책

정책:

- 안드로이드 실기기 테스트에서는 `localhost`를 절대 기본 host로 신뢰하지 않는다.
- 실기기에서 접근 가능한 개발 머신 LAN IP 기반 URL을 사용한다.
- 기본 예시는 `http://<개발머신-IP>:8080/api`다.

현재 권장:

- 코드는 `EXPO_PUBLIC_API_BASE_URL` 환경 변수를 우선 사용한다.
- 환경 변수가 없을 때의 fallback은 개발자 친화적이더라도 실기기 친화적이지 않다는 점을 문서와 실행 스크립트에서 보완해야 한다.
- 필요 시 런타임 UI에서 현재 API base URL을 노출하는 디버그 보강을 검토한다.

### 3.2 Expo Go 우선 전략

정책:

- 첫 번째 성공 기준은 Expo Go 실기기에서 로그인과 홈 API가 동작하는 것이다.
- 푸시, deep link, release APK까지 한 번에 닫으려 하지 않는다.
- 다만 현재는 Expo Go 진입 자체가 실패할 수 있으므로, 의존성 정합성 복구를 Expo Go 검증의 0단계로 둔다.

이유:

- 현재 구조는 managed Expo에 가깝다.
- Android native project가 없는 상태에서 APK 빌드로 바로 넘어가면 prebuild와 native 설정이 범위를 크게 넓힌다.
- 핵심 기능 smoke test는 Expo Go만으로도 충분히 가치가 있다.

Task 09 결정:

- 다음 조건 중 하나라도 만족하면 Expo Go를 1차 검증 경로에서 제외한다.
  1. 동일 의존성 정합성 상태에서 실기기 QR 진입이 반복적으로 실패한다.
  2. Expo Go가 포함하지 않는 native module 제약 때문에 앱 부팅 또는 핵심 화면 진입이 막힌다.
  3. 현재 프로젝트의 핵심 검증 범위에 native module 검증이 포함된다.
- 현재 프로젝트는 `@react-native-firebase/messaging`를 포함하므로, 1차 우회 경로를 `Expo Dev Client`로 선택한다.
- `expo prebuild` 기반 로컬 Android 디버그 빌드는 2차 우회 경로로 둔다.
- `EAS Build`는 팀 내부 배포가 필요한 경우의 3차 선택지로 둔다.

### 3.3 이메일 인증 모바일 처리 정책

정책:

- 현재 구조에서는 자동 앱 deep link 인증을 목표로 잡지 않는다.
- 모바일에서는 다음 중 하나를 공식 흐름으로 둔다.
  1. 웹 링크 인증 후 앱 로그인
  2. 토큰 수동 입력

이유:

- `scheme`이 없다.
- verify URL 기본값이 웹 `localhost`다.
- `VerifyEmailScreen` 자동 인증은 브라우저 location 기반이다.

### 3.4 푸시 알림 테스트 범위 정책

정책:

- Expo Go 실기기 테스트 범위에서는 푸시 알림을 필수 성공 기준으로 두지 않는다.
- 푸시 테스트는 Android native build 또는 dev client 준비 이후 별도 단계로 분리한다.

이유:

- 현재는 Firebase 설정 파일과 Expo plugin/native 구성이 없다.
- React Native Firebase Messaging은 native 설정 의존성이 높다.

### 3.5 APK 경로 분리 정책

정책:

- APK 생성은 `Expo Go 검증 완료 후` 별도 작업으로 다룬다.
- 이 단계에서 먼저 확정할 항목은 다음이다.
  - `android.package`
  - prebuild 채택 여부
  - EAS Build 사용 여부
  - Firebase native 설정 포함 여부

현재 권장:

- 빠른 현장 테스트가 목적이면 Expo Go를 먼저 닫는다.
- 배포형 테스트나 푸시까지 필요하면 그때 native/APK 경로로 확장한다.

추가 판단(2026-03-25):

- 현재 사용자 증상처럼 Expo Go에서 앱이 전혀 동작하지 않는다면, Expo Go를 고정 전제로 둘 필요는 없다.
- 이 경우 다음 우선순위로 의사결정한다.
  1. Expo Dev Client
  2. `expo prebuild` 기반 Android 디버그 빌드 또는 APK
  3. EAS Build 기반 내부 테스트 APK
- 완전한 React Native CLI 전환은 별도 기술 변경 승인 없이는 진행하지 않는다.

---

## 4. Expo Go 실기기 실행 계획

### 4.1 현재 상태

현재 파일 기준:

- `app/package.json`: `expo start`, `expo run:android` 스크립트 존재
- `app/app.json`: 최소 Expo 설정만 존재
- `app/src/services/api/client.ts`: `EXPO_PUBLIC_API_BASE_URL` 지원
- `.env*`: 없음
- `app/package.json`의 Expo SDK 55 관련 런타임 의존성이 권장 버전과 불일치
- `npm run typecheck` 실패 상태

즉, 현재는 다음 두 단계가 모두 필요하다.

1. Expo Go 부팅 가능 상태 복구
2. 실기기 네트워크 설정 정리

### 4.1.1 선행 작업: Expo SDK 의존성 정합성 복구

예상 변경 파일:

- `app/package.json`
- `app/package-lock.json`
- 필요 시 `app/tsconfig.json` 또는 타입체크 관련 설정 파일
- 필요 시 타입 에러가 있는 화면 파일

필요 변경:

- Expo SDK 55 기준 권장 패키지 버전으로 핵심 런타임 의존성 정렬
- `npm run typecheck` 실패 원인 제거
- Expo Go에서 부팅 가능한 최소 상태 확인

검증 항목:

- `npx expo install --check` 결과에서 핵심 런타임 mismatch가 해소돼야 한다
- `npm run typecheck`가 통과해야 한다
- 이후에만 QR 기반 실기기 진입 검증을 진행한다

### 4.2 목표 구조

#### 4.2.1 실기기용 API 환경 변수 경로 정리

예상 변경 파일:

- `app/.env` 또는 동등한 환경 변수 가이드 문서
- 필요 시 `app/package.json`
- 필요 시 관련 실행 문서

필요 변경:

- `EXPO_PUBLIC_API_BASE_URL` 설정 방법 명시
- 개발 머신 LAN IP 기준 URL 예시 제공
- Expo Go 실행 시 어떤 값이 주입돼야 하는지 고정

검증 항목:

- 앱이 폰에서 `/auth/login`, `/auth/me`, `/dashboard/home`를 실제 서버에 요청할 수 있어야 한다
- `localhost`로 잘못 붙는 상황을 재현 가능하게 설명할 수 있어야 한다

#### 4.2.2 실기기 연결 문서화

예상 변경 파일:

- `docs/implementation/` 하위 가이드 또는 별도 문서

필요 변경:

- Expo Go 연결 순서 정리
- 폰/개발 머신 동일 Wi-Fi 조건 정리
- 서버 실행 순서 정리
- 실기기에서 로그인/홈까지 확인하는 검증 시나리오 정리

#### 4.2.3 API 연결 실패 진단 보강

예상 변경 파일:

- `app/src/services/api/client.ts`
- 필요 시 설정 화면 또는 디버그 정보 노출 파일

필요 변경 후보:

- 현재 API base URL 확인 가능 경로 제공
- 네트워크 실패와 인증 실패 메시지 구분 보강
- 최소한 개발 단계에서 호스트 문제를 빨리 파악할 수 있게 한다

주의:

- 디버그 노출은 운영 UX를 해치지 않는 범위에서 제한한다.

### 4.3 Expo Go 완료 기준

- `npx expo install --check` 기준 핵심 mismatch가 정리된다.
- `npm run typecheck`가 통과한다.
- 안드로이드 폰의 Expo Go에서 앱이 열린다.
- 실기기에서 로그인 API가 성공한다.
- 앱 재실행 시 세션 복원이 동작한다.
- 홈과 반려동물 bootstrap이 실기기에서 실제 서버 기준으로 동작한다.
- 실기기용 API base URL 설정 방식이 문서로 남아 있다.

---

## 5. 인증/운영 흐름 보강 계획

### 5.1 이메일 인증 처리

예상 변경 파일:

- `app/src/screens/auth/verify-email-screen.tsx`
- 필요 시 `app/app.json`
- 필요 시 서버 verify URL 관련 문서

필요 변경 방향:

- 현재는 모바일에서 자동 deep link 인증이 닫혀 있지 않다는 점을 명시한다.
- 수동 토큰 입력 또는 웹 인증 후 로그인 흐름을 공식 테스트 경로로 정리한다.
- deep link를 도입할지 여부는 별도 승인 후 결정한다.

### 5.2 회원가입 테스트 조건 정리

예상 변경 파일:

- 문서 위주

필요 정리:

- SMTP 설정이 준비돼야 회원가입 end-to-end 테스트가 닫힌다.
- 메일 발송 실패 시 로그인 이전 단계에서 막힐 수 있음을 문서화한다.

### 5.3 푸시 테스트 범위 분리

예상 변경 파일:

- 문서 위주
- 필요 시 설정 화면의 안내 문구

필요 정리:

- Expo Go에서 푸시가 비핵심 또는 미지원 범위임을 정리한다.
- 푸시는 native build 이후 검증 항목으로 분리한다.

### 5.4 운영 흐름 완료 기준

- 모바일 인증 흐름의 한계가 문서에 명시된다.
- 회원가입/인증 테스트 전제 조건이 정리된다.
- 푸시 테스트가 Expo Go 범위와 APK/native 범위로 나뉘어 정리된다.

---

## 6. Android 빌드/APK 준비 계획

### 6.1 현재 상태

현재 파일 기준:

- `android/`: 없음
- `eas.json`: 없음
- `android.package`: 없음
- `google-services.json`: 없음

즉, APK 빌드는 “바로 실행”보다 “먼저 구조를 결정해야 하는 단계”다.

### 6.2 목표 준비 구조

#### 6.2.1 Android 식별자 확정

예상 변경 파일:

- `app/app.json`
- 필요 시 `app/app.config.*`

필요 변경:

- `android.package` 확정
- 추후 dev/release 충돌 없는 식별자 전략 결정

Task 10 결정:

- Android package는 `com.petory.app`으로 고정한다.
- 앱 scheme은 `petory`로 설정한다.
- 현재 단계에서는 scheme을 deep link 자동 인증에 즉시 연결하지 않고, dev client/native build 식별자 정렬 용도로 먼저 확보한다.

#### 6.2.2 빌드 방식 확정

선택지:

1. Expo Dev Client
2. `expo prebuild` 후 로컬 Gradle APK 생성
3. EAS Build로 APK/AAB 생성

검토 기준:

- 로컬 Android SDK/JDK 준비 상태
- CI/공유 가능성
- Firebase/native 설정 반영 난이도
- Expo Go 미동작 시 우회 속도
- 실기기에서 native module을 실제로 써야 하는지 여부

현재 권장:

- 현재 코드베이스와 증상 기준 1차 권장은 Expo Dev Client 또는 prebuild 기반 Android 디버그 빌드다.
- 팀 배포 테스트가 중요해지면 EAS Build가 관리 측면에서 유리할 수 있다.
- 문서상으로 여러 경로를 비교하되, 실제 구현은 하나로 고정한다.

Task 11 결정:

- 이번 단계의 실제 구현 경로는 `Expo Dev Client` bootstrap이다.
- `expo-dev-client` 패키지를 설치하고 `start:dev-client` 스크립트를 표준 진입점으로 둔다.
- 실제 `android/` 생성과 로컬 native 디버그 빌드는 Task 12에서 수행한다.

Task 12 결과:

- `expo prebuild --platform android --no-install`로 `app/android/` 생성은 성공했다.
- 초기 `./gradlew assembleDebug`는 현재 로컬 `openjdk 26` 환경에서 `Unsupported class file major version 70`으로 실패했다.
- 이후 JDK 21을 명시적으로 사용하도록 실행 경로를 고정하고, Gradle wrapper를 `8.13`으로 조정했으며, Android SDK를 설치했다.
- 그 결과 현재 `assembleDebug`는 성공한다.

Task 13 결정:

- 현재 단계에서는 `EAS Build`를 도입하지 않는다.
- 이유는 다음과 같다.
  1. 지금 필요한 것은 팀 배포보다 로컬 Android 실기기 디버깅 경로 확보다.
  2. 현재 blocker는 EAS 부재가 아니라 JDK/Firebase 설정 부재다.
  3. `google-services.json`과 signing/secret 정책 없이 EAS를 먼저 여는 것은 순서가 맞지 않는다.
- 따라서 내부 테스트 APK 경로는 추후 팀 공유 수요가 생길 때 다시 연다.

#### 6.2.3 Firebase/native 준비 범위 확정

예상 변경 파일:

- `app/app.json`
- `google-services.json`
- `eas.json` 또는 native Android 파일
- 필요 시 `package.json`

필요 변경:

- React Native Firebase Messaging 유지 여부 결정
- 푸시를 계속 쓸 경우 필요한 native 설정 정리
- `@react-native-firebase/app` 직접 의존성 명시 여부 검토

주의:

- 명시적 승인 없는 대규모 스택 전환은 금지다.
- 푸시 범위를 보류하면 APK 빌드 준비 범위도 더 작아질 수 있다.

Task 14 결정:

- `@react-native-firebase/messaging`를 유지하려면 `@react-native-firebase/app` 직접 의존성이 필요하므로 이를 추가한다.
- 하지만 Android prebuild를 계속 진행하려면 `expo.android.googleServicesFile`과 실제 `google-services.json`이 필요하다.
- 현재 저장소에는 해당 파일이 없으므로, 푸시 native 준비는 “의존성 정렬 완료, Firebase 설정 파일 대기” 상태로 둔다.
- 따라서 Android 실행 범위는 당분간 “앱 부팅/로그인/홈 검증”과 “푸시 native 준비 분리”로 유지한다.

### 6.3 APK 준비 완료 기준

- Android package 식별자가 확정된다.
- APK 빌드 방식이 로컬 Gradle 또는 EAS 중 하나로 결정된다.
- Firebase/native 설정 포함 여부가 명시된다.
- prebuild 또는 EAS 도입 시 필요한 파일/설정 목록이 task 수준으로 분리 가능해진다.

---

## 7. 단계별 실행 계획

### Step 1. Expo Go 실기기 실행 기준 확정

목적:

- 안드로이드 폰에서 앱을 띄우기 위한 최소 성공 조건을 닫는다.

세부 항목:

- 실기기용 API base URL 정책 확정
- 환경 변수 주입 방식 확정
- 서버 실행 및 LAN 접근 전제 문서화
- Expo Go 연결 절차 문서화

예외:

- Expo Go에서 앱이 전혀 부팅하지 않으면 이 step을 종료 조건으로 삼지 않는다.
- 즉시 Step 1A로 전환한다.

### Step 1A. Expo Go 우회 전략 결정

목적:

- Expo Go를 포기하고도 Android 실기기 테스트를 계속할 수 있는 경로를 확정한다.

세부 항목:

- Expo Dev Client 채택 여부 결정
- `expo prebuild` 기반 로컬 Android 디버그 빌드 채택 여부 결정
- EAS Build 내부 테스트 APK 필요 여부 결정

현재 결정:

- 채택: Expo Dev Client
- 보류: prebuild 기반 로컬 Android 디버그 빌드
- 보류: EAS Build 내부 테스트 APK

### Step 2. 실기기 API 연결 보강

목적:

- 로그인과 홈 API가 실제 기기에서 성공하게 만든다.

세부 항목:

- `EXPO_PUBLIC_API_BASE_URL` 주입 경로 반영
- 필요 시 API base URL 디버그 보강
- 로그인/세션 복원/홈 조회 smoke test 기준 정리

### Step 3. 인증/운영 흐름 정리

목적:

- 모바일에서 막히는 회원가입/이메일 인증/푸시 제약을 현실적으로 닫는다.

세부 항목:

- 모바일 이메일 인증 정책 정리
- SMTP 의존성 문서화
- Expo Go 범위에서 푸시 제외 또는 안내 강화

### Step 4. Android 빌드 전략 확정

목적:

- APK 경로를 시작할 수 있는 의사결정과 설정 범위를 정리한다.

세부 항목:

- `android.package` 결정
- prebuild vs EAS Build 결정
- Firebase/native 설정 범위 결정

### Step 5. APK/native 준비 task 분해

목적:

- 승인 후 구현 가능한 task 단위로 쪼갠다.

세부 항목:

- Expo config 보강 task
- Android 식별자 task
- EAS 또는 prebuild task
- Firebase/native push task
- Android smoke test/release verification task

---

## 8. 변경 대상 범위

### 8.1 앱

- `app/app.json`
- `app/package.json`
- `app/src/services/api/client.ts`
- 필요 시 `app/src/screens/auth/`
- 필요 시 `app/src/screens/settings/settings-screen.tsx`
- 필요 시 `app/app.config.*`
- 필요 시 `.env*`

### 8.2 서버

- `server/src/main/resources/application.yml`
- 필요 시 CORS 또는 verify URL 관련 설정 문서

### 8.3 문서

- `docs/research-android-app.md`
- `docs/plan-android-app.md`
- 후속 task 문서
- 구현 후 implementation/review 문서

---

## 9. 트레이드오프

### 9.1 Expo Go를 우선하는 경우

장점:

- 가장 빠르게 실기기 smoke test 가능
- native project 생성 없이 범위를 통제 가능

단점:

- 푸시와 deep link 검증은 제한적
- APK 배포 테스트는 불가능

현재 판단:

- 첫 단계로는 가장 현실적이다.

### 9.2 바로 APK/native 빌드로 가는 경우

장점:

- 실제 배포형 테스트에 가깝다
- native module 검증이 가능하다

단점:

- prebuild/EAS/Firebase 설정까지 범위가 급격히 커진다
- 현재 프로젝트 구조를 크게 바꿀 수 있다

현재 판단:

- Expo Go 성공 후 진행하는 것이 안전하다.

### 9.3 deep link를 지금 도입하는 경우

장점:

- 모바일 이메일 인증 UX가 자연스러워진다

단점:

- `scheme`, 앱 링크, 서버 verify URL까지 함께 바뀐다
- 승인 없는 기술/구조 변경 범위가 커진다

현재 판단:

- 우선은 수동/웹 인증 흐름으로 운영하고 별도 승인 후 진행한다.

### 9.4 푸시를 지금 강하게 닫는 경우

장점:

- Android 실기기 가치가 올라간다

단점:

- Firebase native 설정과 빌드 체인 정리가 필요하다
- Expo Go 중심 검증과 충돌한다

현재 판단:

- 실기기 1차 목표에서는 제외하는 편이 낫다.

---

## 10. 리스크

### 높음

- `EXPO_PUBLIC_API_BASE_URL`이 정리되지 않으면 실기기 테스트는 거의 실패한다.
- APK 빌드를 서두르면 prebuild/native 설정이 범위를 크게 넓힌다.
- 푸시를 Expo Go 범위에서 억지로 검증하려 하면 실패 원인 파악이 어려워진다.

### 중간

- 모바일 이메일 인증 흐름이 웹 중심이라 테스트 사용자가 혼란을 겪을 수 있다.
- SMTP 설정 부재 시 회원가입 테스트가 중간에서 막힌다.
- 서버 LAN 접근이나 방화벽 문제로 앱 문제처럼 보이는 네트워크 실패가 생길 수 있다.

### 낮음

- 홈/일정/반려동물 화면 자체 렌더링은 Expo Go 실행만 되면 큰 구조 문제 없이 보일 가능성이 높다.

---

## 11. 완료 기준

이 계획이 완료됐다고 볼 기준은 아래와 같다.

- 안드로이드 폰에서 Expo Go로 앱을 열 수 있다.
- 실기기에서 로그인과 세션 복원이 동작한다.
- 홈/반려동물 bootstrap이 실기기에서 실제 API 기준으로 동작한다.
- 실기기 API host 설정 방식이 문서와 실행 방식에서 일치한다.
- 모바일 이메일 인증의 현실적인 테스트 경로가 정리돼 있다.
- 푸시 알림이 Expo Go 범위인지 native/APK 범위인지 정책이 명확하다.
- Android package와 APK 빌드 방식 결정에 필요한 선행 항목이 정리돼 있다.
- 후속 task로 분해 가능한 수준까지 범위와 우선순위가 닫혀 있다.
