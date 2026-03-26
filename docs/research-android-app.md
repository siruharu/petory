# 안드로이드 앱 실행/테스트 연구

작성일: 2026-03-25  
대상 범위: `app/`, 앱이 의존하는 서버 접근 설정 일부(`server/src/main/resources/application.yml`, `server/src/main/kotlin/com/petory/config/*`)  
목적: 현재 코드베이스 기준으로 안드로이드 폰에서 `Expo Go`로 접근하는 경로와, 네이티브 Android 빌드 또는 APK 생성 경로를 실제 가능 상태 기준으로 분석한다.

---

## 1. 전체 구조

### 1.1 현재 앱 런타임 구조

현재 앱은 Expo SDK 51 기반의 React Native 앱이다.

핵심 파일:

- `app/package.json`
- `app/app.json`
- `app/App.tsx`
- `app/src/app/providers/auth-provider.tsx`
- `app/src/app/navigation/root-navigator.tsx`
- `app/src/services/api/client.ts`

구조 요약:

1. `package.json`의 `main`은 `expo/AppEntry.js`다.
2. Expo 엔트리가 `App.tsx`를 로드한다.
3. `App.tsx`는 `AuthProvider`로 전체 앱을 감싼다.
4. `AuthProvider`가 AsyncStorage에서 토큰을 읽고 `/auth/me`를 호출해 세션을 복원한다.
5. `RootNavigator`가 로그인 화면과 앱 메인 화면을 조건부로 전환한다.
6. 앱 내부 기능은 모두 `apiRequest()`를 통해 백엔드 `/api/*`를 호출한다.

즉, 안드로이드 폰 테스트 성공 조건은 단순히 화면이 뜨는 것만이 아니다. 아래 네 가지가 동시에 맞아야 한다.

1. Expo 런타임이 기기에서 실행 가능해야 한다.
2. JS 번들 서버 또는 APK/네이티브 앱이 정상 제공돼야 한다.
3. 앱이 바라보는 `EXPO_PUBLIC_API_BASE_URL`이 폰에서 실제로 접근 가능해야 한다.
4. 로그인/홈/반려동물 bootstrap 흐름이 서버와 세션 저장소까지 포함해 정상 동작해야 한다.

### 1.2 Expo 설정 상태

`app/app.json` 기준 현재 설정은 매우 최소 수준이다.

현재 존재:

- `name`
- `slug`
- `version`
- `orientation`
- `userInterfaceStyle`
- `platforms`
- `web.bundler`
- `assetBundlePatterns`

현재 없음:

- `android.package`
- `android.permissions`
- `android.adaptiveIcon`
- `ios.bundleIdentifier`
- `scheme`
- `plugins`
- `extra`
- `updates`
- `runtimeVersion`
- `owner`
- `eas.json`

`npx expo config --json` 결과도 동일하게 최소 설정만 노출된다.  
즉 현재 프로젝트는 “Expo 앱으로는 실행 가능할 수 있지만, 배포/빌드/네이티브 통합에 필요한 식별자와 빌드 설정은 아직 없다”는 상태다.

추가 관찰(2026-03-25):

- `npx expo config --json` 기준 SDK 버전은 `55.0.0`으로 해석된다.
- `app/package.json`의 핵심 런타임 의존성은 Expo SDK 55 권장 조합과 크게 어긋나 있다.
- 이 상태는 웹 번들링이 되더라도 Expo Go Android 런타임에서 앱이 뜨지 않거나, 번들 로드 직후 실패할 가능성을 높인다.

오프라인 기준 `npx expo install --check` 결과:

- `@expo/metro-runtime@3.2.3` -> expected `~55.0.6`
- `@react-native-async-storage/async-storage@1.23.1` -> expected `2.2.0`
- `react@18.2.0` -> expected `19.2.0`
- `react-dom@18.2.0` -> expected `19.2.0`
- `react-native@0.84.1` -> expected `0.83.2`
- `react-native-web@0.19.13` -> expected `~0.21.0`

이 결과는 “웹은 보이지만 Expo Go 실기기에서 앱 진입이 실패한다”는 현재 현상과 직접 연결될 수 있다.

### 1.3 Android 관련 프로젝트 구조 상태

현재 `app/` 아래에는 다음이 없다.

- `android/`
- `ios/`
- `eas.json`
- `.env`
- `.env.local`
- `google-services.json`
- `GoogleService-Info.plist`
- `firebase.json`

이 의미는 다음과 같다.

