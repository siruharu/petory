# Task 24

## Goal
Expo web 로그인 검증을 위한 CORS 설정을 추가한다.

## Files
- server/src/main/kotlin/com/petory/config/CorsConfig.kt
- server/src/main/kotlin/com/petory/config/SecurityConfig.kt

## Requirements
- allowed origins 설정을 추가한다.
- auth API 호출에 필요한 method/header를 허용한다.
- SecurityConfig와 CORS를 연결한다.

## Constraints
- 선행 task: `task-02-auth-application-config.md`, `task-21-security-config-auth-rules.md`
- 실제 origin 값은 env 또는 yml 기준으로 읽는다.

## Done Criteria
- Expo web 또는 localhost 브라우저에서 auth API 호출이 가능해질 CORS 구성이 준비된다.

