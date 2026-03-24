# 로그인 실행 연구

작성일: 2026-03-23  
대상: `app/`, `server/`, `docs/api-contract.md`  
목적: 현재 코드베이스에서 “실제 로그인 기능을 실행”하려면 무엇이 이미 있고, 무엇이 비어 있으며, 어떤 의존성/설정/토큰이 필요한지 깊이 있게 정리한다.

## 1. 결론 요약

현재 `app/` 쪽 로그인 UI와 클라이언트 호출 경로는 기본적으로 연결돼 있다.  
하지만 `server/` 쪽 인증은 아직 실제 인증이 아니라 스켈레톤이므로, 지금 상태에서는 “형식상 로그인 응답은 받을 수 있어도 신뢰 가능한 로그인”은 실행되지 않는다.

핵심 이유:

- 앱은 `POST /api/auth/login` 호출, access token 저장, `/api/auth/me` 호출 구조까지 갖고 있다.
- 서버는 `POST /api/auth/login`, `POST /api/auth/signup`, `GET /api/auth/me` 엔드포인트를 노출한다.
- 그러나 서버에는 실제 사용자 엔티티/리포지토리/비밀번호 검증/JWT 서명 검증 필터가 없다.
- `GET /api/auth/me`는 현재 하드코딩된 `TODO_USER_ID`, `todo@example.com`을 반환한다.
- DB 사용자 테이블 마이그레이션도 비어 있다.

즉, “로그인 화면을 누르면 응답이 오도록” 만드는 최소 경로는 이미 일부 존재하지만, “실제 사용자 계정으로 로그인하고 인증된 세션을 유지하는 기능”은 아직 성립하지 않는다.

## 2. app 쪽 로그인 관련 파일 탐색

### 2.1 직접 관련 파일

- `app/src/screens/auth/login-screen.tsx`
- `app/src/screens/auth/signup-screen.tsx`
- `app/src/features/auth/use-auth.ts`
- `app/src/app/providers/auth-provider.tsx`
- `app/src/app/navigation/root-navigator.tsx`
- `app/src/services/api/client.ts`
- `app/src/services/storage/session-storage.ts`
- `app/src/types/api.ts`
- `app/src/types/domain.ts`

### 2.2 간접 관련 파일

- `app/App.tsx`
- `app/index.js`
- `app/package.json`
- `app/app.json`
- `app/metro.config.js`

### 2.3 현재 app 로그인 흐름

#### 1) 로그인 화면

`app/src/screens/auth/login-screen.tsx`

- `email`, `password` local state가 있다.
- `Login` 버튼을 누르면 `handleSubmit()`이 호출된다.
- 빈 값이면 submit을 중단한다.
- 정상 입력이면 `useAuth().login(email, password)`를 호출한다.

즉, 화면 입력과 버튼은 실제로 동작한다.

#### 2) 인증 훅

`app/src/features/auth/use-auth.ts`

- `submitAuth(path, email, password)`가 공통 인증 호출 경로다.
- `apiRequest<AuthResponse>(path, { method: 'POST', body: JSON.stringify({ email, password }) })`
- 성공 시:
  - `setUser(data.user)`
  - `setAccessToken(data.accessToken)`
  - `sessionStorage.setAccessToken(data.accessToken)`
- 실패 시:
  - `submitError` 설정

즉, 앱은 로그인 성공 응답이 오기만 하면 메모리 상태와 로컬 저장소까지 갱신한다.

#### 3) access token 저장

`app/src/services/storage/session-storage.ts`

- `@react-native-async-storage/async-storage` 사용
- 저장 key: `petory.access-token`
- 기능:
  - `getAccessToken()`
  - `setAccessToken(token)`
  - `clear()`

#### 4) 앱 재시작 시 세션 복구

`app/src/app/providers/auth-provider.tsx`

- mount 시 `sessionStorage.getAccessToken()` 호출
- token이 없으면:
  - `user = null`
  - `status = 'success'`
- token이 있으면:
  - `setAccessToken(token)`
  - `GET /auth/me` 호출
  - 성공 시 `setUser(me.user)`
  - 실패 시 `user = null`, `accessToken = null`, `status = 'error'`

즉, 앱의 실제 인증 판별 기준은 `/auth/me` 성공 여부다.

#### 5) 루트 분기

`app/src/app/navigation/root-navigator.tsx`

- `status === 'loading'`이면 초기화 화면
- `status === 'error'`이면 세션 복구 실패 화면
- `!user`면 auth 화면
- `user`가 있으면 app 화면

즉, login 응답만 성공해도 화면은 잠깐 app 쪽으로 갈 수 있지만, 앱 재시작 후에는 `/auth/me`가 정상 구현돼 있어야만 실제 로그인 유지가 된다.