1. 현재는 managed Expo에 가까운 구조다.
2. `expo run:android`를 실행하면 prebuild가 필요하며, 그 과정에서 `android/` 디렉터리가 생성될 수 있다.
3. APK를 로컬 Gradle로 만들려면 결국 `android/`가 필요하다.
4. EAS Build를 쓰려면 최소한 `eas.json`과 Android 식별자 구성이 필요하다.
5. Firebase Messaging을 실제 네이티브로 붙이려면 `google-services.json`이 필요할 가능성이 매우 높다.

### 1.4 네트워크 구조

모든 앱 API는 `app/src/services/api/client.ts`를 통과한다.

현재 기본값:

```ts
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || 'http://localhost:8080/api';
```

이 기본값은 안드로이드 실기기 테스트에서 가장 큰 blocker다.

이유:

1. Android 폰에서 `localhost`는 개발용 Mac/PC가 아니라 “폰 자기 자신”을 뜻한다.
2. 따라서 별도 환경 변수 없이 실행하면 폰은 `http://localhost:8080/api`로 요청을 보내고 실패한다.
3. Expo Go든 APK든 동일하다.

즉 현재 코드베이스는 폰 테스트를 위한 API base URL 설정이 코드 안에 준비돼 있지만, 실제 값 주입용 파일이나 문서는 없다.

추가 해석:

- 실기기에서 “앱이 켜지기는 하지만 로그인 이후 실패”하는 경우의 1차 원인은 이 `localhost` fallback이다.
- 반대로 “QR로 진입하자마자 앱이 안 뜬다”면 네트워크보다 먼저 Expo SDK/React Native 의존성 불일치를 의심해야 한다.

### 1.5 서버 측 연계 구조

앱이 붙는 서버 기본 포트는 `server/src/main/resources/application.yml` 기준 `8080`이다.

중요 설정:

- `server.port: 8080`
- `app.cors.allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:8081,http://localhost:19006}`

추가 해석:

1. Native Android 앱/Expo Go에서의 `fetch`는 브라우저 CORS 제약을 직접 받지 않는 경우가 많다.
2. 하지만 웹 개발 모드(`localhost:19006`)는 CORS 영향권에 있다.
3. 이메일 인증 링크 기본값은 `http://localhost:8081/verify-email`이라서, 모바일 디바이스에서 링크를 바로 처리하는 흐름과는 어긋난다.

### 1.6 푸시 알림 구조

설정 화면은 `@react-native-firebase/messaging` 기반 푸시 토큰 동기화를 제공한다.

관련 파일:

- `app/src/services/notifications/push-service.ts`
- `app/src/features/notifications/notification-api.ts`
- `app/src/screens/settings/settings-screen.tsx`

현재 특성:

1. 코드에서 `require('@react-native-firebase/messaging')`를 런타임에 감싼다.
2. 모듈이 없으면 `denied` 또는 `null`로 빠진다.
3. 하지만 실제로 이 기능이 동작하려면 Expo Go가 아니라 네이티브 빌드 또는 커스텀 dev client가 필요할 가능성이 높다.
4. 현재 Firebase 설정 파일은 없다.

---

## 2. 핵심 로직 흐름

### 2.1 Expo Go로 안드로이드 폰에서 접근하는 흐름

현재 코드 기준 예상 흐름은 다음과 같다.

1. 개발 머신에서 `cd app && npm run start`
2. Expo CLI가 Metro 번들 서버를 띄운다.
3. 안드로이드 폰의 Expo Go 앱이 QR 코드 또는 URL로 프로젝트에 접속한다.
4. Expo Go가 `App.tsx`를 실행한다.
5. `AuthProvider`가 AsyncStorage에서 access token을 읽는다.
6. 토큰이 있으면 `/auth/me` 호출로 로그인 세션을 복원한다.
7. 로그인 상태면 `RootNavigator`의 `AppState`가 열린다.
8. `AppState`는 `fetchPets()`로 반려동물 목록 bootstrap을 시도한다.
9. `HomeScreen`은 `fetchHome()`으로 홈 대시보드 데이터를 불러온다.
10. 이후 사용자가 일정/기록/반려동물 API를 순차 호출한다.

이 경로에서 실제 실패 포인트는 다음 순서로 발생할 가능성이 높다.

1. Expo SDK/React Native 버전 불일치로 Expo Go 런타임 진입 실패
2. Expo Go 접속 실패 또는 Metro 연결 실패
3. JS는 떴지만 API가 `localhost`를 바라봐서 로그인 실패
4. 로그인은 됐지만 서버 메일/인증 정책 때문에 회원가입 후 진행 불가
5. 설정 화면에서 푸시 알림 동기화 시 native module 또는 Firebase 설정 부족으로 실패

