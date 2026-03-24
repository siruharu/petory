# app 코드베이스 연구

작성일: 2026-03-23  
대상: `app/` 하위 모바일 앱 코드베이스  
목적: 현재 앱 코드베이스의 구조, 흐름, 의존성, 문제 가능성, 실행 조건을 매우 상세히 정리한다.

## 1. 전체 구조

현재 `app/` 하위는 “실행 가능한 React Native 프로젝트”라기보다 “React Native 앱 소스 스켈레톤 모음”에 가깝다.  
즉, `src/` 내부의 타입, 서비스, 화면, 컴포넌트는 존재하지만, 실제 앱 런타임을 시작시키는 프로젝트 메타 파일은 없다.

추가 관찰:

- `asdf` 기준 Node.js `20.18.1`이 설치되어 있어도 `app/.tool-versions`가 없으면 `app/` 진입 후 `npm install`이 실패한다.
- 따라서 `app/`는 코드 파일뿐 아니라 로컬 실행 버전 고정 파일도 함께 필요하다.
- React Native CLI 기준 `metro.config.js`가 없으면 `npm run start`에서 `No Metro config found` 오류가 발생한다.
- `package.json`의 devDependencies에는 `@react-native/metro-config`도 포함되어야 한다.
- 2026-03-23 기준 사람 결정으로 앱 실행 베이스는 Expo를 채택한다.
- 따라서 이후 실행 목표는 브라우저가 아니라 Expo Go 또는 iOS/Android 시뮬레이터에서 앱을 띄우는 것이다.

### 1.1 실제 파일 구조

```text
app/
  src/
    app/
      navigation/
        root-navigator.tsx
      providers/
        auth-provider.tsx
    components/
      cards/
        record-card.tsx
        schedule-card.tsx
      common/
        screen-container.tsx
      forms/
        pet-form.tsx
        record-form.tsx
        schedule-form.tsx
    features/
      auth/
        use-auth.ts
      notifications/
        notification-api.ts
      pets/
        pet-api.ts
      records/
        record-api.ts
      schedules/
        schedule-api.ts
    screens/
      auth/
        login-screen.tsx
        signup-screen.tsx
      home/
        home-screen.tsx
      pets/
        pet-form-screen.tsx
        pet-list-screen.tsx
        pet-switcher-sheet.tsx
      records/
        record-form-screen.tsx
        record-list-screen.tsx
      schedules/
        schedule-form-screen.tsx
        schedule-list-screen.tsx
      settings/
        settings-screen.tsx
    services/
      api/
        client.ts
      notifications/
        push-service.ts
      storage/
        session-storage.ts
    types/
      api.ts
      domain.ts
```

### 1.2 계층별 역할

#### `app/src/types`

도메인 타입과 API 타입의 기준점이다.

- `domain.ts`: 앱이 내부적으로 다루는 도메인 구조
- `api.ts`: 백엔드 API 요청/응답 타입

이 계층은 전체 코드베이스에서 가장 실제적인 기반이다. 현재 다른 거의 모든 파일이 여기 타입에 의존한다.

#### `app/src/services`

외부 환경과 만나는 추상 레이어다.

- `api/client.ts`: HTTP 요청 공통 처리
- `storage/session-storage.ts`: 세션 토큰 저장소 추상화
- `notifications/push-service.ts`: 푸시 권한/토큰 획득/서버 동기화 흐름 추상화

#### `app/src/features`

기능별 API/상태 진입점이다.

- `features/auth/use-auth.ts`: 인증 훅
- `features/pets/pet-api.ts`: 반려동물 API 호출
- `features/schedules/schedule-api.ts`: 일정 API 호출
- `features/records/record-api.ts`: 기록 API 호출
- `features/notifications/notification-api.ts`: 알림 토큰 API 호출

현재 `features`는 상태 관리 라이브러리 없이 함수/훅 수준으로만 구성되어 있다.

#### `app/src/components`

재사용 가능한 UI 조각이다.

- `common/screen-container.tsx`: 공통 Safe Area 래퍼
- `forms/*`: 생성/수정 폼 골격
- `cards/*`: 목록 항목 카드 골격

#### `app/src/screens`

사용자에게 보이는 화면 단위 조합 계층이다.

- 로그인/회원가입
- 홈
- 반려동물 목록/등록/전환
- 일정 목록/등록
- 기록 목록/등록
- 설정

현재 각 화면은 “실제 데이터 연결”보다 “레이아웃 자리 만들기”가 목적이다.

