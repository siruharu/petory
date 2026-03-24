# Task 19: Backend Security Auto User Cleanup

## Goal

Spring Security의 기본 `inMemoryUserDetailsManager` 자동 구성이 남는 원인을 제거해 JWT 기반 인증 의도를 더 분명히 한다.

## Files

- `server/src/main/kotlin/com/petory/config/SecurityConfig.kt`
- 필요 시 `server/src/main/kotlin/com/petory/auth/`
- 필요 시 `server/build.gradle.kts`

## Requirements

- 기본 개발용 사용자 자동 생성이 왜 활성화되는지 점검
- JWT 기반 인증 구조에서 불필요한 기본 사용자 구성을 제거
- 부팅 로그에 generated security password 경고가 남지 않도록 정리

## Constraints

- 인증 방식을 세션 기반으로 바꾸지 않는다
- refresh token 등 인증 범위를 확장하지 않는다

## Done Criteria

- 부팅 로그에 generated security password 경고가 사라진다
- 보안 설정 의도가 JWT/stateless 기준으로 더 명확해진다
