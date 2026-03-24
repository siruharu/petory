# app 상세 구현 계획

작성일: 2026-03-23  
기준 문서: `docs/research-app.md`, `docs/api-contract.md`  
대상: `app/` 하위 앱 코드베이스  
중요: 이 문서는 설계 문서다. 구현은 포함하지 않는다.

## 0. 명시적 가정

이 문서는 다음 가정을 전제로 한다.

- 앱 UI 계층은 React Native 기준으로 유지한다.
- 앱 실행/검증 베이스는 Expo + web preview를 우선 기준으로 둔다.
- 현재 `app/`는 실행 가능한 RN 프로젝트가 아니라 `src/` 중심 스켈레톤 상태다.
- 백엔드 API 계약은 `docs/api-contract.md`를 기준으로 유지한다.
- MVP 범위는 로그인, 반려동물 등록, 일정, 기록, 홈, 알림 토큰 등록까지다.
- React Navigation 도입은 허용된다고 가정한다.
- 세션 저장은 secure storage 또는 async storage 계열로 구현한다고 가정한다.
- 상태 관리는 우선 React state/context 기반으로 유지하고, 별도 전역 상태 라이브러리는 지금 단계에서 강제하지 않는다.

이 문서는 현재 실제 파일을 기준으로 “무엇을 추가/수정해야 앱이 실행되고 동작 흐름이 닫히는지”를 코드 수준으로 적는다.

## 1. 접근 방식 상세 설명

### 1.1 목표

현재 `app/` 코드베이스의 문제는 기능 수가 부족한 것이 아니라, “실행 가능한 앱 런타임”과 “화면-상태-API가 연결된 실제 흐름”이 없다는 점이다.

추가로 현재 Android 실기기/Expo Go 기준 검증은 네이티브 모듈 제약 때문에 초기 확인 비용이 높다.
따라서 단기 우선순위는 브라우저에서 바로 확인 가능한 Expo web preview를 먼저 닫는 것이다.

따라서 app 구현 우선순위는 다음 순서가 맞다.

1. Expo web 실행 베이스 정리
2. 앱 루트 조립
3. 인증 흐름 닫기
4. 홈/반려동물/일정/기록 데이터 조회 흐름 닫기
5. 웹 런타임에서 깨지는 네이티브 의존성 격리
6. 이후 모바일 전용 기능 복구

### 1.2 구현 원칙

#### 원칙 1: 브라우저에서 뜨는 앱을 먼저 만든다

현재는 `src/`만 있고 엔트리포인트가 없으므로, 화면 작업보다 먼저 프로젝트 메타 파일과 루트 컴포넌트를 추가해야 한다.
이 프로젝트에서는 해당 실행 베이스를 Expo로 유지하되, 첫 검증 타겟을 Expo web으로 둔다.

#### 원칙 2: 기존 타입/계약을 유지한다

이미 `types/domain.ts`, `types/api.ts`, `docs/api-contract.md`가 정리되어 있으므로, 가능한 한 기존 계약을 중심으로 조립한다.

#### 원칙 3: 각 화면의 고정 상태 상수를 실제 async state로 바꾼다

현재 `status = 'empty'` 상수는 설계용 자리 표시일 뿐이다.  
각 화면은 실제 fetch 결과에서 `loading / success / empty / error`를 파생해야 한다.

#### 원칙 4: 폼 컴포넌트는 현재 “표현용”에서 “제출 가능한 폼”으로 승격한다

현재 모든 폼은 `defaultValue`와 no-op submit만 있다.  
최소한 화면 수준에서 local state를 가지고 `onSubmit`을 실제 API 호출로 연결해야 한다.

#### 원칙 5: 루트에서 인증 상태를 닫는다

현재 가장 큰 논리 결함은 `AuthProvider`가 토큰을 읽기만 하고 사용자 복구를 안 한다는 점이다.  
`/auth/me`를 사용해 user를 복원하거나, 최소한 accessToken이 있으면 me fetch를 시도하는 구조로 바꿔야 한다.

#### 원칙 6: 네이티브 전용 모듈은 앱 시작 경로에서 정적 import 하지 않는다

웹에서 확인 가능해야 하므로 `@react-native-firebase/messaging` 같은 네이티브 전용 모듈은 앱 초기 진입 시점에 직접 import 하면 안 된다.
웹 또는 Expo Go에서는 안전한 fallback 경로가 있어야 한다.

### 1.3 단계별 구현 전략

#### 단계 A: 실행 베이스