### 2.1.1 현재 실기기 증상과 가장 직접적인 원인 후보

현재 사용자 제보는 다음과 같다.

- Expo 실행 후 QR 코드로 안드로이드 폰 접근 시 앱이 실행되지 않는다.
- 동일 프로젝트를 웹으로 열면 화면은 정상적으로 보인다.

이 증상은 다음 두 층으로 분리해서 해석해야 한다.

1. 앱 부팅 실패 층
2. 앱 부팅 후 API 연결 실패 층

현재 저장소 기준으로는 두 층 모두 blocker가 존재한다.

앱 부팅 실패 층의 직접 후보:

- Expo SDK 55와 현재 `react`, `react-native`, `react-native-web`, `@react-native-async-storage/async-storage` 조합 불일치
- Expo Go에서 지원하지 않는 native 의존성 조합 또는 Metro 번들 호환성 저하

앱 부팅 후 API 연결 실패 층의 직접 후보:

- `EXPO_PUBLIC_API_BASE_URL` 미설정 시 `http://localhost:8080/api` fallback

즉 “웹이 된다”는 사실만으로 모바일 런타임 정상성을 증명할 수 없다.  
웹은 `react-native-web` 경로로 렌더링되며, Expo Go Android는 Expo SDK와 React Native 런타임 호환성 제약을 더 직접적으로 받는다.

### 2.2 인증 bootstrap 흐름

관련 파일:

- `app/src/app/providers/auth-provider.tsx`
- `app/src/features/auth/use-auth.ts`
- `app/src/screens/auth/login-screen.tsx`
- `app/src/screens/auth/signup-screen.tsx`
- `app/src/screens/auth/verify-email-screen.tsx`

단계:

1. `AuthProvider` mount
2. `sessionStorage.getAccessToken()`으로 AsyncStorage에서 토큰 조회
3. 토큰이 없으면 `status = success`, 비로그인 화면 표시
4. 토큰이 있으면 `/auth/me` 호출
5. 성공 시 사용자 상태 복원
6. 401/403이면 세션 삭제 후 비로그인 상태 전환
7. 기타 네트워크 에러면 `status = error`

안드로이드 실기기 관점 의미:

1. 첫 실행에는 토큰이 없으므로 로그인 화면은 로컬 렌더링 가능하다.
2. 하지만 로그인 버튼을 누르면 곧바로 API base URL 문제가 드러난다.
3. 세션 복원도 결국 서버 접근이 필수다.

### 2.3 회원가입/이메일 인증 흐름

회원가입 흐름:

1. `SignupScreen`에서 `/auth/signup`
2. 성공 시 “메일 발송됨” 메시지 표시
3. 이후 사용자는 이메일 인증 완료 후 로그인해야 한다

인증 흐름의 구조적 특징:

1. `VerifyEmailScreen`은 토큰 직접 입력을 지원한다.
2. 자동 인증은 `readVerifyTokenFromLocation()` 기반이다.
3. 이 함수는 `globalThis.location`, `globalThis.history`를 사용한다.
4. 즉 자동 링크 인증 흐름은 사실상 웹 경로 중심이다.

안드로이드 폰 관점 해석:

1. 현재 앱에는 deep link용 `scheme` 설정이 없다.
2. `verify-email` 링크를 모바일 앱이 직접 받아 자동 인증하는 구조가 아니다.
3. 모바일에서는 사실상 “메일 링크를 웹에서 열거나, 토큰을 복사해 앱에 붙여 넣는 수동 흐름”에 가깝다.
4. 서버 기본 verify URL이 `http://localhost:8081/verify-email`인 점도 실기기 환경과 어긋난다.

### 2.4 로그인 후 앱 메인 흐름

관련 파일:

- `app/src/app/navigation/root-navigator.tsx`
- `app/src/screens/home/home-screen.tsx`
- `app/src/features/home/home-api.ts`
- `app/src/features/pets/pet-api.ts`

단계:

1. 로그인 완료 후 `AppState` 진입
2. `AppState`가 `fetchPets()` 호출
3. 결과를 `cachedPets`와 `selectedPetId`에 저장
4. `HomeScreen`이 `fetchHome({ petId })` 호출
5. 홈 데이터 렌더링
6. 사용자가 일정/반려동물/설정 화면으로 이동

