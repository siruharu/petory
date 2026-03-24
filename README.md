# petory

반려동물 건강/생활 관리 앱 MVP 저장소다.

현재 상태는 초기 스켈레톤 단계다.  
React Native 모바일 앱과 Kotlin Spring Boot 백엔드의 기본 구조, API 계약 문서, 구현 계획, task 분해 문서까지 준비되어 있으며 상세 비즈니스 로직은 아직 완성되지 않았다.

## 목표

MVP의 핵심 범위는 아래 기능에 집중한다.

- 로그인
- 반려동물 등록
- 일정 관리
- 알림 토큰 등록 기반
- 기록 관리
- 홈 화면 집계

## 디렉터리 구조

### `app/`

React Native 모바일 앱 소스가 위치한다.

- `app/src/app`: 앱 공통 provider, navigation
- `app/src/screens`: 화면 단위 구성
- `app/src/components`: 재사용 가능한 UI 컴포넌트
- `app/src/features`: 기능별 API/상태 진입점
- `app/src/services`: API 클라이언트, storage, notification 서비스
- `app/src/types`: 모바일에서 사용하는 공통 타입

### `server/`

Kotlin + Spring Boot 백엔드 소스가 위치한다.

- `server/src/main/kotlin/com/petory`: 백엔드 애플리케이션 코드
- `server/src/main/resources`: 설정 파일과 DB migration
- `server/build.gradle.kts`: Gradle Kotlin DSL 빌드 설정

### `common/`

프론트엔드와 백엔드가 공유하거나 이후 공유할 계약/공통 자료 위치다.

- `common/contracts`: 공통 계약 관련 위치

### `docs/`

프로젝트 문서가 위치한다.

- `docs/research.md`: 도메인 리서치
- `docs/scope.md`: MVP 범위 정의
- `docs/plan.md`: 구현 계획
- `docs/api-contract.md`: 모바일/백엔드 API 계약
- `docs/tasks/`: 구현 task 문서

### `prompts/`

문서 작성/검토 흐름에 사용되는 프롬프트 파일이 위치한다.

## 현재 구현 상태

현재 포함된 내용:

- 모바일 화면/컴포넌트 스켈레톤
- 백엔드 controller/service/domain/repository 스켈레톤
- DB migration 초안
- API 계약 문서
- task 단위 구현 문서

현재 미포함 또는 TODO:

- 실제 DB 연결
- 실제 repository 구현
- 실제 인증/JWT 검증
- 실제 API 비즈니스 로직
- 실제 React Native 네비게이션 연결
- 실제 폼 상태 관리와 제출 로직
- 실제 푸시 SDK 연동

## 실행

### 모바일 앱

현재 로그인 검증 기준은 Expo web preview다.

기본 명령:

- `cd app`
- `npm install`
- `npm run web`

웹 로그인 확인 순서:

1. `server`를 먼저 실행한다.
2. 필요하면 `EXPO_PUBLIC_API_BASE_URL`을 맞춘다.
3. `cd app && npm run web`
4. 브라우저에서 회원가입 → 메일의 verify 링크 클릭 → 로그인 흐름을 확인한다.

예시:

- `cd app && EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api npm run web`

모바일 런타임은 여전히 가능하지만, 현재 확인 우선순위는 web이다.

### 백엔드 서버

기본 명령:

- `cd server`
- `export JAVA_HOME=$(/usr/libexec/java_home -v 21)`
- `export JWT_SECRET=<32-byte-or-longer-secret>`
- `./gradlew --no-daemon bootRun`

서버 기본 포트는 `8080`을 전제로 한다.

중요:

- 서버는 Java 21 기준으로 실행해야 한다.
- 로컬 H2 file DB를 사용하므로 schema가 크게 바뀐 뒤 부팅이 막히면 `server/data/petory.mv.db`를 정리한 뒤 다시 띄워야 한다.
- 현재는 Flyway migration 실행 후 JPA `validate`가 동작하는 구조를 전제로 한다.

로그인 기능 기준 필수 환경 변수:

- `JWT_SECRET`
- `DB_URL` 또는 기본 H2 file mode 사용
- `DB_USERNAME`
- `DB_PASSWORD`

회원가입 메일 발송까지 실제로 확인하려면 추가:

- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `EMAIL_VERIFY_BASE_URL`

중요:

- 현재 회원가입은 메일 발송 성공까지 포함해야 완료된다.
- 즉 SMTP 설정이 비어 있거나 잘못되면 회원가입 API가 실패한다.
- 이 경우 앱 화면에는 인증 메일 전송 실패 메시지가 보일 수 있다.
- 서버는 떠 있는데 회원가입만 안 된다면 가장 먼저 mail 설정을 확인해야 한다.
- `EMAIL_VERIFY_BASE_URL`은 백엔드 API 주소가 아니라 프론트 verify landing URL이어야 한다.
- 현재 권장 형식은 `http://localhost:8081/verify-email`처럼 웹 앱 주소 기준의 `/verify-email` 경로다.

회원가입 테스트용 예시:

- `MAIL_HOST=smtp.gmail.com`
- `MAIL_PORT=587`
- `MAIL_USERNAME=<smtp-account>`
- `MAIL_PASSWORD=<smtp-password-or-app-password>`
- `EMAIL_VERIFY_BASE_URL=http://localhost:8081/verify-email`

