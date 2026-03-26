# Task 04: Mobile Auth Verification Policy

## Goal

모바일 앱에서는 이메일 인증이 자동 deep link가 아니라 웹 인증 또는 토큰 수동 입력 중심이라는 점을 문서와 UX에서 명확히 한다.

## Files

- `app/src/screens/auth/verify-email-screen.tsx`
- 필요 시 `app/src/screens/auth/signup-screen.tsx`
- 필요 시 관련 문서

## Requirements

- 현재 모바일 인증 흐름의 제약이 사용자 메시지나 문서에 드러나야 한다
- 수동 토큰 입력 또는 웹 링크 인증 후 로그인 흐름이 공식 경로로 정리돼야 한다
- deep link 미지원 상태를 숨기지 않아야 한다

## Constraints

- 명시적 승인 없이 deep link 구조를 새로 도입하지 않는다
- `scheme` 추가나 verify URL 전체 개편까지 범위를 넓히지 않는다

## Done Criteria

- 모바일 테스트 중 이메일 인증 단계에서의 혼란이 줄어든다
- 현재 인증 정책이 문서와 화면 흐름에서 일치한다