안드로이드 폰 테스트에서 의미 있는 점:

1. 앱이 뜨더라도 API가 불통이면 홈은 빈 상태가 아니라 로딩/에러/fallback 분기를 탄다.
2. 반려동물 bootstrap이 실패해도 일부 로컬 fallback UI는 보일 수 있다.
3. 따라서 “화면이 보인다”와 “실사용 가능하다”를 구분해야 한다.

### 2.5 설정 화면의 푸시 토큰 동기화 흐름

단계:

1. 설정 화면에서 “푸시 알림 활성화”
2. `syncPushNotifications(Platform.OS)` 호출
3. 내부에서 `requestPushPermission()`
4. Android 13+이면 `POST_NOTIFICATIONS` 권한 요청
5. `@react-native-firebase/messaging`의 권한 요청
6. 토큰 획득 시 `/notifications/tokens`로 서버 동기화

이 경로는 Expo Go에서 가장 불안정하다.

이유:

1. Expo Go는 모든 native module을 임의로 포함하지 않는다.
2. React Native Firebase Messaging은 일반적으로 커스텀 네이티브 빌드가 필요하다.
3. 현재 Firebase 설정 파일과 Expo plugin 구성이 없다.
4. 따라서 이 버튼은 현 구조에서 높은 확률로 “실기기 Expo Go 테스트 범위 밖”이다.

### 2.6 로컬 Android 빌드 또는 APK 생성 흐름

현재 코드 상태에서 APK까지 가는 현실적 경로는 두 가지다.

#### 경로 A. 로컬 prebuild + Gradle APK

1. `expo prebuild` 또는 `expo run:android`
2. `android/` 프로젝트 생성
3. Android SDK/JDK/Gradle 환경 준비
4. 필요 native 설정 반영
5. `android/app/build/outputs/apk/...` 생성

현재 blocker:

1. `android/` 디렉터리 없음
2. `google-services.json` 없음
3. Expo config plugin 설정 없음
4. Android package name 없음
5. React Native Firebase Messaging을 위한 native 세팅 부재

#### 경로 B. EAS Build로 APK/AAB 생성

1. `eas.json` 작성
2. Expo project 식별자와 Android package 지정
3. 필요 secrets 및 native 설정 반영
4. EAS Build로 APK 또는 AAB 생성

현재 blocker:

1. `eas.json` 없음
2. `android.package` 없음
3. Firebase 파일/secret 체계 없음
4. 현재 프로젝트에는 EAS 기준 배포 설정이 전혀 정리돼 있지 않음

결론적으로 현재는 “Expo Go 시도는 가능”, “APK 빌드 파이프라인은 아직 준비되지 않음” 상태다.

### 2.7 Expo Go 외 대안

현재 사용자 증상은 “웹은 되지만 Expo Go Android에서는 앱이 아예 동작하지 않는다”는 것이다.  
이 경우 선택지는 Expo Go 하나로 고정되지 않는다.

#### 대안 A. Expo Dev Client / Development Build

개요:

1. Expo managed 흐름은 유지한다.
2. 하지만 일반 Expo Go 대신, 이 프로젝트 전용 native dev client를 만든다.
3. 이후 폰에는 Expo Go가 아니라 dev build APK를 설치해 Metro에 연결한다.

장점:

- Expo 프로젝트 구조를 크게 바꾸지 않는다.
- Expo Go가 포함하지 않는 native 모듈 제약을 피할 수 있다.
- 현재 코드에 있는 `@react-native-firebase/messaging` 같은 native 의존성과 더 잘 맞는다.

단점:

- `android/` prebuild 또는 EAS dev build 준비가 필요하다.
- Expo Go보다 초기 세팅이 무겁다.

현재 코드베이스 적합성:

- 가장 현실적인 차선책이다.
- “Expo는 유지하되 Expo Go는 버린다”는 전략에 해당한다.

#### 대안 B. Android prebuild + 로컬 APK/디버그 빌드

개요:

1. `expo prebuild` 또는 `expo run:android`로 `android/` 프로젝트를 생성한다.
2. Android Studio/Gradle 기반으로 직접 디버그 앱이나 APK를 만든다.
3. 필요 시 USB 또는 내부 배포로 실기기에 설치한다.

장점:

- Android 런타임을 가장 직접적으로 통제할 수 있다.
- Expo Go 제약을 완전히 우회한다.
- Firebase/native 설정을 붙이기 쉽다.

단점:

- managed Expo보다 운영 부담이 커진다.
- `android.package`, Firebase, signing, prebuild 산출물 관리가 필요하다.