- `package.json`, `tsconfig.json`, `babel.config.js`, `App.tsx`, 엔트리 파일, Expo 설정 파일 추가
- Expo web 실행 베이스를 기준으로 프로젝트 메타를 고정

#### 단계 B: 앱 루트 조립

- `App.tsx`에서 `AuthProvider`와 `RootNavigator` 조립
- NavigationContainer와 stack 구성

#### 단계 C: 인증

- 로그인/회원가입 화면 입력 상태 연결
- `useAuth`에서 실제 submit 사용
- bootstrap 시 `GET /auth/me`로 user 복원
- API 클라이언트에 bearer token 주입

#### 단계 D: 도메인별 화면 연결

- 반려동물 목록/생성/수정
- 일정 목록/생성/완료
- 기록 목록/생성
- 홈 집계 조회

#### 단계 E: 웹 호환성 확보

- 브라우저에서 깨지는 네이티브 모듈 import 제거 또는 지연 로드
- Expo web 기준 첫 화면 진입 확인
- 웹 브라우저 기준 API base URL 확인

#### 단계 F: 알림 토큰

- 권한 요청
- 토큰 획득
- 서버 등록/삭제

## 2. 변경 대상 파일 경로

### 2.1 새로 추가해야 하는 실행 베이스 파일

```text
app/package.json
app/tsconfig.json
app/babel.config.js
app/App.tsx
app/index.js
app/app.json
```

### 2.2 기존 app 루트/공통 구조 수정 대상

```text
app/src/app/providers/auth-provider.tsx
app/src/app/navigation/root-navigator.tsx
app/src/components/common/screen-container.tsx
app/src/services/api/client.ts
app/src/services/storage/session-storage.ts
```

### 2.3 인증 관련 수정 대상

```text
app/src/features/auth/use-auth.ts
app/src/screens/auth/login-screen.tsx
app/src/screens/auth/signup-screen.tsx
app/src/types/api.ts
```

### 2.4 반려동물 관련 수정 대상

```text
app/src/features/pets/pet-api.ts
app/src/screens/pets/pet-list-screen.tsx
app/src/screens/pets/pet-form-screen.tsx
app/src/screens/pets/pet-switcher-sheet.tsx
app/src/components/forms/pet-form.tsx
```

### 2.5 일정 관련 수정 대상

```text
app/src/features/schedules/schedule-api.ts
app/src/screens/schedules/schedule-list-screen.tsx
app/src/screens/schedules/schedule-form-screen.tsx
app/src/components/forms/schedule-form.tsx
app/src/components/cards/schedule-card.tsx
```

### 2.6 기록 관련 수정 대상

```text
app/src/features/records/record-api.ts
app/src/screens/records/record-list-screen.tsx
app/src/screens/records/record-form-screen.tsx
app/src/components/forms/record-form.tsx
app/src/components/cards/record-card.tsx
```

### 2.7 홈 관련 수정 대상

```text
app/src/screens/home/home-screen.tsx
app/src/types/api.ts
```

### 2.8 알림 관련 수정 대상

```text
app/src/services/notifications/push-service.ts
app/src/features/notifications/notification-api.ts
app/src/screens/settings/settings-screen.tsx
```

## 3. 코드 스니펫

이 스니펫은 실제 구현 시 어떤 수준으로 바꿔야 하는지 보여주는 설계 예시다.

### 3.1 App 엔트리 구조 예시

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/app/providers/auth-provider';
import { RootNavigator } from './src/app/navigation/root-navigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
```

핵심 포인트:

- 현재 `RootNavigator`는 NavigationContainer 없이 standalone placeholder다.
- 실제 앱에서는 루트 조립이 반드시 필요하다.

### 3.2 인증 bootstrap 로직 예시

현재 `auth-provider.tsx`는 토큰만 읽는다. 실제로는 아래 수준이 필요하다.

```tsx
useEffect(() => {
  let mounted = true;

  async function bootstrap() {
    try {
      const token = await sessionStorage.getAccessToken();
      if (!mounted) return;

      setAccessToken(token);

      if (!token) {
        setUser(null);
        setStatus('success');
        return;
      }

      const me = await apiRequest<MeResponse>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!mounted) return;

      setUser(me.user);
      setStatus('success');
    } catch {
      if (!mounted) return;
      setUser(null);
      setAccessToken(null);
      setStatus('error');
    }
  }

  void bootstrap();
  return () => {
    mounted = false;
  };
}, []);
```

### 3.3 API client bearer token 주입 예시

현재 `api/client.ts`는 인증 헤더를 넣지 않는다. 최소한 아래 두 방식 중 하나가 필요하다.

방식 A: 호출마다 헤더 전달  
방식 B: token provider 주입

권장 예시:

```ts
let accessTokenProvider: (() => string | null) | null = null;