#### `app/src/app`

앱 전역 구조를 담당한다.

- `providers/auth-provider.tsx`: 인증 컨텍스트
- `navigation/root-navigator.tsx`: 인증 여부에 따른 루트 분기

### 1.3 현재 구조의 본질

이 코드베이스는 다음 상태다.

- 타입 정의는 비교적 분명하다.
- API 계약은 문서와 타입으로 반영되어 있다.
- 화면과 폼은 스켈레톤이다.
- 실제 앱 엔트리포인트는 없다.
- 실제 네비게이션 라이브러리 연결이 없다.
- 실제 상태 관리와 데이터 fetching orchestration이 없다.

즉, “앱 구조 초안”은 있으나 “앱 실행체”는 아직 없다.

## 2. 핵심 로직 흐름

현재 코드 기준으로 의미 있는 핵심 흐름은 실제 동작보다 “의도된 동작 흐름” 형태로 존재한다.

### 2.1 앱 부트스트랩 흐름

관련 파일:

- `app/src/app/providers/auth-provider.tsx`
- `app/src/app/navigation/root-navigator.tsx`
- `app/src/services/storage/session-storage.ts`

단계별 흐름:

1. `AuthProvider`가 mount된다.
2. `useEffect`에서 `sessionStorage.getAccessToken()`을 호출한다.
3. 성공하면 `accessToken` 상태를 갱신하고 `status = 'success'`로 바꾼다.
4. 실패하면 `status = 'error'`로 바꾼다.
5. `RootNavigator`가 `user`, `status`를 읽는다.
6. `loading`이면 초기화 메시지, `error`이면 세션 복구 실패 메시지, `user`가 없으면 auth stack placeholder, 있으면 app stack placeholder를 보여준다.

문제:

- 토큰만 읽고 사용자 복구를 하지 않는다.
- `accessToken`이 있어도 `user`는 여전히 `null`일 수 있다.
- 따라서 현재 구조에서는 저장된 토큰이 있어도 `!user` 분기로 떨어질 가능성이 높다.

즉, 현재 부트스트랩 로직은 `세션 존재 여부`보다 `세션 저장소 접근 가능 여부`만 판별한다.

### 2.2 인증 흐름

관련 파일:

- `app/src/features/auth/use-auth.ts`
- `app/src/services/api/client.ts`
- `app/src/services/storage/session-storage.ts`
- `app/src/screens/auth/login-screen.tsx`
- `app/src/screens/auth/signup-screen.tsx`

의도된 단계별 흐름:

1. 사용자가 로그인 또는 회원가입 화면에 진입한다.
2. 화면은 `useAuth()`를 사용한다.
3. `useAuth.login()` 또는 `useAuth.signup()`가 호출된다.
4. `apiRequest()`가 `/auth/login` 또는 `/auth/signup`에 POST 요청을 보낸다.
5. 응답 `data.user`, `data.accessToken`을 받는다.
6. 훅이 `setUser`, `setAccessToken`, `sessionStorage.setAccessToken()`을 호출한다.
7. 이후 루트 네비게이터는 `user` 존재 여부에 따라 app stack으로 넘어가는 구조를 의도한다.

현재 실제 상태:

- 화면에 `TextInput`은 있지만 입력값 state가 없다.
- 버튼 `onPress`가 `() => undefined`다.
- 즉, 훅은 준비되어 있지만 화면이 훅을 실제 호출하지 않는다.
- 따라서 인증 흐름은 구조적으로만 존재하고 실행되지 않는다.

### 2.3 반려동물 흐름

관련 파일:

- `app/src/features/pets/pet-api.ts`
- `app/src/components/forms/pet-form.tsx`
- `app/src/screens/pets/pet-list-screen.tsx`
- `app/src/screens/pets/pet-form-screen.tsx`
- `app/src/screens/pets/pet-switcher-sheet.tsx`

의도된 흐름:

1. 반려동물 목록 화면에서 목록을 조회한다.
2. 등록 화면에서 `PetForm`을 이용해 반려동물을 추가한다.
3. 홈/기록/일정에서 반려동물 전환 sheet를 재사용한다.

현재 실제 상태:

- `fetchPets()`, `createPet()`, `updatePet()` 함수는 존재한다.
- 그러나 어느 화면도 이 API 함수를 호출하지 않는다.
- `PetForm`은 입력 필드와 submit 버튼 자리만 있다.
- `PetListScreen`은 `status`를 로컬 상수 `'empty'`로 고정하고 있다.
- `PetSwitcherSheet`는 재사용 가능 props 구조를 갖췄지만, 실제 선택 상태와 연결되는 상위 state가 없다.