현재 코드베이스 적합성:

- 푸시와 실기기 안정성이 중요하면 충분히 타당하다.
- 다만 범위가 분명히 커진다.

#### 대안 C. EAS Build 기반 내부 테스트 APK

개요:

1. `eas.json`과 Android 식별자를 구성한다.
2. 내부 배포용 dev/release APK를 빌드한다.
3. QR 기반 Expo Go 대신 설치형 APK로 테스트한다.

장점:

- 팀 공유와 반복 테스트에 유리하다.
- 로컬 Android 환경 의존성을 줄일 수 있다.

단점:

- Expo 계정/EAS 설정이 필요하다.
- 현재 저장소에는 관련 설정이 아직 없다.

현재 코드베이스 적합성:

- 팀 테스트 배포가 필요하면 유리하다.
- 단독 로컬 디버깅만 빠르게 열 목적이라면 prebuild보다 준비가 더 많을 수 있다.

#### 대안 D. React Native CLI로 사실상 전환

개요:

- Expo managed 중심 구조를 벗어나 native Android/iOS 프로젝트를 중심으로 운영한다.

평가:

- 가능은 하지만 현재 저장소 기준으로는 기술 전환 비용이 크다.
- AGENTS 규칙상 명시적 승인 없는 기술 변경 금지에 걸린다.
- 지금 단계의 1차 대응책으로는 과하다.

### 2.8 현재 코드베이스 기준 권장 결론

현재 앱은 이미 Expo SDK 기반이지만, 동시에 `@react-native-firebase/messaging`를 사용한다.  
이 조합은 “웹 + Expo Go”보다 “Expo + custom native build”에 더 가깝다.

따라서 우선순위 권장은 다음과 같다.

1. Expo Go를 억지로 고집하지 않는다.
2. 1차 대안으로 `Expo Dev Client` 또는 `expo prebuild` 기반 Android 디버그 빌드를 검토한다.
3. 푸시와 실제 기기 동작을 계속 유지할 계획이면, 중장기적으로는 설치형 APK/dev build 경로를 표준 테스트 경로로 삼는 편이 맞다.

즉 현재 프로젝트에서 “Expo를 쓰는 방식 말고는 없나?”에 대한 실무 답은 다음이다.

- Expo Go 말고도 있다.
- 가장 현실적인 대안은 `Expo Dev Client` 또는 `prebuild 후 Android 디버그/APK`다.
- 완전한 React Native CLI 전환은 지금 당장 선택할 카드로 보기 어렵다.

---

## 3. 사용 기술 및 패턴

### 3.1 Expo managed 중심 패턴

근거:

- `app.json` 최소 구성
- `android/`, `ios/` 부재
- `expo/AppEntry.js` 사용

현재 앱은 bare React Native보다 managed Expo 흐름에 가깝다.

### 3.2 환경 변수 주입 패턴

근거:

- `app/src/services/api/client.ts`
- `app/src/types/env.d.ts`

패턴:

1. `EXPO_PUBLIC_*` 네이밍으로 public env를 읽는다.
2. 런타임 fallback은 `http://localhost:8080/api`

평가:

1. Expo 방식에는 맞다.
2. 하지만 실기기 기본값으로는 부적절하다.
3. `.env` 파일이 없어서 현재 로컬 실행자가 매번 shell env를 주입해야 한다.

### 3.3 자체 라우팅 패턴

앱은 Expo Router나 React Navigation 대신 `RootNavigator` 내부의 상태 기반 분기 라우팅을 사용한다.

장점:

- 구조가 단순하다.
- 웹/모바일 공통 화면 분기가 빠르다.

단점:

- deep link, Android intent, verify-email link 연결이 약하다.
- 네이티브 앱 패키징 시 화면 전환과 외부 링크 진입 경로를 확장하기 어렵다.

### 3.4 API client envelope 패턴

`apiRequest()`는 모든 응답이 `{ data: ... }` 형태라고 가정한다.

장점:

- 전 API 일관성 확보

숨은 제약:

- 서버가 비정형 에러/HTML/빈 응답을 주면 곧바로 실패한다.
- 실기기 네트워크 문제 시 사용자 메시지는 구체적 호스트/연결 실패 원인을 잘 드러내지 못한다.

### 3.5 AsyncStorage 세션 복원 패턴

패턴:

1. 로그인 성공 시 access token 저장
2. 앱 시작 시 토큰 복원
3. `/auth/me`로 유효성 확인