export function setAccessTokenProvider(provider: () => string | null) {
  accessTokenProvider = provider;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = accessTokenProvider?.();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  // existing envelope/error parsing
}
```

### 3.4 로그인 화면 실제 연결 예시

현재 `login-screen.tsx`는 입력값 state가 없다.

```tsx
export function LoginScreen() {
  const { login, isSubmitting, submitError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    await login(email, password);
  }

  return (
    <ScreenContainer>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      {submitError ? <Text>{submitError}</Text> : null}
      <Button title={isSubmitting ? 'Loading...' : 'Login'} onPress={handleSubmit} />
    </ScreenContainer>
  );
}
```

### 3.5 반려동물 목록 화면 실제 상태 연결 예시

현재 `PetListScreen`은 `status = 'empty'` 상수다.

```tsx
export function PetListScreen() {
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await fetchPets();
        if (!mounted) return;
        setPets(result);
        setStatus(result.length === 0 ? 'empty' : 'success');
      } catch {
        if (!mounted) return;
        setStatus('error');
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);
}
```

### 3.6 PetSwitcher를 전역 선택 상태와 연결하는 예시

현재 `PetSwitcherSheet`는 props 기반으로는 맞지만 상태 소유자가 없다.

```tsx
const [selectedPetId, setSelectedPetId] = useState<string | undefined>();

<PetSwitcherSheet
  pets={pets}
  selectedPetId={selectedPetId}
  onSelectPet={(petId) => {
    setSelectedPetId(petId);
    void reloadHome(petId);
  }}
/>;
```

### 3.7 Home API 추가 예시

현재 `HomeResponse` 타입은 있지만 실제 API 함수가 없다.

추가 대상 예시:

```ts
// app/src/features/home/home-api.ts
import { apiRequest } from '../../services/api/client';
import type { HomeResponse } from '../../types/api';

export function fetchHome(petId?: string) {
  const query = petId ? `?petId=${petId}` : '';
  return apiRequest<HomeResponse>(`/dashboard/home${query}`);
}
```

### 3.8 Settings 화면 최소 구현 예시

현재 `SettingsScreen`은 텍스트만 렌더링한다.

```tsx
export function SettingsScreen() {
  const { logout } = useAuth();

  return (
    <ScreenContainer>
      <View style={{ gap: 12 }}>
        <Text>Settings</Text>
        <Button title="Logout" onPress={() => void logout()} />
      </View>
    </ScreenContainer>
  );
}
```

### 3.9 Secure storage 구현 예시

현재 `session-storage.ts`는 빈 구현이다.

```ts
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'petory.access-token';

