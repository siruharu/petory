# 로그인 상세 구현 계획

작성일: 2026-03-23  
기준 문서: `docs/research-login.md`, `docs/api-contract.md`, `docs/plan.md`, `docs/plan-app.md`  
대상: `app/`, `server/` 로그인 실행 경로  
중요: 이 문서는 설계 문서다. 구현은 포함하지 않는다.

## Notes 반영 결과

- 테스트 단계 DB는 H2로 고정한다.
- ORM은 JPA로 고정한다.
- 이메일 기반 로그인 전제이므로 이메일 인증을 인증 흐름에 포함한다.
- 이메일 발송에 필요한 외부 설정은 `application.yml` 구조와 환경 변수 이름까지 명시한다.

## 0. 명시적 가정

- 인증 방식은 자체 백엔드 인증을 유지한다.
- 서버 persistence는 `Spring Data JPA + H2`로 간다.
- access token은 JWT를 사용한다.
- refresh token은 이번 범위에 포함하지 않는다.
- 로그인 검증 우선 타겟은 Expo web preview다.
- app은 이미 로그인 화면, token 저장, `/auth/me` bootstrap 구조를 갖고 있으므로 주 병목은 `server/` auth 복구다.
- 이메일 인증을 포함하되, 메일 발송 provider는 추상화한다.
- `docs/api-contract.md`의 기존 auth 계약은 그대로 두지 않는다. 이메일 인증 도입에 맞춰 수정이 필요하다.

## 1. 접근 방식

### 1.1 핵심 판단

현재 로그인 기능은 app보다 server가 훨씬 더 많이 비어 있다.  
기존 계획의 가장 큰 충돌은 아래였다.

- DB 선택이 미정이었음
- ORM 선택이 미정이었음
- signup 즉시 access token 발급 구조가 이메일 인증 도입과 충돌함

메모 반영 후 최종 접근 방식은 아래로 고정한다.

1. `H2 + JPA` 기반 users/verification persistence 추가
2. signup은 계정 생성 + 이메일 인증 토큰 발급만 수행
3. email verification 완료 후에만 login 허용
4. login 성공 시 access token 발급
5. `/auth/me`는 JWT + current user 기반으로 실제 구현
6. Expo web 검증을 위해 CORS 포함
7. app은 인증 상태/에러 메시지/인증 대기 화면만 최소 수정

### 1.2 왜 이렇게 바꾸는가

- 이메일 인증을 도입하면 signup과 login을 분리해야 논리가 일관된다.
- access token을 signup 응답에서 바로 주면 “미인증 사용자 로그인 금지”와 충돌한다.
- 현재 app은 `/auth/me`를 세션 판별 기준으로 쓰므로, 서버 current user 체인이 먼저 닫혀야 한다.
- Expo web에서 실제 로그인 테스트를 하려면 backend CORS와 base URL이 먼저 맞아야 한다.

### 1.3 최종 사용자 흐름

#### 회원가입

1. 사용자가 email/password 입력
2. `POST /api/auth/signup`
3. 서버는 user를 `emailVerified = false`로 저장
4. 서버는 verification token 생성
5. 서버는 이메일 발송
6. app은 “이메일을 확인하라” 상태를 보여준다

#### 이메일 인증

1. 사용자가 메일의 링크를 클릭하거나 코드를 입력
2. `POST /api/auth/verify-email`
3. 서버는 verification token을 검증
4. user를 `emailVerified = true`로 변경

#### 로그인

1. 사용자가 `POST /api/auth/login`
2. 서버는 email 존재 여부 확인
3. password 검증
4. `emailVerified = true` 확인
5. access token 발급
6. app은 token 저장 후 app state로 이동

## 2. 충돌 해결

### 2.1 signup 응답 충돌

기존 계획:

- signup 성공 시 `accessToken` 반환

메모 반영 후:

- signup은 계정 생성과 이메일 인증 발송만 수행
- 로그인은 인증 완료 후 별도 수행

최종 결정:

- `POST /api/auth/signup` 응답에서 `accessToken`은 제거한다.
- 대신 `emailVerificationRequired: true` 같은 상태 필드를 반환한다.

### 2.2 auth API 계약 충돌

기존 계약:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