즉, 반려동물 기능은 현재 “UI 구조는 있음, 기능 연결 없음” 상태다.

### 2.4 일정 흐름

관련 파일:

- `app/src/features/schedules/schedule-api.ts`
- `app/src/components/forms/schedule-form.tsx`
- `app/src/components/cards/schedule-card.tsx`
- `app/src/screens/schedules/*`

의도된 흐름:

1. 일정 목록 조회
2. 일정 생성
3. 일정 완료

현재 실제 상태:

- `fetchSchedules`, `createSchedule`, `completeSchedule` 함수가 존재한다.
- 목록/폼/카드 컴포넌트 구조도 존재한다.
- 하지만 `ScheduleListScreen`은 고정 `empty` 상태다.
- `ScheduleForm`은 입력 필드를 보여주지만 실제 값 state와 submit 연결이 없다.
- `completeSchedule`를 호출하는 UI는 아직 없다.

즉, 일정 기능은 API 타입까지는 준비됐지만 화면 동작은 비어 있다.

### 2.5 기록 흐름

관련 파일:

- `app/src/features/records/record-api.ts`
- `app/src/components/forms/record-form.tsx`
- `app/src/components/cards/record-card.tsx`
- `app/src/screens/records/*`

의도된 흐름:

1. 기록 목록 조회
2. 기록 생성
3. 병원 방문 메모형 기록 입력

현재 실제 상태:

- `fetchRecords(petId, type, page)`와 `createRecord()`는 존재한다.
- 폼에 `Note / Vet Visit Memo` 입력 자리도 존재한다.
- 그러나 실제 화면에서는 submit 호출이 없다.
- 목록 화면은 고정 `empty` 상태다.

즉, 기록 기능도 구조만 있고 실제 사용자 흐름은 닫혀 있지 않다.

### 2.6 홈 흐름

관련 파일:

- `app/src/screens/home/home-screen.tsx`
- `app/src/types/api.ts`
- `app/src/screens/pets/pet-switcher-sheet.tsx`

의도된 흐름:

1. 홈 API 응답을 받아 선택된 반려동물, 전체 반려동물 목록, 오늘 일정, overdue 일정, 최근 기록을 보여준다.
2. 반려동물 전환 시 `petId` 기준으로 홈 데이터를 다시 조회한다.

현재 실제 상태:

- `HomeResponse` 타입은 존재한다.
- 화면 섹션도 나뉘어 있다.
- 그러나 실제 `fetchHome` API 함수가 존재하지 않는다.
- `status`는 로컬 상수 `'empty'`다.
- `PetSwitcherSheet`는 빈 배열로 렌더링된다.

즉, 홈 화면은 현재 “레이아웃 설명 템플릿”에 가깝다.

### 2.7 알림 흐름

관련 파일:

- `app/src/services/notifications/push-service.ts`
- `app/src/features/notifications/notification-api.ts`

의도된 흐름:

1. 앱이 푸시 권한을 요청한다.
2. 권한이 허용되면 디바이스 푸시 토큰을 가져온다.
3. 서버에 토큰을 등록한다.
4. 로그아웃 또는 토큰 회수 시 서버에서 토큰을 삭제한다.

현재 실제 상태:

- `requestPushPermission()`는 항상 `'denied'`를 반환한다.
- `getDevicePushToken()`는 항상 `null`을 반환한다.
- `registerForPushNotifications()`는 권한 상태와 토큰을 묶는 구조를 제공한다.
- 서버 토큰 동기화 함수도 존재한다.

즉, API/서비스 인터페이스는 설계되어 있지만 실제 OS/SDK 연동은 없다.

## 3. 사용 기술 및 패턴

### 3.1 사용 기술

코드상 추론 가능한 기술은 다음과 같다.

- React
- React Native
- TypeScript
- `fetch` 기반 HTTP 요청
- Context API 기반 인증 상태 공유

명확히 없는 것:

- React Navigation 설정
- Expo 설정 파일
- Metro/Babel 설정
- 상태 관리 라이브러리
- 데이터 fetching 라이브러리
- form 라이브러리
- validation 라이브러리
- secure storage 라이브러리

### 3.2 패턴

#### 1) Domain Type + API Type 분리