안드로이드 기기 테스트 의미:

- Expo Go 재실행 후에도 세션 유지 검증이 가능하다.
- APK 설치 후 재실행 테스트에도 동일하게 적용된다.

### 3.6 동적 native module 접근 패턴

`push-service.ts`는 `require('@react-native-firebase/messaging')`를 try/catch로 감싼다.

장점:

- 런타임에서 모듈 해석 실패 시 즉시 크래시를 줄인다.

한계:

- 모듈이 “존재하지만 native binding이 불완전”한 경우까지 안전하다고 보장하지 않는다.
- Expo Go에서 버튼을 눌렀을 때만 깨지는 지연 실패가 생길 수 있다.

---

## 4. 숨겨진 의존성

### 4.1 가장 큰 숨겨진 의존성: API base URL

코드는 `EXPO_PUBLIC_API_BASE_URL`을 읽지만, 프로젝트 안에는 실제 값을 제공하는 `.env`가 없다.

의미:

1. 개발자가 shell에서 직접 export 하지 않으면 `localhost` fallback을 사용한다.
2. 이 값은 실기기에서 거의 항상 실패한다.
3. Expo Go 접속 성공 여부보다 먼저 API 실패가 사용성을 막는다.

### 4.2 개발 머신과 같은 LAN 접근 가능성

실기기에서는 다음이 모두 전제다.

1. 폰과 개발 머신이 같은 네트워크에 있어야 함
2. 서버가 해당 머신 IP:8080으로 접근 가능해야 함
3. OS 방화벽이 8080을 막지 않아야 함
4. Metro와 서버가 서로 다른 포트로 살아 있어야 함

이는 코드 파일에 직접 나타나지 않지만 실제 테스트 성공에 절대적이다.

### 4.3 서버 메일 설정 의존성

회원가입/인증 플로우는 메일 전송에 의존한다.

근거:

- `SignupScreen`의 안내 문구
- 서버 `application.yml`의 `spring.mail.*`

의미:

1. 실기기에서 회원가입 테스트를 하려면 SMTP가 실제로 동작해야 한다.
2. 메일이 막히면 로그인 이전 단계에서 멈출 수 있다.
3. 모바일 deep link가 없으므로 인증 링크 UX도 웹 또는 수동 토큰 입력에 의존한다.

### 4.4 Firebase Messaging native 설정 의존성

숨겨진 사실:

1. `@react-native-firebase/messaging`은 `@react-native-firebase/app`에 의존한다.
2. `npm ls` 상으로는 nested dependency로 설치돼 있다.
3. 그러나 프로젝트 `package.json`에는 직접 명시돼 있지 않다.

실무적 의미:

1. 의존성 잠금 파일이 바뀌면 깨질 수 있다.
2. 네이티브 빌드 시 Firebase App 설정이 누락되면 messaging이 정상 동작하지 않는다.
3. `google-services.json`이 없는 현재 상태로는 Android 푸시 테스트 완성이 어렵다.

### 4.5 Expo Go와 native module 지원 범위 의존성

현재 앱은 Expo 기반이지만 React Native Firebase Messaging을 사용한다.

이는 다음 의존성을 만든다.

1. Expo Go가 해당 모듈을 지원하는지
2. 아니면 dev client/standalone build가 필요한지
3. native configuration이 prebuild에 반영되는지

현재 프로젝트 안에는 이를 보장하는 plugin 선언이 없다.

### 4.6 Android 식별자/배포 설정 의존성

현재 없는 항목:

- `android.package`
- `eas.json`
- signing 관련 설정

의미:

1. APK를 만들더라도 앱 식별자 전략이 확정되지 않았다.
2. EAS Build를 시작할 준비 문서/설정이 전혀 없다.
3. 추후 설치 충돌, package rename, Firebase 연결 재설정 비용이 커질 수 있다.

### 4.7 인증 링크 처리 의존성

`VerifyEmailScreen` 자동 토큰 감지는 브라우저 `location`에 의존한다.

즉:

1. 웹에서는 자연스럽다.
2. Android 앱에서는 deep link 없이는 자동 진입이 어렵다.
3. 실기기 테스트에서 “이메일 인증이 앱으로 자동 열린다”는 기대는 현재 코드와 다르다.

---

## 5. 문제 가능성

### 5.1 Expo Go는 떠도 로그인/API가 전부 실패할 가능성

원인:

- 기본 `API_BASE_URL = http://localhost:8080/api`

결과:

