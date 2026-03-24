# Task 17: App Auth Friendly Error Message

## Goal

인증 화면에서 서버 내부 예외 문자열을 그대로 노출하지 않고 제품 문구 수준의 메시지로 정리한다.

## Files

- `app/src/features/auth/use-auth.ts`
- `app/src/screens/auth/signup-screen.tsx`
- `app/src/screens/auth/login-screen.tsx`

## Requirements

- 메일 전송 실패 메시지를 사용자 친화적 문구로 매핑
- `submitError` 흐름은 유지하되 내부 구현 문자열 직접 노출 제거
- 로그인/회원가입 화면 모두 같은 메시지 기준을 따르도록 정리

## Constraints

- 인증 API 계약은 바꾸지 않는다
- 화면 레이아웃을 다시 바꾸지 않는다

## Done Criteria

- 사용자 화면에 `Failed to send verification email` 같은 내부 문자열이 직접 보이지 않는다
- 인증 실패 피드백이 제품 문구 수준으로 정리된다