- `types/domain.ts`와 `types/api.ts`를 분리했다.
- 이는 계약 기반 개발 방향으로는 좋다.
- 다만 현재는 둘의 차이가 크지 않아 일부 타입은 사실상 중복적이다.

#### 2) Feature API module 패턴

- `features/*-api.ts`로 API 호출을 기능별로 나눴다.
- 도메인별 접근 지점이 명확해지는 장점이 있다.
- 그러나 query cache, retry, loading 상태는 아직 각 화면에서 관리해야 한다.

#### 3) Presentational Screen Skeleton 패턴

- 각 화면은 구체 로직보다 레이아웃 placeholder와 상태 자리를 먼저 만든다.
- 초기 설계 단계에서는 빠르다.
- 반면 실행 가능한 흐름이 쉽게 지연된다.

#### 4) Provider + Hook 인증 패턴

- `AuthProvider` + `useAuth()` 구조는 자연스럽다.
- 다만 `AuthProvider`는 세션 bootstrap만 담당하고, `useAuth()`는 submit 흐름만 담당해 둘 사이 연결이 아직 반쪽이다.

#### 5) Service Boundary 패턴

- `api/client.ts`, `session-storage.ts`, `push-service.ts`가 외부 환경과의 경계를 만든다.
- 확장 방향은 좋지만 구현체가 대부분 비어 있다.

## 4. 숨겨진 의존성

현재 코드에 직접 import는 없지만, 실제 동작을 위해 암묵적으로 필요한 의존성이 많다.

### 4.1 React Native 런타임 의존성

필수:

- `react`
- `react-native`
- TypeScript 설정
- Babel 설정
- Metro bundler 설정
- RN app entry file

현재 없음:

- `package.json`
- `tsconfig.json`
- `babel.config.js`
- `app.json` 또는 Expo 설정
- `index.js` 또는 `App.tsx`

즉, import는 RN을 전제로 하지만 RN 프로젝트 메타 자체가 없다.

### 4.2 인증 의존성

`useAuth()`와 `AuthProvider`가 실제로 정상 동작하려면 아래가 필요하다.

- secure storage 구현체
- 실제 로그인/회원가입 화면 state
- 토큰 만료 처리
- `GET /auth/me` 호출 또는 토큰 기반 사용자 복구 로직
- 루트 네비게이션 전환 구조

현재 빠진 핵심:

- 저장된 토큰으로부터 사용자 복구하는 흐름

### 4.3 백엔드 계약 의존성

앱은 강하게 `docs/api-contract.md`와 백엔드 DTO 형식에 의존한다.

예시:

- 성공 응답은 항상 `{ data: ... }`
- 에러 응답은 항상 `{ error: { code, message, fieldErrors? } }`
- 필드명은 camelCase

이 계약이 바뀌면 다음 파일들이 즉시 영향을 받는다.

- `app/src/services/api/client.ts`
- `app/src/types/api.ts`
- 모든 `features/*-api.ts`

### 4.4 알림 의존성

푸시 기능은 아래 플랫폼 의존성이 숨어 있다.

- iOS/Android 권한 API
- Expo Notifications 또는 Firebase/APNs
- 토큰 lifecycle 관리

현재는 인터페이스만 있고 구현체가 없다.

### 4.5 화면 상태 관리 의존성

각 화면이 `loading / success / empty / error`를 상수로 표현하는데, 실제 구현 시 아래 중 하나가 필요하다.

- React state 기반 수동 상태 관리
- React Query / SWR 류
- Redux/Zustand 등 상태 관리 도구

현재는 어떤 방식을 쓸지 아직 고정되지 않았다.

## 5. 문제 가능성

### 5.1 앱이 실행되지 않는다

가장 큰 문제다.

원인:

- `package.json` 없음
- RN/Expo 엔트리 파일 없음
- Babel/Metro/TypeScript 설정 없음
- 실제 루트 컴포넌트 없음

영향:

- 코드가 있어도 앱으로 실행 불가

### 5.2 인증 bootstrap이 논리적으로 불완전하다

문제:

- `AuthProvider`는 토큰만 읽고 사용자 정보를 복구하지 않는다.
- 토큰이 존재해도 `user`는 `null`인 채 남을 수 있다.
- 그러면 루트 네비게이터는 auth stack으로 남는다.

영향:

- 앱 재시작 시 자동 로그인 실패 가능성 높음

### 5.3 API Authorization 헤더가 없다

`api/client.ts` 문제:

- `Authorization: Bearer <token>` 자동 주입이 없다.

