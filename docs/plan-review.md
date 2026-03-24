# 리뷰 후속 조치 계획

작성일: 2026-03-24  
기준 문서: `docs/review.md`  
목적: 현재 이메일 인증 흐름의 실제 실패 지점을 기준으로 후속 수정 방향과 우선순위를 정리한다.  
중요: 이 문서는 후속 수정 계획 문서다. 구현 자체는 포함하지 않는다.

## 0. 전제

현재 상태를 기준으로 확인된 점:

- 서버는 Flyway, JPA, JWT 필터 기준으로 부팅 가능한 상태다.
- 회원가입 메일도 실제로 수신 가능한 상태까지는 도달했다.
- 그러나 메일의 verify 링크를 클릭해도 실제 `email_verified=true`로 이어지지 않는다.
- 즉 지금 가장 큰 문제는 “메일 발송”이 아니라 “메일 링크 클릭 후 인증 완료 경로 부재”다.

명시적 가정:

- 메일 인증 자체는 유지한다.
- 인증 구조는 `signup -> verification email -> verify-email -> login` 흐름을 유지한다.
- 앱 확인 우선순위는 Expo web preview다.
- React Navigation 정식 도입 없이도 웹 URL token 처리 정도는 최소 범위로 추가할 수 있다.

## 1. 목표

이번 후속 계획의 목표는 아래 세 가지다.

1. 메일의 verify 링크 클릭이 실제 이메일 인증 완료로 이어지게 만든다.
2. `EMAIL_VERIFY_BASE_URL`의 역할을 코드와 문서에서 일치시킨다.
3. 현재 남아 있는 개발 환경 제약(SMTP, 포트 충돌)을 2순위 문제로 정리한다.

## 2. 핵심 문제 정의

현재 이메일 인증 실패 흐름은 다음과 같다.

1. 사용자가 회원가입한다.
2. 서버가 `EMAIL_VERIFY_BASE_URL?token=...` 형태의 링크를 메일에 넣어 보낸다.
3. 사용자가 그 링크를 브라우저에서 연다.
4. 하지만 현재 앱은 URL query의 `token`을 읽지 않는다.
5. 따라서 `POST /api/auth/verify-email`가 호출되지 않는다.
6. 결과적으로 DB의 `email_verified`는 `false`로 남는다.
7. 로그인 시 `Email verification is required before login`가 계속 발생한다.

즉, “메일 링크 클릭”과 “실제 verify API 호출”이 연결되어 있지 않은 것이 본질이다.

## 3. 우선순위

### 3.1 1순위: verify 링크 landing 경로 만들기

핵심 문제:

- 브라우저 URL의 `token` query를 읽어 자동 인증하는 경로가 없다.

처리 방향:

- 웹에서 `/verify-email?token=...` 진입 시 token을 읽는 진입 경로를 만든다.
- 진입 즉시 `POST /api/auth/verify-email`를 호출한다.
- 성공/실패/재시도 상태를 명확히 표시한다.
- 성공 시 로그인 화면으로 돌아가도록 한다.

완료 기준:

- 사용자가 메일 링크만 클릭해도 실제 인증 API 호출이 수행된다.
- 이후 동일 계정으로 로그인 시 `emailVerified=true` 기준으로 통과한다.

### 3.2 2순위: `EMAIL_VERIFY_BASE_URL` 의미 정렬

핵심 문제:

- 현재 `EMAIL_VERIFY_BASE_URL`은 프론트 라우트처럼 보이지만, 앱이 그 URL을 처리하지 못한다.

처리 방향:

- 현재 선택지는 두 가지다.
  - 프론트 verify landing URL 유지 + 앱이 token 처리
  - 백엔드 confirm endpoint 추가 + 서버가 verify 후 프론트 성공 페이지로 redirect
- 이번 단계에서는 현재 구조 변경 비용이 더 낮은 “프론트 verify landing URL 유지”를 우선한다.
- 문서에도 `EMAIL_VERIFY_BASE_URL`이 “프론트 verify landing URL”임을 명시한다.

완료 기준:

- 설정값 의미와 실제 동작 경로가 일치한다.

### 3.3 3순위: 수동 토큰 입력 화면을 fallback로 재배치

핵심 문제:

- 현재 [VerifyEmailScreen](/Users/zephyr/Documents/projects/petory/app/src/screens/auth/verify-email-screen.tsx)은 수동 토큰 입력만 지원한다.
- 기본 흐름으로는 부족하지만 fallback으로는 유효하다.

처리 방향:

- 자동 인증 화면에서 실패했을 때 수동 토큰 입력으로 내려갈 수 있게 정리한다.
- 수동 입력은 기본 UX가 아니라 예외 상황 대응 수단으로 위치를 낮춘다.

완료 기준:

- 기본 인증은 링크 클릭만으로 끝나고, 수동 입력은 보조 경로로 남는다.

### 3.4 4순위: 환경 제약 문서 보강 유지

핵심 문제:

- SMTP 설정 미비와 포트 충돌은 여전히 개발 경험을 방해할 수 있다.

처리 방향:

- `README.md`에 이미 반영된 SMTP/포트 안내를 유지하고, verify landing 기준 문구까지 동기화한다.

완료 기준:

- 메일 설정, 포트, verify URL 세 조건이 실행 문서에서 한 흐름으로 설명된다.

## 4. 변경 대상 범위

### 4.1 앱

- `app/src/app/navigation/root-navigator.tsx`
- `app/src/screens/auth/verify-email-screen.tsx`
- 필요 시 `app/App.tsx`
- 필요 시 `app/src/features/auth/use-auth.ts`

앱에서 반영할 내용:

- 웹 URL query에서 `token` 읽기
- 자동 verify 호출
- loading / success / error 상태 분기
- 성공 후 로그인 이동 또는 로그인 유도 UI
- 수동 token 입력 fallback 정리

### 4.2 백엔드

- `server/src/main/kotlin/com/petory/auth/AuthService.kt`
- 필요 시 `server/src/main/kotlin/com/petory/auth/AuthController.kt`
- 필요 시 `server/src/main/resources/application.yml`

백엔드에서 반영할 내용:

- verify API 자체는 유지
- 프론트 landing 전략을 쓸 경우 백엔드 구조 변경은 최소화
- 필요하면 verify 성공/실패 메시지를 landing UX에 맞게 다듬는다

### 4.3 문서

- `README.md`
- 필요 시 `docs/plan-login.md`
- 필요 시 `docs/plan.md`

문서에서 반영할 내용:

- `EMAIL_VERIFY_BASE_URL` 역할 설명
- 웹 verify landing 사용 기준
- 메일 링크 클릭 후 기대 동작 설명

## 5. 단계별 실행 계획

### Step 1. verify landing 설계 고정

목적:

- 프론트 landing URL 전략을 확정한다.

세부 항목:

- `/verify-email?token=...` 진입을 앱이 처리하는 방향으로 고정
- 루트 네비게이터 또는 앱 초기 진입점에서 query parsing 전략 정의
- 성공/실패/재시도 UX 정의

### Step 2. 자동 verify 호출 구현

목적:

- 링크 클릭만으로 실제 인증 API가 호출되게 만든다.

세부 항목:

- URL token 추출
- `verifyEmail(token)` 자동 호출
- loading / success / error 상태 렌더링
- 성공 후 로그인 유도

### Step 3. fallback 수동 인증 화면 정리

목적:

- 자동 경로 실패 시 수동 입력을 fallback로 유지한다.

세부 항목:

- 기존 `VerifyEmailScreen` 재배치
- 자동 처리 실패 후 수동 입력 허용
- resend verification 경로 유지

### Step 4. 문서 동기화

목적:

- 코드 동작과 실행 문서의 의미를 맞춘다.

세부 항목:

- `EMAIL_VERIFY_BASE_URL` 설명 수정
- verify landing 예시 URL 추가
- 로그인 검증 절차 업데이트

## 6. 트레이드오프

### 6.1 프론트 landing URL 유지

장점:

- 현재 구조를 크게 바꾸지 않고 문제를 닫을 수 있다.
- 앱 UX 중심으로 성공/실패 상태를 제어하기 쉽다.

단점:

- 웹 query parsing과 진입 상태 분기가 추가된다.
- 정식 라우터 없이 구현하면 이후 React Navigation/Web Router 도입 시 재정리가 필요할 수 있다.

### 6.2 백엔드 confirm endpoint 추가

장점:

- 링크 클릭만으로 서버가 직접 verify 처리 가능하다.
- 프론트는 성공 결과 페이지만 보여줘도 된다.

단점:

- 서버 redirect 흐름, 성공/실패 페이지 전략까지 새로 정해야 한다.
- 현재 앱 중심 구조와 어긋날 수 있다.

현재 판단:

- 지금은 프론트 verify landing URL 전략이 구현 비용과 변경 범위 면에서 더 적절하다.

## 7. 리스크

### 높음

- verify 링크를 눌러도 실제 인증이 완료되지 않는 상태가 계속되면 로그인 기능 전체가 unusable 상태로 남는다.

### 중간

- 정식 라우터 없이 query parsing을 추가하면 이후 라우팅 구조 변경 시 재작업이 필요할 수 있다.
- SMTP 미준비 시 회원가입 검증은 여전히 제한된다.

### 낮음

- 포트 충돌은 문서 가이드로 우회 가능하다.

## 8. 완료 기준

이 계획이 완료됐다고 볼 기준은 아래와 같다.

- 메일의 verify 링크 클릭이 실제 `POST /api/auth/verify-email` 호출로 이어진다.
- verify 성공 후 동일 계정으로 로그인이 가능하다.
- 수동 token 입력 화면은 fallback 경로로만 남는다.
- `EMAIL_VERIFY_BASE_URL`의 의미가 코드와 문서에서 일치한다.