export const sessionStorage = {
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async setAccessToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },
  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },
};
```

이 부분은 Expo를 쓰는지 bare RN인지에 따라 라이브러리가 달라진다.

## 4. 데이터 흐름

### 4.1 앱 시작

1. `App.tsx`가 `AuthProvider`와 `RootNavigator`를 렌더링한다.
2. `AuthProvider`가 저장된 access token을 읽는다.
3. token이 있으면 `/auth/me` 호출로 user를 복원한다.
4. `RootNavigator`가 `status`와 `user`를 보고 auth stack 또는 app stack을 보여준다.

핵심 변경 필요 파일:

- `app/App.tsx`
- `app/src/app/providers/auth-provider.tsx`
- `app/src/app/navigation/root-navigator.tsx`
- `app/src/services/storage/session-storage.ts`
- `app/src/services/api/client.ts`

### 4.2 로그인

1. `LoginScreen`에서 email/password 입력
2. `useAuth.login()` 호출
3. `POST /auth/login`
4. `data.user`, `data.accessToken` 수신
5. token 저장
6. provider 상태 갱신
7. navigator가 app stack으로 전환

현재 막힌 지점:

- 화면 입력 state 없음
- submit handler 없음
- token 주입 로직 없음

### 4.3 반려동물 목록 조회

1. `PetListScreen` mount
2. `fetchPets()` 호출
3. `/pets` 응답 수신
4. `pets.length` 기반으로 empty/success 파생
5. 화면 렌더링

현재 막힌 지점:

- `fetchPets()`를 화면에서 호출하지 않음

### 4.4 반려동물 생성

1. `PetFormScreen`에서 `PetForm` 입력
2. local state에 payload 구성
3. `createPet()` 호출
4. 성공 시 목록 invalidate 또는 이전 화면 refresh
5. 필요 시 생성된 pet를 selected pet로 지정

현재 막힌 지점:

- 폼 state 없음
- onSubmit 연결 없음

### 4.5 홈 조회

1. `HomeScreen` mount
2. 현재 선택된 petId 기준으로 `/dashboard/home` 호출
3. selectedPet, pets, todaySchedules, overdueSchedules, recentRecords 저장
4. 각 섹션 렌더링
5. pet switch 시 `petId` 변경 후 재조회

현재 막힌 지점:

- `fetchHome()` 함수 없음
- selected pet 상태 저장소 없음

### 4.6 일정 조회/생성/완료

1. `ScheduleListScreen`에서 `fetchSchedules(petId)`
2. 생성 화면에서 `createSchedule(payload)`
3. 목록 또는 홈 카드에서 완료 액션
4. `completeSchedule(scheduleId, payload)`
5. 성공 후 목록과 홈 재조회

현재 막힌 지점:

- 완료 UI 없음
- petId 컨텍스트 없음
- 화면 상태와 API가 연결되지 않음

### 4.7 기록 조회/생성

1. `RecordListScreen`에서 `fetchRecords(petId, type, page)`
2. `RecordFormScreen`에서 `createRecord(payload)`
3. 성공 후 기록 목록 및 홈 최근 기록 재조회

현재 막힌 지점:

- 폼 상태 없음
- 목록 조회 없음

### 4.8 푸시 토큰 등록

1. 앱 또는 설정 화면에서 푸시 권한 요청
2. 권한 granted 시 디바이스 토큰 획득
3. `syncPushTokenToServer(deviceType, pushToken)` 호출
4. 서버가 `tokenId` 반환
5. logout 또는 토큰 제거 시 `removePushTokenFromServer(tokenId)`

현재 막힌 지점:

- 권한 요청 구현 없음
- 디바이스 토큰 획득 구현 없음
- `tokenId` 저장 위치 없음

## 5. 트레이드오프

### 5.1 Expo vs Bare React Native

Expo 장점:

- 앱 실행 베이스를 빠르게 만들 수 있다.
- SecureStore, Notifications 같은 기본 도구가 있다.
- MVP 초기 속도에 유리하다.

Expo 단점:

- 네이티브 세부 커스터마이징이 필요한 시점에 제약 가능성

Bare RN 장점:

- 네이티브 확장 자유도가 높다.

Bare RN 단점:

- 지금 상태에서 실행 베이스를 만드는 비용이 더 크다.

현재 코드베이스 관점 결론:

- `app/`가 아직 프로젝트 메타가 전혀 없으므로, MVP 속도 기준으로는 Expo가 더 현실적이다.
- 다만 이 선택은 사람이 확정해야 한다.

### 5.2 Context 중심 상태 관리 vs 데이터 fetching 라이브러리

Context/State 장점:

- 현재 구조와 잘 맞는다.
- 러닝 커브가 낮다.

단점:

- 홈/반려동물/일정/기록 invalidate가 많아지면 중복이 늘어난다.

React Query 류 장점:

- loading/error/cache/invalidate 관리가 쉬워진다.

단점:

- 현재 구조에 새 패턴이 들어온다.
- 기술 선택 변경이므로 문서 승인 필요성이 생길 수 있다.

현재 문맥상 보수적 결론:

- 우선 React state 기반으로 연결하고, 반복이 커지면 fetch library 도입을 검토한다.

### 5.3 자유 입력 폼 vs 제약형 입력

자유 입력 장점:

- 빠르게 구현 가능

단점:

- 계약에 없는 값 입력 가능
- 서버 validation 실패 UX 증가

결론:

- species, schedule type, recurrence, record type는 최소한 선택형 UI로 바꾸는 것이 좋다.

### 5.4 HomeScreen 단일 조회 vs 화면별 개별 조회

단일 조회 장점:

- 홈 렌더링이 단순함
- 백엔드 계약과 맞음

단점:

- home API 응답이 커질 수 있음

현재는 계약이 이미 정해져 있으므로 단일 home API 유지가 맞다.

## 6. 리스크

### 6.1 가장 큰 리스크: 앱 실행 베이스 부재

위험:

- 실행 환경을 만들기 전까지 모든 화면 수정이 실제 검증으로 이어지지 않는다.

대응:

- 먼저 `package.json`, `App.tsx`, 엔트리 파일부터 추가한다.

### 6.2 인증 루프 불완전

위험:

- 저장 토큰이 있어도 user 복구 실패
- 앱 재시작 시 로그인 화면으로 튕김

대응:

- bootstrap 시 `/auth/me` 호출
- 401 처리 시 세션 clear

### 6.3 API base URL 환경 문제

위험:

- `http://localhost:8080/api`는 시뮬레이터/실기기에서 다르게 동작할 수 있다.

