# Task 23: App Verify Auto Submit

## Goal

verify landing 화면이 token을 받으면 자동으로 `POST /api/auth/verify-email`를 호출하게 만든다.

## Files

- `app/src/screens/auth/verify-email-screen.tsx`
- `app/src/features/auth/use-auth.ts`

## Requirements

- token prop 또는 동등 입력값을 받을 수 있게 구조 정리
- 화면 진입 즉시 `verifyEmail(token)` 자동 호출
- loading / success / error 상태 표시
- 성공 시 로그인으로 이동하거나 로그인 유도 메시지 표시

## Constraints

- 인증 API 계약은 바꾸지 않는다
- 수동 token 입력 fallback은 제거하지 않는다

## Done Criteria

- 메일 링크 클릭만으로 verify API가 호출된다
- 성공/실패 상태가 화면에 명확히 드러난다

