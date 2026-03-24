# 구현 결과 리뷰

작성일: 2026-03-24  
대상: `app/`, `server/`, `README.md`, `docs/plan-review.md`  
목적: verify 링크 자동 인증 후속 구현 이후 현재 상태와 남은 리스크를 정리한다.

## 검증 결과

확인된 항목:

- `app`: `npm run typecheck` 통과
- verify landing 전략이 코드와 문서에 반영됨
- `/verify-email?token=...` 진입 시 앱이 token을 읽어 verify 화면으로 분기하는 경로가 추가됨

직접 확인한 파일:

- [root-navigator.tsx](/Users/zephyr/Documents/projects/petory/app/src/app/navigation/root-navigator.tsx)
- [verify-email-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/auth/verify-email-screen.tsx)
- [use-auth.ts](/Users/zephyr/Documents/projects/petory/app/src/features/auth/use-auth.ts)
- [README.md](/Users/zephyr/Documents/projects/petory/README.md)

## 해결된 항목

### 1. verify 링크 클릭과 인증 API 호출이 분리돼 있던 문제

- 기존 문제:
  - 메일 링크를 눌러도 앱이 URL의 `token` query를 읽지 못해 `POST /api/auth/verify-email`가 호출되지 않았다.
- 현재 상태:
  - [root-navigator.tsx](/Users/zephyr/Documents/projects/petory/app/src/app/navigation/root-navigator.tsx)가 웹 URL의 `token` query를 읽어 verify 경로로 분기한다.
  - [verify-email-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/auth/verify-email-screen.tsx)가 `initialToken`을 받으면 자동으로 `verifyEmail(token)`을 호출한다.
  - 성공 시 로그인 화면으로 복귀할 수 있는 동선이 추가됐다.

### 2. 수동 token 입력만 있던 verify 화면 구조

- 기존 문제:
  - verify 화면은 토큰 수동 입력만 지원했고, 기본 UX로는 부족했다.
- 현재 상태:
  - 자동 verify가 기본 경로가 됐다.
  - 수동 token 입력은 자동 실패 시 fallback 역할로 남도록 정리됐다.
  - resend verification 경로도 유지된다.

### 3. `EMAIL_VERIFY_BASE_URL` 의미 불일치

- 기존 문제:
  - 프론트 verify landing URL처럼 보이지만 실제로는 앱이 그 URL을 처리하지 못했다.
- 현재 상태:
  - [README.md](/Users/zephyr/Documents/projects/petory/README.md)에 `EMAIL_VERIFY_BASE_URL`은 프론트 verify landing URL이어야 한다는 점이 명시됐다.
  - 메일 링크 클릭 후 기대 동작도 문서화됐다.

## 남아 있는 문제

### 1. verify 링크 자동 인증은 현재 웹 초기 진입 기준으로만 처리된다

- 관련 파일:
  - [root-navigator.tsx](/Users/zephyr/Documents/projects/petory/app/src/app/navigation/root-navigator.tsx)
- 문제:
  - 현재 구현은 초기 렌더 시점의 URL을 읽는 구조다.
  - 정식 라우터가 없기 때문에 앱 실행 중 URL 변경이나 브라우저 히스토리 변화까지 일반화해 처리하지는 않는다.
- 영향:
  - 현재 요구사항인 메일 링크 첫 진입 흐름에는 충분하지만, 라우팅 확장 시 재정리가 필요하다.
- 리스크 수준:
  - 중간

### 2. 실제 브라우저 클릭 기반 end-to-end는 아직 이 문서 턴에서 재검증하지 않았다

- 관련 범위:
  - `signup -> 메일 수신 -> 링크 클릭 -> verify 성공 -> login 성공`
- 문제:
  - 코드 경로와 타입 정합성은 맞췄지만, 브라우저에서 메일 링크를 눌러 끝까지 확인하는 수동 실행 검증은 이 턴에서 다시 수행하지 않았다.
- 영향:
  - 구현 방향은 맞지만, 실제 환경 변수와 런타임 주소가 맞지 않으면 여전히 실패할 수 있다.
- 리스크 수준:
  - 중간

### 3. 회원가입은 여전히 SMTP 준비가 되어야만 성공한다

- 관련 파일:
  - [AuthService.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/auth/AuthService.kt)
  - [README.md](/Users/zephyr/Documents/projects/petory/README.md)
- 문제:
  - 현재 정책상 메일 발송은 hard requirement다.
- 영향:
  - SMTP가 없으면 signup 자체가 막힌다.
- 리스크 수준:
  - 중간

## 수정 필요 항목

### 우선 수정

1. 실제 메일 링크 클릭 기준으로 `verify -> login`을 한 번 수동 검증한다.
2. `EMAIL_VERIFY_BASE_URL`, 앱 웹 주소, API base URL이 동일한 테스트 시나리오로 맞는지 점검한다.

### 다음 수정

3. 필요하면 정식 라우터 도입 전까지 `popstate` 대응 또는 URL 상태 갱신 처리 범위를 넓힐지 검토한다.
4. SMTP 없이 개발 검증을 할 정책을 별도로 정할지 검토한다.

## 리스크 수준

### 중간

- verify 자동 인증의 실제 브라우저 end-to-end 미검증
- SMTP 미준비 시 회원가입 검증 불가
- 정식 라우터 부재로 인한 URL 처리 확장성 제한

## 총평

현재 핵심 결함이었던 “메일 링크 클릭이 실제 인증으로 이어지지 않는 문제”는 코드 구조상 해소됐다.  
이제 verify 링크는 앱으로 들어와 token 자동 처리 경로를 타며, 실패 시 수동 fallback도 제공한다.  
남은 일은 구조 수정이 아니라 실제 런타임 주소와 메일 링크를 맞춰 한 번 끝까지 검증하는 것이다.