메모 반영 후 필요 API:

- `POST /api/auth/signup`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `POST /api/auth/login`
- `GET /api/auth/me`

최종 결정:

- 기존 3개만으로는 이메일 인증 도입이 불완전하다.
- auth API를 5개로 확장한다.
- `docs/api-contract.md`는 plan 확정 후 반드시 갱신한다.

### 2.3 DB / ORM 선택 충돌

기존 계획:

- DB와 persistence 방식이 미정

메모 반영 후:

- H2
- JPA

최종 결정:

- 로그인 기능은 `Spring Data JPA + H2` 기준으로 설계한다.
- 이후 production DB 전환은 별도 확장 항목으로 둔다.

## 3. 코드 구조

### 3.1 서버 패키지 구조

```text
server/src/main/kotlin/com/petory/
  auth/
    AuthController.kt
    AuthDtos.kt
    AuthService.kt
    AuthProperties.kt
    JwtTokenProvider.kt
    JwtAuthenticationFilter.kt
    AuthenticatedUser.kt
    MailVerificationService.kt
    MailSenderPort.kt
    SmtpMailSenderAdapter.kt
  user/
    UserEntity.kt
    UserRepository.kt
    EmailVerificationTokenEntity.kt
    EmailVerificationTokenRepository.kt
  config/
    SecurityConfig.kt
    CorsConfig.kt
    MailConfig.kt
  common/
    ApiResponse.kt
    ErrorResponse.kt
    GlobalExceptionHandler.kt
```

### 3.2 app 구조

```text
app/src/
  features/auth/
    use-auth.ts
  screens/auth/
    login-screen.tsx
    signup-screen.tsx
    verify-email-screen.tsx
  app/providers/
    auth-provider.tsx
  services/api/
    client.ts
  types/
    api.ts
```

### 3.3 역할 분리

#### `AuthService`

- signup
- login
- verify email
- resend verification
- me

#### `MailVerificationService`

- verification token 생성
- token 만료 검증
- verified 처리

#### `MailSenderPort`

- 메일 발송 추상화

#### `SmtpMailSenderAdapter`

- 실제 SMTP 발송 구현

## 4. 파일 구성

### 4.1 server 신규 파일

```text
server/src/main/kotlin/com/petory/user/UserEntity.kt
server/src/main/kotlin/com/petory/user/UserRepository.kt
server/src/main/kotlin/com/petory/user/EmailVerificationTokenEntity.kt
server/src/main/kotlin/com/petory/user/EmailVerificationTokenRepository.kt
server/src/main/kotlin/com/petory/auth/AuthProperties.kt
server/src/main/kotlin/com/petory/auth/JwtAuthenticationFilter.kt
server/src/main/kotlin/com/petory/auth/AuthenticatedUser.kt
server/src/main/kotlin/com/petory/auth/MailVerificationService.kt
server/src/main/kotlin/com/petory/auth/MailSenderPort.kt
server/src/main/kotlin/com/petory/auth/SmtpMailSenderAdapter.kt
server/src/main/kotlin/com/petory/config/CorsConfig.kt
server/src/main/kotlin/com/petory/config/MailConfig.kt
```

### 4.2 server 수정 파일

```text
server/src/main/kotlin/com/petory/auth/AuthController.kt
server/src/main/kotlin/com/petory/auth/AuthDtos.kt
server/src/main/kotlin/com/petory/auth/AuthService.kt
server/src/main/kotlin/com/petory/auth/JwtTokenProvider.kt
server/src/main/kotlin/com/petory/config/SecurityConfig.kt
server/src/main/resources/application.yml
server/src/main/resources/db/migration/V001__create_users.sql
server/build.gradle.kts
```

### 4.3 app 수정 파일

```text
app/src/features/auth/use-auth.ts
app/src/app/providers/auth-provider.tsx
app/src/screens/auth/login-screen.tsx
app/src/screens/auth/signup-screen.tsx
app/src/services/api/client.ts
app/src/types/api.ts
```

### 4.4 app 신규 파일

```text
app/src/screens/auth/verify-email-screen.tsx
```

### 4.5 문서 수정 파일

```text
docs/api-contract.md
docs/tasks/
```

## 5. 데이터 모델

### 5.1 UserEntity