1. 로그인 실패
2. `/auth/me` 세션 복원 실패
3. 반려동물 bootstrap 실패
4. 홈 대시보드 실패

이건 현재 가장 확률이 높은 실기기 실패 원인이다.

### 5.2 Expo Go는 가능하지만 푸시 기능만 실패할 가능성

원인:

- `@react-native-firebase/messaging` native binding
- Firebase 설정 파일 부재
- Expo plugin/native project 부재

결과:

1. 앱 기본 기능은 일부 동작
2. 설정 화면 푸시 동기화만 실패
3. 또는 런타임에서 messaging 호출 시 예외 가능

### 5.3 Expo Go 자체 접속 실패 가능성

원인:

1. 같은 Wi-Fi가 아님
2. 회사/공용망에서 mDNS/LAN 차단
3. macOS 방화벽
4. Expo dev server 접근 경로 문제

코드와 무관하지만 실제 테스트에서 자주 먼저 막히는 층이다.

### 5.4 APK 빌드 착수 시 prebuild 단계에서 구조 확정 비용이 발생할 가능성

현재는 `android/`가 없으므로 APK를 만들려면 prebuild가 필요하다.

리스크:

1. 생성된 native 파일이 repo 구조를 바꾼다.
2. Firebase/plugin 설정이 불완전하면 빌드가 중간에서 막힌다.
3. 이후 managed-only 흐름으로 되돌리기 어렵다.

### 5.5 Android 폰에서 이메일 인증 UX가 불완전할 가능성

원인:

1. 앱 scheme 부재
2. deep link 처리 부재
3. 서버 verify URL 기본값이 localhost 웹 주소

결과:

1. 메일 링크를 폰에서 눌러도 앱 자동 인증으로 이어지지 않을 수 있다.
2. 사용자는 토큰 복사/붙여넣기 또는 웹 인증을 해야 할 수 있다.

### 5.6 로컬 서버는 살아 있지만 폰에서 접근 불가할 가능성

가능 원인:

1. 서버가 다른 네트워크 인터페이스로만 노출됨
2. 방화벽 차단
3. 개발 머신 IP 변경
4. `EXPO_PUBLIC_API_BASE_URL`에 잘못된 IP 사용

현재 코드에는 연결 상태를 진단하는 네트워크 디버그 화면이 없다.

### 5.7 `expo run:android`와 Expo Go 테스트 목적이 섞일 가능성

구분:

1. `expo start` + Expo Go는 JS 번들 테스트
2. `expo run:android`는 native Android project 생성 및 로컬 설치 흐름

현재 프로젝트는 이 둘을 구분하는 문서/스크립트가 없다.

결과:

- 개발자가 “APK 만들고 싶다”는 목적에 비해 너무 이른 단계에서 prebuild를 건드릴 수 있다.

### 5.8 숨은 의존성 잠금 문제

`@react-native-firebase/app`은 현재 nested dependency로만 보인다.

리스크:

1. lockfile 재생성 시 구조가 바뀔 수 있다.
2. explicit dependency가 아니므로 팀 간 환경 차이가 생길 수 있다.

### 5.9 릴리즈 APK 테스트에서 API host가 바뀌지 않을 가능성

Expo Go에서는 shell env로 넘겼다고 해도, 빌드 APK에서는 build-time env 주입이 필요하다.

현재 프로젝트에는 다음이 없다.

- build profile
- env 문서
- staging/production URL 분리

즉 APK를 만들어도 `localhost`가 baked-in 될 위험이 있다.

### 5.10 edge case

#### edge case A. 로그인 전 화면은 보이는데 로그인만 실패

이 경우 UI 문제로 오해하기 쉽지만 실제 원인은 API base URL일 가능성이 높다.

#### edge case B. 토큰이 저장돼 있어서 첫 화면부터 error

AsyncStorage에 이전 잘못된 토큰이 남아 있고 `/auth/me`가 네트워크 실패를 내면 `AuthProvider`는 `status = error`로 빠질 수 있다.

#### edge case C. 폰에서는 앱이 동작하지만 웹 인증 링크는 PC localhost로 열림

서버 verify URL 기본값이 `http://localhost:8081/verify-email`라 모바일 테스트 UX와 맞지 않는다.

#### edge case D. Expo Go에서 설정 화면의 푸시 버튼만 누르면 실패

기본 앱 기능은 JS 중심이라 괜찮아 보여도, native module 경계는 그 시점에 드러난다.

#### edge case E. 다중 반려동물/홈 fallback 때문에 “네트워크가 완전히 죽은 것처럼 안 보일 수 있음”

