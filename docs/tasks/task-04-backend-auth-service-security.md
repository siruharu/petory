# Task 04: 인증 Service/Security 스켈레톤 정리

## Goal
인증 서비스와 보안 설정의 최소 스켈레톤을 정리해 이후 실제 인증 구현의 진입점을 만든다.

## Files
- server/src/main/kotlin/com/petory/auth/AuthService.kt
- server/src/main/kotlin/com/petory/auth/JwtTokenProvider.kt
- server/src/main/kotlin/com/petory/config/SecurityConfig.kt

## Requirements
- AuthService 메서드 시그니처를 DTO 기준으로 맞춘다.
- JWT 토큰 발급용 Provider 스켈레톤을 추가한다.
- 인증이 필요한 경로와 공개 경로를 SecurityConfig에서 구분한다.

## Constraints
- 선행 task: task-03-backend-auth-controller-dto.md, task-02a-backend-runnable-bootstrap.md
- 실제 토큰 검증 필터와 비밀번호 인코딩 로직은 최소 스켈레톤만 둔다.

## Done Criteria
- 인증 관련 서비스/보안 파일이 분리되어 있다.
- Controller가 Service와 Provider를 의존할 수 있는 형태가 된다.