영향:

- 로그인 이후 보호 API 호출 시 실패 가능성 높음

### 5.4 거의 모든 화면이 비동기 상태를 상수로 고정한다

문제:

- `const status = 'empty'` 형태가 많다.
- 실제 fetch 결과와 연결되지 않는다.

영향:

- 화면은 영구적으로 placeholder 상태에 머문다.

### 5.5 버튼과 폼이 실제 동작하지 않는다

문제:

- `onPress={() => undefined}`가 대부분이다.
- 입력값을 state로 보관하지 않는다.
- submit과 API 연결이 없다.

영향:

- 사용자 입력 흐름이 닫혀 있지 않다.

### 5.6 타입 계층은 비교적 정리돼 있지만 조립 계층이 비어 있다

문제:

- 타입/계약 작업은 많이 되어 있다.
- 그러나 `screen -> hook -> api -> render`의 닫힌 루프가 거의 없다.

영향:

- 개발이 문서/타입 중심으로는 진행됐지만 사용자 행동 검증이 아직 어렵다.

### 5.7 `fetch` 사용 환경 의존성

문제:

- RN에서는 `fetch`가 기본 제공되지만, 테스트/웹 호환성/Node 환경에 따라 다를 수 있다.
- 현재 timeout, cancellation, retry, offline 대응이 전혀 없다.

영향:

- 네트워크 오류 UX가 약하다.

### 5.8 폼 입력 방식이 너무 자유롭다

예시:

- species, type, recurrenceType 등이 `TextInput` 자유 입력이다.

영향:

- 실제 구현 시 계약에 없는 값을 사용자가 넣을 위험이 매우 높다.
- 추후 picker/select 구조로 바뀌어야 한다.

### 5.9 `HomeResponse.selectedPet`와 실제 상태 조합 미구현

문제:

- 타입은 `selectedPet: Pet | null`로 정리돼 있다.
- 그러나 selected pet를 전역 상태나 storage에 저장하는 흐름이 없다.

영향:

- 홈/일정/기록의 반려동물 전환 컨텍스트가 아직 없다.

### 5.10 `PetSwitcherSheet` 이름과 실제 UI 구현 수준의 괴리

문제:

- 이름은 sheet인데 실제로는 단순 `View`다.
- modal/bottom sheet behavior가 없다.

영향:

- 실제 네비게이션/UX 연결 시 구조 변경 가능성 있음

## 6. 개선 포인트

### 6.1 먼저 “실행 가능한 앱 프로젝트”로 승격해야 한다

최우선 개선:

- `package.json`
- `App.tsx`
- `index.js`
- `tsconfig.json`
- `babel.config.js`
- 필요 시 Expo 설정

현재는 이 단계가 없어서 다른 모든 개선이 실제 실행 검증으로 이어지지 못한다.

### 6.2 루트 앱 구조를 닫아야 한다

필요:

- `App.tsx`에서 `AuthProvider` + `RootNavigator` 조립
- navigation container 연결
- auth stack / app stack 분리

### 6.3 인증 흐름을 완성해야 한다

필요:

- 입력 state 연결
- 버튼 onPress에서 `login/signup` 호출
- 성공 시 navigation 전환
- bootstrap 시 토큰이 있으면 `/auth/me`로 user 복구
- API client에 bearer token 주입

### 6.4 화면 상태를 상수가 아니라 실제 데이터로 연결해야 한다

필요:

- 각 screen마다 `loading/success/empty/error`를 실제 fetch 결과로 파생
- 또는 공통 async state hook 도입

### 6.5 폼 입력을 자유 텍스트에서 제약형 입력으로 바꿔야 한다

예시:

- `species`: segmented control/picker
- `type`: picker
- `recurrenceType`: picker
- `RecordType`: picker

이유:

- 계약 유효값을 강제하기 위함

### 6.6 도메인별 훅이 추가되면 조립이 쉬워진다

예시:

- `usePets()`
- `useSchedules()`
- `useRecords()`
- `useHome()`

현재는 `*-api.ts`만 있고 화면 orchestration hook이 없다.

### 6.7 API client는 인증/에러/환경 설정을 확장해야 한다

필요:

- access token 헤더 주입
- base URL 환경변수화
- 네트워크 오류 메시지 정규화
- 401 처리 공통화

### 6.8 settings 화면은 사실상 비어 있다

현재:

- `SettingsScreen`은 단순 텍스트만 렌더링

최소 필요:

