# Task 08: App Auth Submit Error Handling

## Goal

인증 submit 흐름에서 상태 설정과 예외 전파 방식을 일관되게 정리한다.

## Files

- `app/src/features/auth/use-auth.ts`
- `app/src/screens/auth/login-screen.tsx`
- `app/src/screens/auth/signup-screen.tsx`
- `app/src/screens/auth/verify-email-screen.tsx`

## Requirements

- `useAuth`가 throw를 유지할지, 화면에서 catch할지 기준을 하나로 고정
- unhandled rejection이 남지 않도록 정리
- 기존 `submitError` 표시 흐름 유지

## Constraints

- 인증 API 계약은 바꾸지 않는다
- 화면 문구를 대폭 수정하지 않는다

## Done Criteria

- 인증 실패 시 화면 상태는 유지되고, submit 에러가 예측 가능한 방식으로 처리된다