필수 필드:

- `id: UUID/String`
- `email: String`
- `passwordHash: String`
- `emailVerified: Boolean`
- `createdAt: Instant`
- `updatedAt: Instant`

예시:

```kotlin
@Entity
@Table(name = "users")
class UserEntity(
    @Id
    val id: String,

    @Column(nullable = false, unique = true)
    val email: String,

    @Column(name = "password_hash", nullable = false)
    val passwordHash: String,

    @Column(name = "email_verified", nullable = false)
    var emailVerified: Boolean,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant,
)
```

### 5.2 EmailVerificationTokenEntity

필수 필드:

- `id`
- `userId`
- `token`
- `expiresAt`
- `usedAt`
- `createdAt`

예시:

```kotlin
@Entity
@Table(name = "email_verification_tokens")
class EmailVerificationTokenEntity(
    @Id
    val id: String,
    @Column(name = "user_id", nullable = false)
    val userId: String,
    @Column(nullable = false, unique = true)
    val token: String,
    @Column(name = "expires_at", nullable = false)
    val expiresAt: Instant,
    @Column(name = "used_at")
    var usedAt: Instant?,
    @Column(name = "created_at", nullable = false)
    val createdAt: Instant,
)
```

## 6. DB 설계

### 6.1 users table

```sql
create table users (
    id varchar(36) primary key,
    email varchar(255) not null unique,
    password_hash varchar(255) not null,
    email_verified boolean not null default false,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

create unique index idx_users_email on users(email);
```

### 6.2 email_verification_tokens table

```sql
create table email_verification_tokens (
    id varchar(36) primary key,
    user_id varchar(36) not null,
    token varchar(255) not null unique,
    expires_at timestamp not null,
    used_at timestamp null,
    created_at timestamp not null default current_timestamp
);

create index idx_email_verification_tokens_user_id
    on email_verification_tokens(user_id);
create unique index idx_email_verification_tokens_token
    on email_verification_tokens(token);
```

### 6.3 H2 운영 기준

- profile은 `local` 또는 `test-login`으로 둔다.
- 초기 단계에서는 in-memory H2도 가능하다.
- 브라우저 로그인 반복 검증을 위해서는 file-mode H2가 더 낫다.

권장:

```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/petory
```

이유:

- 서버 재시작 시 계정 데이터 유지
- 로그인 반복 테스트 용이

## 7. API 설계

### 7.1 `POST /api/auth/signup`

기존 계획과 다르게 access token을 반환하지 않는다.

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
    "userId": "usr_123",
    "email": "user@example.com",
    "emailVerificationRequired": true
  }
}
```

### 7.2 `POST /api/auth/verify-email`

Request:

```json
{
  "token": "email_verification_token"
}
```

Response:

```json
{
  "data": {
    "verified": true,
    "email": "user@example.com"
  }
}
```

### 7.3 `POST /api/auth/resend-verification`

Request:

```json
{
  "email": "user@example.com"
}
```

Response:

```json
{
  "data": {
    "sent": true
  }
}
```

### 7.4 `POST /api/auth/login`

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
      "email": "user@example.com",
      "emailVerified": true
    },
    "accessToken": "jwt_token_here"
  }
}
```

### 7.5 `GET /api/auth/me`

Response:

```json
{
  "data": {
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "emailVerified": true
    }
  }
}
```

### 7.6 에러 코드 기준

유지:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `CONFLICT`
- `INTERNAL_SERVER_ERROR`

추가 제안:

- `EMAIL_NOT_VERIFIED`
- `TOKEN_EXPIRED`

충돌 해결:

- `INVALID_CREDENTIALS`를 새로 추가하지 않고 `UNAUTHORIZED` 안에서 처리해도 된다.
- 이메일 인증 미완료는 `FORBIDDEN`보다 `EMAIL_NOT_VERIFIED`가 app 메시지 분기에 더 명확하다.

## 8. 서버 구현 구조

### 8.1 AuthController

최종 책임:

- signup
- verify-email
- resend-verification
- login
- me

예시:

```kotlin
@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
) {
    @PostMapping("/signup")
    fun signup(@Valid @RequestBody request: SignupRequest): ApiResponse<SignupResponse>

    @PostMapping("/verify-email")
    fun verifyEmail(@Valid @RequestBody request: VerifyEmailRequest): ApiResponse<VerifyEmailResponse>

    @PostMapping("/resend-verification")
    fun resendVerification(@Valid @RequestBody request: ResendVerificationRequest): ApiResponse<ResendVerificationResponse>

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ApiResponse<LoginResponse>

    @GetMapping("/me")
    fun me(authentication: Authentication): ApiResponse<MeResponse>
}
```

### 8.2 AuthService

#### signup

1. email format 검증
2. password length 검증
3. email unique 체크
4. user 저장 with `emailVerified=false`
5. verification token 생성
6. mail sender 호출
7. signup response 반환

#### verifyEmail

1. token 조회
2. expiresAt 검사
3. usedAt 검사
4. user 조회
5. `emailVerified=true`
6. token `usedAt` 기록

#### resendVerification

1. email로 user 조회
2. 이미 verified면 no-op 또는 conflict 처리
3. 새 token 발급
4. 메일 재전송

#### login

1. email 조회
2. password 검증
3. `emailVerified` 확인
4. JWT 발급
5. login response 반환

#### me

1. current user id 읽기
2. user 조회
3. response 반환

### 8.3 JwtTokenProvider

필요 속성:

- issuer
- secret
- expiration minutes

예시 설정 키:

- `app.auth.jwt.issuer`
- `app.auth.jwt.secret`
- `app.auth.jwt.access-token-expires-minutes`

### 8.4 JwtAuthenticationFilter

동작:

1. `Authorization` 헤더 파싱
2. `Bearer ` 검사
3. token 유효성 확인
4. subject(userId) 추출
5. user 조회
6. `AuthenticatedUser` principal 생성
7. `SecurityContextHolder` 주입

### 8.5 SecurityConfig

permitAll:

- `POST /api/auth/signup`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `POST /api/auth/login`

authenticated:

- `GET /api/auth/me`
- 그 외 모든 API

추가:

- JWT filter 연결
- CORS 활성화
- stateless 유지

## 9. 메일 발송 구조

### 9.1 메일 방식

기술 선택은 메모 기준으로 “이메일 인증 채택”까지만 확정이다.
provider는 구현 시점에 사람이 선택해야 한다.

설계상 구조는 아래가 안전하다.

- `MailSenderPort`
- `SmtpMailSenderAdapter`

이 구조의 장점:

- SMTP로 시작 가능
- 이후 Resend/SendGrid로 교체 가능
- AuthService가 특정 메일 provider에 묶이지 않음

### 9.2 필요한 설정

`application.yml` 예시:

```yaml
app:
  auth:
    jwt:
      issuer: petory
      secret: ${JWT_SECRET}
      access-token-expires-minutes: ${JWT_ACCESS_TOKEN_EXPIRES_MINUTES:60}
    verification:
      token-expires-minutes: ${EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES:30}
      verify-base-url: ${EMAIL_VERIFY_BASE_URL:http://localhost:8081/verify-email}
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:8081,http://localhost:19006}

spring:
  datasource:
    url: ${DB_URL:jdbc:h2:file:./data/petory}
    username: ${DB_USERNAME:sa}
    password: ${DB_PASSWORD:}
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: validate
  mail:
    host: ${MAIL_HOST:}
    port: ${MAIL_PORT:587}
    username: ${MAIL_USERNAME:}
    password: ${MAIL_PASSWORD:}
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true
```

### 9.3 필요한 env 목록

필수:

- `JWT_SECRET`
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `EMAIL_VERIFY_BASE_URL`

이메일 발송까지 실제 사용 시 필수:

- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`

선택:

- `JWT_ACCESS_TOKEN_EXPIRES_MINUTES`
- `EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES`
- `CORS_ALLOWED_ORIGINS`

### 9.4 외부 API 토큰 필요 여부

#### SMTP 사용 시

- 별도 API 토큰은 필요 없고 메일 계정 credential이 필요하다.

#### Resend / SendGrid 같은 SaaS 사용 시

필요:

- `RESEND_API_KEY` 또는 `SENDGRID_API_KEY`

현재 설계에서는 provider 추상화만 두고, 초기 구현은 SMTP가 더 단순하다.

## 10. app 구조 계획

### 10.1 `use-auth.ts`

수정 방향:

- `signup()`은 더 이상 access token을 저장하지 않는다.
- signup 성공 시 “인증 메일 발송됨” 상태를 반환한다.
- `verifyEmail()` 또는 별도 화면 이동을 지원한다.
- `login()`만 token 저장을 수행한다.

예시:

```ts
async function signup(email: string, password: string) {
  const data = await apiRequest<SignupResponse>('/auth/signup', ...)
  return data
}
```

### 10.2 `signup-screen.tsx`

기존:

- signup 성공 후 auth context에 user/token을 넣는 구조 전제

변경:

- signup 성공 후 `verify-email-screen` 또는 안내 상태로 이동
- “인증 메일을 보냈다” 메시지 표시
- resend verification 진입 제공

### 10.3 `login-screen.tsx`

보정:

- `EMAIL_NOT_VERIFIED` 또는 `FORBIDDEN` 응답 시
  - “이메일 인증이 필요합니다” 메시지 표시
  - 재전송 화면/버튼 진입

### 10.4 `auth-provider.tsx`

유지:

- token bootstrap
- `/auth/me` 복원

보정:

- `/auth/me` 401이면 error state가 아니라 anonymous success로 전환

### 10.5 `types/api.ts`

추가 타입:

- `SignupResponse`
- `VerifyEmailRequest`
- `VerifyEmailResponse`
- `ResendVerificationRequest`
- `ResendVerificationResponse`
- `User.emailVerified`

## 11. 필요한 의존성

### 11.1 server

고정:

- `spring-boot-starter-data-jpa`
- `com.h2database:h2`
- JWT 라이브러리
- 메일 발송 라이브러리

예시:

- `org.springframework.boot:spring-boot-starter-data-jpa`
- `com.h2database:h2`
- `io.jsonwebtoken:jjwt-api`
- `io.jsonwebtoken:jjwt-impl`
- `io.jsonwebtoken:jjwt-jackson`
- `org.springframework.boot:spring-boot-starter-mail`

### 11.2 app

로그인 자체에 추가 의존성은 필수는 아니다.

유지:

- `@react-native-async-storage/async-storage`

선택:

- secure storage 전환 시 `expo-secure-store`

## 12. 데이터 흐름

### 12.1 signup

1. app → `POST /api/auth/signup`
2. user 저장 with `emailVerified=false`
3. verification token 생성
4. 메일 발송
5. app은 인증 안내 화면 표시

### 12.2 verify email

1. 사용자가 메일 링크 클릭 또는 token 입력
2. app/web → `POST /api/auth/verify-email`
3. token 검증
4. user verified 처리
5. 성공 화면 표시

### 12.3 login

1. app → `POST /api/auth/login`
2. email/password 검증
3. `emailVerified` 확인
4. access token 발급
5. app이 token 저장
6. app state 진입

### 12.4 bootstrap

1. app 시작
2. stored token 읽기
3. `/api/auth/me`
4. JWT filter 검증
5. current user 반환
6. 인증 상태 복구

## 13. 구현 순서 제안

### 1단계: server 기반 복구

- JPA/H2/mail/JWT 의존성 추가
- `application.yml` 구조 정리

### 2단계: user / verification persistence

- users migration
- verification tokens migration
- JPA entities / repositories

### 3단계: auth API 실제화

- signup
- verify-email
- resend-verification
- login

### 4단계: security chain 실제화

- JWT provider
- JWT filter
- `/auth/me`

### 5단계: web 검증

- CORS
- Expo web signup/login/verify 흐름 점검

### 6단계: app UX 보정

- signup 이후 verify-email 안내
- login 에러 분기

## 14. 최종 판단

메모 반영 후 로그인 설계의 핵심은 아래처럼 바뀐다.

- “signup 즉시 로그인”이 아니라 “signup → 이메일 인증 → login”

따라서 이번 설계에서 가장 중요한 변경점은 세 가지다.

- `H2 + JPA`로 persistence 결정을 고정
- 이메일 인증 토큰 모델과 메일 발송 구조 추가
- auth API를 verification 포함 구조로 확장

이 설계가 확정되면 다음 단계는 `docs/tasks/`에 로그인 전용 task를 다시 분해하는 것이다.

## 15. 로컬 실행 기준

### 15.1 server

기본 실행:

- `cd server`
- `./gradlew bootRun`

기본 전제:

- H2 file mode를 사용한다.
- 서버 포트는 `8080`이다.

필수 env:

- `JWT_SECRET`

권장 env:

- `DB_URL=jdbc:h2:file:./data/petory`
- `DB_USERNAME=sa`
- `DB_PASSWORD=`
- `JWT_ACCESS_TOKEN_EXPIRES_MINUTES=60`
- `EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES=30`
- `CORS_ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19006`

회원가입 메일 확인까지 할 경우 추가:

- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `EMAIL_VERIFY_BASE_URL`
- `MAIL_FROM_ADDRESS`

### 15.2 app

기본 실행:

- `cd app`
- `npm install`
- `EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api npm run web`

확인 순서:

1. 회원가입
2. 인증 메일 확인 또는 verification token 확인
3. 이메일 인증 호출
4. 로그인
5. 새로고침 후 `/auth/me` 기반 세션 복구 확인

### 15.3 최소 확인 기준

- signup 응답이 access token 대신 verification-required 구조를 반환한다.
- verify-email 성공 후 `emailVerified=true` 사용자 상태가 된다.
- login 성공 시 access token이 저장된다.
- `/auth/me`가 current user를 반환한다.
- invalid token 상태에서 app bootstrap이 anonymous 상태로 복구된다.

## 16. Review Annotation

`docs/review.md` 기준으로 로그인 계획에는 아래 보정이 추가로 필요하다.

### 16.1 서버 실행 가능 기준 보정

기존 계획은 `H2 + JPA`와 migration SQL 파일 추가까지만 적혀 있었지만, 실제 구현 검토 결과 이것만으로는 서버가 부팅되지 않는다.

따라서 로그인 계획의 실행 가능 기준에는 아래가 명시적으로 포함돼야 한다.

- migration 실행 도구를 반드시 둔다.
  - 우선안: Flyway
- `ddl-auto: validate`는 migration이 실제로 선행 적용되는 조건에서만 유지한다.
- H2 file mode를 계속 쓸 경우 기존 DB 파일 정리 전략을 함께 둔다.

즉, 이후 로그인 구현의 완료 기준은 “코드가 컴파일된다”가 아니라 “migration 반영 후 bootRun이 실제로 뜬다”여야 한다.

### 16.2 JPA 엔티티 안정성 보정

검토 결과 Kotlin JPA 엔티티 no-arg/open 설정이 빠져 있다.

따라서 설계에 아래를 추가한다.

- `kotlin("plugin.jpa")` 또는 동등한 JPA 안정화 설정을 적용한다.
- users / email_verification_tokens 엔티티는 Hibernate materialization 경로까지 고려해 구성한다.

### 16.3 인증 실패 응답 계약 보정

기존 계획은 auth API와 DTO 중심으로만 적혀 있지만, 실제로는 Security layer의 실패 응답도 계약에 맞아야 한다.

따라서 설계에 아래를 추가한다.

- 비인증 요청은 `UNAUTHORIZED` envelope를 반환한다.
- 권한 부족은 `FORBIDDEN` envelope를 반환한다.
- 이 동작은 Spring Security 기본 응답에 맡기지 않고 명시적 entry point / denied handler로 고정한다.

### 16.4 signup / resend 부분 실패 처리 보정

현재 설계는 user 저장, token 저장, 메일 발송을 한 흐름으로 놓고 있지만, 메일 실패 시 부분 저장이 남을 수 있다.

따라서 설계에 아래를 추가한다.

- signup / resend는 부분 실패 전략을 명시한다.
- 최소 기준:
  - transaction 경계 명시
  - 메일 발송 실패 시 사용자 재시도 가능성 보장
  - duplicate email 상태와 mail failure 상태를 분리해서 다룬다

### 16.5 로그인 설계의 갱신된 최종 우선순위

1. migration 실행 체인 추가
2. JPA 엔티티 안정성 보강
3. auth security 실패 응답 계약 고정
4. signup / verify / resend / login / me 기능 검증
5. app 로그인 흐름 연동 검증