### 2.4 app 쪽 API 호출 조건

`app/src/services/api/client.ts`

- base URL:
  - `process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || 'http://localhost:8080/api'`
- 모든 요청 기본 헤더:
  - `Content-Type: application/json`
- access token provider가 있으면 자동으로:
  - `Authorization: Bearer <token>`

즉, app에서 로그인 실행을 위해 필요한 런타임 조건은 아래와 같다.

- 백엔드 서버가 실제로 `/api/auth/login`, `/api/auth/me`를 제공해야 함
- `EXPO_PUBLIC_API_BASE_URL` 또는 기본 `http://localhost:8080/api`가 현재 브라우저/시뮬레이터에서 접근 가능해야 함

## 3. server 와의 관계

### 3.1 app이 의존하는 서버 API

app 로그인 흐름에서 직접 필요한 서버 API는 아래 3개다.

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

`docs/api-contract.md` 기준 계약:

#### `POST /api/auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "password1234"
}
```

Response:

```json
{
  "data": {
    "user": {
      "id": "usr_123",
      "email": "user@example.com"
    },
    "accessToken": "jwt_token_here"
  }
}
```

#### `GET /api/auth/me`

Response:

```json
{
  "data": {
    "user": {
      "id": "usr_123",
      "email": "user@example.com"
    }
  }
}
```

### 3.2 현재 서버 구현 상태

#### `server/src/main/kotlin/com/petory/auth/AuthController.kt`

현재 제공:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

실제 문제:

- `/me`는 토큰에서 사용자 정보를 읽지 않는다.
- 아래 값을 하드코딩해서 반환한다.
  - `id = "TODO_USER_ID"`
  - `email = "todo@example.com"`

즉, 앱은 `/auth/me`를 호출해도 실제 로그인 사용자 정보를 받을 수 없다.

#### `server/src/main/kotlin/com/petory/auth/AuthService.kt`

현재 문제:

- `signup()`는 요청 email만 사용한다.
- `login()`도 요청 email만 사용한다.
- 두 함수 모두 `UUID.randomUUID()`로 새 user id를 만든다.
- DB 조회가 없다.
- 비밀번호 검증이 없다.
- 기존 사용자 존재 여부 확인이 없다.

즉:

- 회원가입과 로그인의 의미가 구분되지 않는다.
- 같은 email로 여러 번 로그인해도 매번 새 user id가 생긴다.

#### `server/src/main/kotlin/com/petory/auth/JwtTokenProvider.kt`

현재 문제:

- JWT가 아니라 문자열 조합이다.
- `generateAccessToken(userId)` → `"TODO_ACCESS_TOKEN_FOR_$userId"`
- `validateAccessToken(token)` → 비어 있지 않으면 true
- `extractUserId(token)` → prefix 제거만 수행

즉:

- 서명 없음
- 만료 시간 없음
- 위조 방지 없음
- secret key 없음

#### `server/src/main/kotlin/com/petory/config/SecurityConfig.kt`

현재 문제:

- `/api/auth/**`는 모두 공개
- 나머지는 인증 필요
- 하지만 실제 Bearer token 인증 필터가 없다
- `SecurityContext`에 사용자 주입이 없다

즉:

- 보호 API는 실제로는 인증 정보를 어떻게 읽을지 경로가 빠져 있다.
- `/auth/me`가 공개 API로 되어 있기 때문에 access token 없이도 호출 가능하다.

### 3.3 DB 관계

#### 사용자 테이블

`server/src/main/resources/db/migration/V001__create_users.sql`

현재 내용:

```sql
-- TODO: create users table
```

즉:

- users 테이블이 없다.
- email unique 제약도 없다.
- password_hash 컬럼도 없다.

#### 추가로 없는 것

현재 서버에는 아래가 전부 없다.

- `UserEntity`
- `UserRepository`
- password encoder
- auth filter
- authenticated principal
- current user resolver

따라서 로그인 기능 실행에 필요한 서버 핵심 도메인 자체가 아직 빠져 있다.

## 4. 필요한 API 및 의존성

### 4.1 app 쪽 로그인 실행에 필요한 의존성

현재 실제 설치/선언된 관련 의존성:

`app/package.json`

- `expo`
- `react`
- `react-native`
- `react-dom`
- `react-native-web`
- `@expo/metro-runtime`
- `@react-native-async-storage/async-storage`

로그인 자체에 필요한 핵심 의존성은 이미 있다.

특히 로그인에 직접 필요한 것은 아래 두 개다.

- `fetch`를 제공하는 RN/Expo 런타임
- `@react-native-async-storage/async-storage`

즉, app 로그인은 추가 라이브러리 없이도 실행 가능하다.

### 4.2 server 쪽 로그인 실행에 필요한 의존성

현재 `server/build.gradle.kts`에 있는 관련 의존성:

- `spring-boot-starter-web`
- `spring-boot-starter-validation`
- `spring-boot-starter-security`
- `jackson-module-kotlin`
- `kotlin-reflect`

하지만 실제 로그인 구현에 보통 필요한 것이 빠져 있다.

현재 코드베이스 기준 부족한 항목:

- JPA 또는 JDBC 계층
- DB driver
- Flyway 의존성 여부 명시
- JWT 라이브러리
- password hash용 `PasswordEncoder` 실제 사용

즉, 현재 서버 의존성만으로는 “메모리 기반 가짜 로그인 응답”은 가능하지만, “DB + JWT 기반 실제 로그인”은 불가능하다.

### 4.3 로그인 실행에 필요한 API 최소 목록

정상적인 로그인 실행 기준 최소 API:

1. `POST /api/auth/signup`
2. `POST /api/auth/login`
3. `GET /api/auth/me`

실사용 수준까지 가면 추가로 필요한 것:

4. `POST /api/auth/logout` 또는 클라이언트 토큰 폐기 전략
5. refresh token 전략이 있으면 refresh API

현재 MVP 문서에서는 refresh token은 없다.

## 5. 외부 API 토큰, 시크릿, 환경 변수

### 5.1 로그인 자체에 필요한 외부 API 토큰

현재 로그인만 놓고 보면 외부 SaaS API 토큰은 필요 없다.

없는 것:

- OAuth client id
- Firebase Auth API key
- Auth0 domain/client secret
- Supabase anon/service key

즉, 현재 설계는 자체 백엔드 인증이다.

### 5.2 실제로 필요한 내부 시크릿

로그인을 “실제”로 만들려면 아래 시크릿/설정이 필요하다.

#### JWT secret

현재 없음.

필요한 이유:

- access token 서명
- 토큰 위조 방지
- `/auth/me` 및 보호 API 인증 검증

현재 `JwtTokenProvider`는 문자열 prefix만 쓰므로 secret이 전혀 없다.

#### DB 연결 정보

현재 `application.yml`에는 DB 설정이 없다.

실제 필요:

- JDBC URL
- username
- password
- DB driver

즉, 서버가 실제 사용자 테이블을 읽으려면 DB 설정이 반드시 필요하다.

#### CORS 허용 origin

현재 서버에 CORS 설정이 없다.

웹에서 로그인하려면 최소한 아래 origin 허용이 필요할 가능성이 높다.

- Expo web dev origin
- localhost web origin

현재 `server/src/main`에는 `CorsConfiguration` 또는 `@CrossOrigin`이 없다.
따라서 브라우저에서 app → server 호출 시 CORS 차단 가능성이 높다.

### 5.3 외부 푸시/기타 토큰과 로그인의 관계

`@react-native-firebase/messaging` 및 알림 토큰은 로그인 자체에는 직접 필요 없다.

다만 로그인 후 설정 화면에서 푸시 동기화를 하면 아래가 추가로 필요하다.

- Firebase 프로젝트 설정
- FCM device token
- 서버 notification token 저장

이것은 로그인 실행의 선행조건은 아니다.

## 6. 현재 로그인 실행을 막는 실제 차이점

### 6.1 app은 거의 준비됐지만 서버가 준비되지 않음

app 쪽 준비된 것:

- 로그인 화면 입력
- 로그인 API 호출
- token 저장
- `/auth/me` bootstrap
- `Authorization` 헤더 주입

server 쪽 비어 있는 것:

- user 저장소
- 비밀번호 저장/검증
- JWT 서명/검증
- `/auth/me` 실제 사용자 반환
- 보호 API용 auth filter

### 6.2 로그인 성공 응답의 의미가 없음

현재 `login()`은 email만 보고 새 UUID를 만들어 응답한다.

즉:

- 존재하지 않는 계정도 로그인 가능
- 잘못된 비밀번호 개념이 없음
- 같은 계정의 재로그인 식별이 안 됨

### 6.3 `/auth/me`가 현재 사용자와 무관

app은 `/auth/me` 성공을 세션 복구 근거로 사용한다.

하지만 서버는 현재 아래 값을 항상 반환한다.

- `TODO_USER_ID`
- `todo@example.com`

즉:

- 로그인 직후 `useAuth.login()`으로는 `user.email = 입력값`이 들어갈 수 있다.
- 하지만 앱을 재시작하면 `/auth/me`가 다른 가짜 사용자 값을 반환한다.
- 따라서 세션 일관성이 깨진다.

### 6.4 web 실행 시 CORS 가능성

브라우저에서 로그인 확인을 하려면 app → server가 cross-origin이 된다.

현재 확인 결과:

- app base URL은 `http://localhost:8080/api`
- server에 CORS 설정 없음

즉:

- Expo web 또는 브라우저 preview에서 로그인 시 preflight 또는 실제 fetch가 CORS로 막힐 가능성이 매우 높다.

### 6.5 DB 마이그레이션이 비어 있음

`V001__create_users.sql`가 TODO 상태이므로, 실제 회원가입/로그인 persistence가 불가능하다.

## 7. 실제 로그인 실행을 위해 필요한 최소 조건

### 7.1 app 최소 조건

- `EXPO_PUBLIC_API_BASE_URL` 또는 기본 `http://localhost:8080/api`가 실제 서버를 가리켜야 함
- 로그인 화면에서 `POST /api/auth/login`이 200 응답을 받아야 함
- AsyncStorage가 정상 동작해야 함
- `/api/auth/me`가 token 기반 사용자 정보를 반환해야 함

### 7.2 server 최소 조건

- users 테이블 생성
- 사용자 엔티티/리포지토리 추가
- 회원가입 시 email 중복 체크 + password hash 저장
- 로그인 시 email 조회 + password 검증
- JWT 서명 토큰 발급
- Bearer token 검증 필터 추가
- `/auth/me`에서 현재 인증 사용자 반환
- web preview를 쓸 경우 CORS 허용

### 7.3 문서/계약 최소 조건

현재 `docs/api-contract.md`는 auth request/response 구조를 충분히 정의한다.

추가로 정리하면 좋은 것:

- password 최소 길이/포맷
- duplicate email 에러 코드
- invalid credential 에러 코드
- `/auth/me` unauthorized 응답 예시

## 8. 파일별 심층 메모

### 8.1 `app/src/screens/auth/login-screen.tsx`

좋은 점:

- controlled input
- submit 연결 완료

남은 점:

- email 형식 검증 없음
- 실패 메시지 구체성은 서버 에러에 의존

### 8.2 `app/src/features/auth/use-auth.ts`

좋은 점:

- signup/login 경로가 공통화됨
- 성공 시 token 저장까지 처리

문제:

- logout 시 서버 logout API는 없음
- access token 저장은 되지만 refresh 전략은 없음

### 8.3 `app/src/app/providers/auth-provider.tsx`

좋은 점:

- bootstrap 구조 존재
- access token provider와 `/auth/me` 연동 존재

문제:

- `/auth/me` 실패 시 `status = 'error'`
- 서버 미구현 상태에서는 앱이 error state로 쉽게 떨어진다.

### 8.4 `server/src/main/kotlin/com/petory/auth/AuthService.kt`

문제 핵심:

- 현재 “인증 서비스”가 아니라 “가짜 응답 생성기”다.

### 8.5 `server/src/main/kotlin/com/petory/config/SecurityConfig.kt`

문제 핵심:

- Spring Security는 켜져 있으나 실제 인증 체인이 없다.
- `/api/auth/**`가 모두 공개라 `/auth/me`도 인증 없이 접근 가능하다.

### 8.6 `server/src/main/resources/db/migration/V001__create_users.sql`

문제 핵심:

- 로그인 persistence의 시작점이 완전히 비어 있다.

## 9. 실제 로그인 실행 관점에서 필요한 항목 체크리스트

### 이미 있는 것

- 앱 로그인 화면
- 앱 signup 화면
- auth hook
- access token 저장
- auth bootstrap
- auth API 계약 문서
- 서버 auth controller route
- 서버 security starter

### 없는 것

- users table
- user entity/repository
- email unique constraint
- password hash 저장
- password 검증
- JWT secret
- JWT 라이브러리 기반 실제 토큰
- auth filter
- current user extraction
- `/auth/me` 실제 구현
- CORS 설정
- 서버 DB 설정

### 외부 토큰/시크릿 중 현재 반드시 필요한 것

- JWT secret
- DB 접속 정보

### 외부 토큰/시크릿 중 현재 로그인에는 필요 없는 것

- Firebase Auth 관련 키
- OAuth client id/secret
- FCM token

## 10. 최종 판단

현재 코드베이스에서 로그인은 “app UI → API 호출 → token 저장”까지는 이미 구조가 있다.  
하지만 실제 로그인 기능을 실행하는 데 필요한 병목은 거의 전부 `server/` 쪽에 있다.

가장 큰 병목 순서:

1. users 테이블과 사용자 저장소 부재
2. 비밀번호 해시/검증 부재
3. JWT 서명/검증 부재
4. `/auth/me` 실제 구현 부재
5. web 확인 기준에서는 CORS 부재

즉, 다음 구현 우선순위는 app이 아니라 server auth 기반 복구가 맞다.