예시 실행:

- `cd server && export JAVA_HOME=$(/usr/libexec/java_home -v 21)`
- `export JWT_SECRET=0123456789abcdef0123456789abcdef`
- `export MAIL_HOST=smtp.gmail.com`
- `export MAIL_PORT=587`
- `export MAIL_USERNAME=<smtp-account>`
- `export MAIL_PASSWORD=<smtp-password-or-app-password>`
- `export EMAIL_VERIFY_BASE_URL=http://localhost:8081/verify-email`
- `./gradlew --no-daemon bootRun`

현재 구현 기준:

- 메일 설정이 없으면 signup이 실패한다.
- 개발 모드용 메일 우회는 아직 구현되지 않았다.
- 따라서 회원가입 플로우를 보려면 실제로 동작하는 SMTP 구성이 필요하다.
- 메일 링크를 클릭하면 웹 앱이 URL의 `token` query를 읽어 자동으로 이메일 인증을 시도한다.
- 자동 인증이 실패하면 앱 안에서 수동 token 입력 fallback을 사용할 수 있다.

### 서버 포트 충돌 대응

`Web server failed to start. Port 8080 was already in use.`가 나오면 코드 오류보다 먼저 포트 충돌을 의심해야 한다.

진단:

- `lsof -i :8080`

대응 방법 1: 기존 프로세스 종료

- `lsof -i :8080`로 점유 프로세스를 찾는다.
- 해당 서버나 개발 도구를 먼저 종료한다.

대응 방법 2: 다른 포트로 서버 실행

- `SERVER_PORT=8081 ./gradlew --no-daemon bootRun`

또는:

- `./gradlew --no-daemon bootRun --args='--server.port=8081'`

포트를 바꿨다면 앱 base URL도 함께 바꿔야 한다.

- `cd app && EXPO_PUBLIC_API_BASE_URL=http://localhost:8081/api npm run web`

verify 링크도 같은 웹 주소를 써야 한다.

- 예: 앱 웹 주소가 `http://localhost:8081`이면 `EMAIL_VERIFY_BASE_URL`도 `http://localhost:8081/verify-email`로 맞춘다.

### 백엔드 base URL 기준

현재 앱 코드는 [client.ts](/Users/zephyr/Documents/projects/petory/app/src/services/api/client.ts)에서 아래 우선순위를 따른다.

- `EXPO_PUBLIC_API_BASE_URL`
- 없으면 `http://localhost:8080/api`

즉 현재 기준:

- 웹 브라우저에서는 `localhost`가 개발 머신을 가리킨다.
- iOS 시뮬레이터에서는 대체로 `localhost`가 맥 호스트를 가리킨다.
- Android 에뮬레이터에서는 `localhost`가 에뮬레이터 자신을 가리킨다.
- 실제 디바이스에서는 `localhost`를 쓰면 안 된다.

권장 기준:

- 웹 브라우저: `http://localhost:8080/api`
- iOS 시뮬레이터: `http://localhost:8080/api`
- Android 에뮬레이터: `http://10.0.2.2:8080/api`
- 실기기: `http://<개발자-맥-로컬-IP>:8080/api`

따라서 새 참여자는 앱 실행 전에 `EXPO_PUBLIC_API_BASE_URL`을 현재 런타임에 맞게 지정하는 것이 우선 기준이다.

서버 포트를 바꾼 경우 예시:

- 서버를 `8081`로 띄웠다면 웹 앱도 `EXPO_PUBLIC_API_BASE_URL=http://localhost:8081/api`로 실행해야 한다.

### 로컬 개발 체크리스트

- `server`가 먼저 `8080` 포트로 실행 중이어야 한다.
- `JWT_SECRET`은 32바이트 이상이어야 한다.
- 로그인 반복 테스트를 위해 H2 file mode를 유지하는 편이 낫다.
- schema가 migration과 어긋난 상태면 `server/data/petory.mv.db`와 `server/data/petory.trace.db`를 삭제한 뒤 다시 실행한다.
- `EXPO_PUBLIC_API_BASE_URL`이 현재 플랫폼에 맞아야 한다.
- Expo web 기준 CORS origin이 서버에서 허용돼야 한다.
- 회원가입 메일 확인까지 하려면 mail 설정이 필요하다.
- mail 설정이 비어 있으면 회원가입은 실패한다.
- `EMAIL_VERIFY_BASE_URL`은 프론트 verify landing URL이어야 한다.
- 메일 링크 클릭 후 자동 인증이 되지 않으면 verify URL과 앱 웹 주소가 일치하는지 먼저 확인한다.
- `8080` 포트가 이미 사용 중이면 서버 포트를 바꾸거나 기존 프로세스를 종료해야 한다.
- 알림 기능 테스트 시 `@react-native-firebase/messaging` 설치 후 네이티브 Firebase 설정이 필요하다.
- 현재 푸시 토큰 정리는 메모리 상태 기반이므로 앱 재시작 후까지 보존되지는 않는다.

## 문서 우선 원칙

이 저장소는 아래 순서를 따른다.

1. 리서치
2. 계획
3. 메모 반영
4. task 분해
5. task 단위 구현
6. 리뷰

따라서 범위 변경, 계약 변경, 구조 변경은 먼저 문서에 반영한 뒤 구현하는 것을 기본 원칙으로 한다.