대응:

- 환경변수 또는 config 파일로 base URL 분리
- dev/prod 분기 필요

### 6.4 화면 상태 중복

위험:

- 모든 화면이 비슷한 loading/error 코드를 반복

대응:

- 도메인별 custom hook 또는 공통 async pattern 도입

### 6.5 폼 상태와 submit의 반복 구현

위험:

- pet/schedule/record 폼마다 유사한 로직이 중복

대응:

- 1차는 화면별 local state
- 이후 공통 form hook 추출 검토

### 6.6 푸시 토큰 lifecycle 누락

위험:

- 앱 재설치/재로그인 시 중복 토큰
- 로그아웃 후 토큰 삭제 누락

대응:

- tokenId 저장
- logout 시 token 삭제 흐름 추가

## 7. 실제 앱 실행관련

### 7.1 현재 상태의 결론

현재 `app/`는 바로 실행할 수 없다.

이유:

- `package.json` 없음
- RN/Expo 엔트리 없음
- App 루트 없음
- navigation container 없음
- 의존성 설치 기준 없음

### 7.2 실행 가능한 최소 구성

필수 추가 파일:

```text
app/package.json
app/tsconfig.json
app/babel.config.js
app/App.tsx
app/index.js
```

Expo를 쓸 경우 추가:

```text
app/app.json
```

### 7.3 최소 실행 순서

#### 1) app 프로젝트 메타 추가

- `package.json`
- RN 또는 Expo 의존성

#### 2) 루트 조립

- `App.tsx`
- `AuthProvider`
- `RootNavigator`

#### 3) 실행 명령 정의

예시:

- Expo: `npm run start`
- RN CLI: `npm run ios`, `npm run android`

이 부분은 실제 선택한 스택에 따라 달라진다.

현재 코드베이스 기준 실제 명령:

- `cd app && npm install`
- `cd app && npm run start`
- `cd app && npx expo start --web`
- `cd app && npx react-native run-ios`
- `cd app && npx react-native run-android`

현재 `package.json`에는 `run-ios`, `run-android` 스크립트가 없으므로 직접 `npx react-native ...`를 호출해야 한다.

웹 우선 검증 기준:

1. `cd app && npx expo start --web`
2. 브라우저에서 앱 루트가 열린다.
3. 로그인 화면 또는 현재 루트 화면이 렌더링된다.
4. 네이티브 전용 모듈 오류 없이 기본 입력/버튼 상호작용이 가능하다.

### 7.4 실행 확인 기준

앱 실행 확인의 최소 완료 기준:

1. 앱 런처가 뜬다.
2. `AuthProvider`가 mount된다.
3. `RootNavigator`가 렌더링된다.
4. 로그인 화면이 보인다.
5. 버튼 탭이 가능한 상태다.

### 7.5 로컬 개발 기준에서 추가로 필요한 것

- 백엔드 서버 실행
- base URL 조정
- iOS/Android 시뮬레이터 또는 Expo Go
- 브라우저 검증 시 Expo web 실행 환경

### 7.5.1 백엔드 base URL 처리 기준

현재 실제 코드:

```ts
const API_BASE_URL = 'http://localhost:8080/api';
```

위 값은 [app/src/services/api/client.ts](/Users/zephyr/Documents/projects/petory/app/src/services/api/client.ts)에 고정돼 있다.

현재 기준 해석:

- iOS 시뮬레이터: `localhost` 사용 가능
- Android 에뮬레이터: `localhost` 사용 불가, `10.0.2.2` 필요
- 실제 디바이스: `localhost` 사용 불가, 개발 머신의 LAN IP 필요

권장 매핑:

- web browser: `http://localhost:8080/api`
- iOS simulator: `http://localhost:8080/api`
- Android emulator: `http://10.0.2.2:8080/api`
- physical device: `http://<host-machine-ip>:8080/api`

따라서 구현 기준:

