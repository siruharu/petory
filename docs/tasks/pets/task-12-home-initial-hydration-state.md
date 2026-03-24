# Task 12: Home Initial Hydration State

## Goal

첫 로그인 직후 홈 대시보드가 서버 응답 대기 중 성급하게 error state로 떨어지지 않도록 초기 hydration 상태를 정리한다.

## Files

- `app/src/screens/home/home-screen.tsx`

## Requirements

- 첫 진입 시 `loading`, `success`, `empty`, `error` 전환 조건을 다시 정리해야 한다
- 서버 응답 전에 로컬 fallback 가능성이 남아 있으면 바로 `error`를 노출하지 않아야 한다
- 서버 실패 시에도 로컬 반려동물 fallback이 있으면 `error` 대신 usable state로 수렴해야 한다
- 첫 로그인 직후 반려동물 데이터가 있는 계정은 새로고침 전에도 홈에서 반려동물 정보를 볼 수 있어야 한다

## Constraints

- 홈 카드 구성과 기존 서버 우선 원칙은 유지한다
- refresh 버튼 UX 변경은 이 task 범위에 포함하지 않는다
- API 계약이나 서버 구현은 바꾸지 않는다

## Done Criteria

- 첫 홈 진입에서 불필요한 error flash가 사라진다
- 반려동물 데이터가 있는 경우 홈이 새로고침 전에도 정상 상태로 수렴한다