일부 화면은 fallback 상태를 유지하므로, 사용자가 실제 서버 연결 실패를 늦게 인지할 수 있다.

#### edge case F. Android 13 이하와 13 이상 푸시 권한 동작 차이

`push-service.ts`는 Android 13+만 `POST_NOTIFICATIONS` 권한 요청을 한다.  
OS 버전에 따라 증상이 달라질 수 있다.

---

## 6. 개선 포인트

### 6.1 가장 우선: 실기기용 API base URL 전략을 문서와 설정으로 고정

필수 개선:

1. `EXPO_PUBLIC_API_BASE_URL` 값을 명시적으로 관리
2. 로컬 실기기 테스트용 `.env` 또는 동등한 실행 규칙 제공
3. 예: `http://<개발머신 LAN IP>:8080/api`

현재 상태에서는 이 작업 없이는 Expo Go 테스트 가치가 거의 없다.

### 6.2 Expo Go 테스트 경로와 APK/네이티브 빌드 경로를 분리해 문서화

권장 분리:

1. `Expo Go` 경로: UI/API smoke test
2. `expo run:android` 경로: native debug build
3. `EAS Build` 경로: APK/AAB 배포 테스트

현재는 세 경로가 섞여 있다.

### 6.3 APK 빌드 전 Android 식별자와 빌드 전략을 먼저 확정

필요 항목:

1. `android.package`
2. debug/release 구분
3. local Gradle build를 쓸지 EAS Build를 쓸지
4. signing 전략

이게 정해지지 않으면 prebuild 이후 다시 package rename 비용이 커진다.

### 6.4 Firebase Messaging 전략 재정의

현재 선택지는 둘 중 하나다.

1. 실기기 초기 테스트 범위에서 푸시를 제외하고 Expo Go 중심으로 간다.
2. 푸시까지 포함하려면 dev client 또는 native Android 빌드 경로로 전환한다.

현재 코드 기준으로는 1번이 더 현실적이다.

### 6.5 React Native Firebase 의존성 명시성 보강

개선 포인트:

1. `@react-native-firebase/app`을 `package.json`에 직접 명시
2. Firebase 설정 파일 도입 여부 결정
3. Expo plugin 또는 native setup 문서 추가

### 6.6 이메일 인증의 모바일 UX 분리

현재는 웹 중심 구조다.

개선 방향:

1. 실기기 테스트 초기에는 “수동 토큰 입력”을 공식 흐름으로 간주
2. 장기적으로는 `scheme`과 deep link 처리 추가
3. 서버 `EMAIL_VERIFY_BASE_URL`도 모바일/웹 전략에 맞게 분리

### 6.7 네트워크 진단 정보 노출

실기기 테스트 편의상 다음 중 일부가 있으면 좋다.

1. 현재 `API_BASE_URL` 표시
2. `/health` 또는 간단 ping 버튼
3. 로그인 실패 시 네트워크/서버/인증 오류 구분 표시

현재는 에러 메시지가 상대적으로 추상적이다.

### 6.8 Expo config 확장 필요

향후 Android 테스트/배포를 위해 필요한 후보:

1. `android.package`
2. `scheme`
3. `plugins`
4. `extra`
5. `updates` / `runtimeVersion`
6. `owner` / EAS 연결 설정

### 6.9 빌드 전 검증 체크리스트 문서화

현재 코드베이스 기준으로 실제 필요한 체크리스트:

1. 서버 실행 여부
2. 폰에서 서버 IP 접근 가능 여부
3. `EXPO_PUBLIC_API_BASE_URL` 값 확인
4. Expo Go 연결 방식(LAN/터널) 확인
5. 회원가입 시 SMTP 설정 확인
6. 푸시 테스트 범위 제외 여부 확인

### 6.10 현재 상태에 대한 종합 판단

현재 프로젝트는 다음 판단이 가장 정확하다.

1. Expo Go로 안드로이드 폰에서 앱 화면을 띄우는 시도는 가능하다.
2. 그러나 환경 변수 없이 실행하면 API 호출은 거의 확실히 실패한다.
3. APK 생성 경로는 아직 설정되지 않았고, native project 및 Firebase/Android 식별자 준비가 먼저 필요하다.
4. 푸시 알림까지 포함한 Android 테스트는 현재 구조상 준비 부족 상태다.
5. 따라서 현재 우선순위는 “Expo Go 실기기 API 연결 성공”이고, 그 다음이 “Android native/APK 빌드 전략 확정”이다.