1. MVP 초기에는 `client.ts` 상수 변경으로 대응 가능
2. 이후에는 `.env` 또는 플랫폼별 config module로 분리
3. 백엔드 포트는 기본 `8080` 유지

### 7.5.2 localhost 관련 주의점

- 브라우저에서는 `localhost`가 개발 머신을 그대로 가리키므로 초기 확인 경로가 가장 단순하다.
- Android 에뮬레이터에서 `localhost`는 에뮬레이터 내부를 가리킨다.
- iOS 시뮬레이터와 Android 에뮬레이터는 같은 규칙이 아니다.
- 실기기 테스트 시 맥과 디바이스가 같은 네트워크에 있어야 한다.
- 회사망/공용망에서는 방화벽 때문에 `8080` 연결이 막힐 수 있다.
- 푸시 토큰 테스트는 base URL 문제와 별개로 Firebase 네이티브 설정이 끝나야 한다.

### 7.6 실제 코드베이스 기준 추천 구현 순서

앱 실행까지 가장 현실적인 순서는 아래다.

1. `app/package.json`, `App.tsx`, 엔트리 파일 추가
2. `root-navigator.tsx`를 실제 navigation 구조로 전환
3. `auth-provider.tsx` bootstrap 보완
4. `api/client.ts` 인증 헤더 주입
5. `login-screen.tsx`, `signup-screen.tsx` 입력/submit 연결
6. `session-storage.ts` 실제 구현
7. 이후 home/pet/schedule/record 화면 연결

## 8. 최종 정리

현재 `app/` 구현 계획의 핵심은 새 기능 추가가 아니라 아래 세 가지를 닫는 것이다.

- 실행 가능한 RN 프로젝트로 만들기
- 인증 bootstrap과 루트 네비게이션 연결하기
- 화면 스켈레톤을 실제 API 호출과 상태 흐름에 연결하기

즉, 현재 가장 중요한 작업은 “UI를 더 그리는 것”이 아니라 “앱이 실제로 켜지고, 로그인되고, 데이터를 읽고, 상태가 바뀌는 최소 루프를 완성하는 것”이다.

## 9. Review Annotation

`docs/review.md` 기준으로 app 계획에는 아래 보정이 추가돼야 한다.

### 9.1 루트 네비게이션 책임 분리

기존 계획은 `RootNavigator`를 실제 앱 루트 구조로 전환하는 방향을 적었지만, 현재 구현은 상위 셸과 하위 화면이 둘 다 `ScreenContainer`를 가지는 중간 상태다.

따라서 이후 app 계획의 기준은 아래처럼 수정한다.

- 루트는 “분기”를 책임질지, “분기 + 셸”을 책임질지 먼저 고정한다.
- 둘 중 하나로 통일한다.
- 상위/하위 이중 SafeArea/패딩 구조는 금지한다.

### 9.2 실제 네비게이션 정리 기준

기존 계획의 `NavigationContainer + stack` 방향은 아직 구현과 일치하지 않는다.

따라서 다음 단계 설계 기준:

- 현행 로컬 상태 라우팅은 임시 구조로 본다.
- 실제 화면 이동이 필요한 auth / home / settings / create form 흐름은 navigation layer로 승격한다.
- 계획 문서상 “standalone placeholder” 상태는 더 이상 유지하지 않는다.

### 9.3 공통 API client 보정 기준

검토 결과 `api/client.ts`의 헤더 병합이 취약하다.

따라서 계획에 아래를 명시한다.

- `Authorization`, `Content-Type`, custom headers를 모두 안전하게 병합하는 최종 headers 생성 경로를 둔다.
- 호출자가 `init.headers`를 넘겨도 기본 헤더가 사라지지 않도록 한다.

### 9.4 인증 submit 예외 처리 기준

현재 `useAuth`는 에러 상태를 세팅한 뒤 다시 throw하고 있고, 화면은 이를 catch하지 않는다.

따라서 계획 기준:

- 화면 submit handler는 `try/catch`로 마무리하거나,
- `useAuth`가 화면에서 재throw 없이 상태 기반으로만 끝내도록 일관화한다.

둘 중 하나로 고정해야 한다.

### 9.5 푸시 플랫폼 판별 기준

기존 계획은 알림 토큰 등록만 언급했지만, 실제 검토 결과 플랫폼 값 기록 규칙이 빠져 있었다.

추가 기준:

- `deviceType`은 하드코딩하지 않는다.
- `Platform.OS` 기반으로 `ios` / `android`를 구분한다.
- web preview에서는 푸시 등록 경로를 별도 fallback으로 다룬다.