- 로그아웃 버튼
- 푸시 권한 상태
- 앱 버전 또는 기본 정보

### 6.9 `PetSwitcherSheet`는 전역 선택 상태와 연결돼야 한다

필요:

- selected pet 상태 저장소
- 홈/일정/기록 화면과 공유
- app restart 후 복원 여부 결정

### 6.10 컴포넌트 스타일링 전략이 아직 없다

현재:

- inline style만 사용

영향:

- 규모가 커질수록 일관성 약화

선택지:

- StyleSheet 분리
- design token
- 공통 spacing/typography constants

## 7. app 실행을 위한 최소조건

현재 상태로는 `app/`를 바로 실행할 수 없다.  
아래 조건이 최소로 충족되어야 “앱 실행”이 가능하다.

### 7.1 프로젝트 메타 파일

필수:

- `app/package.json`
- `app/tsconfig.json`
- `app/babel.config.js`

선택:

- Expo를 쓸 경우 `app/app.json` 또는 `app/app.config.ts`
- bare RN이면 Android/iOS 네이티브 프로젝트 구조

### 7.2 앱 엔트리포인트

필수:

- `app/App.tsx`
- `app/index.js` 또는 Expo 기준 엔트리 파일

최소 조립 예시 개념:

- `App.tsx`가 `AuthProvider`로 감싸고 `RootNavigator`를 렌더링해야 함

### 7.3 핵심 런타임 의존성 설치

최소 필요:

- `react`
- `react-native`
- `typescript`

실제 화면 전환까지 하려면 보통 추가 필요:

- `@react-navigation/native`
- stack/tab navigator 패키지
- RN 환경별 peer dependency

### 7.4 storage 구현

현재 `session-storage.ts`는 빈 구현이다.

최소 필요:

- secure storage 또는 async storage 연결
- `getAccessToken`, `setAccessToken`, `clear` 실제 구현

없으면:

- 세션 bootstrap 의미가 약해짐

### 7.5 루트 렌더 트리 조립

최소 필요:

- `AuthProvider`
- `RootNavigator`
- 필요 시 `NavigationContainer`

현재:

- 각각 개별 파일은 있으나 실제 앱 루트에서 조립되지 않음

### 7.6 화면 버튼 최소 연결

실행 후 “보이기만 하는 앱”을 넘어서려면 아래는 바로 연결돼야 한다.

- 로그인 버튼 -> `useAuth().login`
- 회원가입 버튼 -> `useAuth().signup`
- 최소 한 개의 app stack 화면 진입

지금은 버튼이 모두 no-op다.

### 7.7 백엔드 연동 조건

앱이 API를 실제 호출하려면:

- 백엔드 서버가 `http://localhost:8080/api`에서 접근 가능해야 함

주의:

- 시뮬레이터/에뮬레이터에서는 `localhost`가 모바일 런타임 기준으로 달라질 수 있다.
- iOS 시뮬레이터, Android 에뮬레이터, 실제 기기 모두 base URL 전략이 달라질 수 있다.

즉, 최소 실행 이후에는 API base URL을 환경별로 분리해야 한다.

### 7.8 최소 실행 체크리스트

가장 작은 실행 가능 조건:

1. `app/package.json` 생성
2. `App.tsx` 생성
3. `index.js` 또는 Expo 엔트리 생성
4. RN/Expo 의존성 설치
5. `AuthProvider` + `RootNavigator` 조립
6. `session-storage.ts` 임시라도 동작하도록 구현
7. 로그인/회원가입 화면 버튼 연결

이 7개가 충족돼야 “실행 가능한 앱”이라고 부를 수 있다.

## 8. 결론

현재 `app/` 코드는 구조 연구와 계약 반영 단계로는 의미가 있다.

강점:

- 타입 구조가 비교적 일관적이다.
- API 계약을 모바일 타입에 반영해 두었다.
- 화면/컴포넌트/서비스 레이어 구분이 분명하다.
- 반려동물, 일정, 기록, 홈, 알림의 MVP 축이 모두 보인다.

한계:

- 실행 가능한 RN 프로젝트가 아니다.
- 사용자 흐름 대부분이 실제로 닫혀 있지 않다.
- 상태 관리와 네비게이션이 연결되지 않았다.
- storage, push, auth bootstrap, API authorization이 비어 있다.

따라서 이 코드베이스는 “실행 가능한 앱”보다 “실행 가능한 앱으로 발전시키기 위한 설계형 스켈레톤”으로 보는 것이 정확하다.
