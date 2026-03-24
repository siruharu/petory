# Task 24: App Verify Fallback Manual

## Goal

자동 verify 실패 시 기존 수동 token 입력 UI를 fallback 경로로 유지하도록 정리한다.

## Files

- `app/src/screens/auth/verify-email-screen.tsx`

## Requirements

- 기본 진입은 자동 verify 중심으로 구성
- 실패 시 수동 token 입력 영역을 보이도록 정리
- resend verification 경로를 유지
- 수동 입력은 기본 UX가 아니라 보조 수단처럼 보이게 조정

## Constraints

- 화면 디자인 전체를 다시 만들지 않는다
- 회원가입/로그인 화면 구조는 건드리지 않는다

## Done Criteria

- 자동 처리 실패 후에도 사용자가 수동 인증으로 복구할 수 있다
- 수동 입력 UI가 fallback 역할로 명확해진다

