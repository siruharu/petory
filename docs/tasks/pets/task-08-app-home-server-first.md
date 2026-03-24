# Task 08: App Home Server First

## Goal

HomeScreen이 서버 응답을 우선 사용하고 로컬 pet 상태는 fallback 수준으로만 사용하도록 정리한다.

## Files

- `app/src/screens/home/home-screen.tsx`

## Requirements

- 서버 응답 성공 시 서버 `pets`와 `selectedPet`를 우선 사용해야 한다
- 서버 실패 시에만 로컬 `pets` fallback이 동작해야 한다
- 현재 선택 항목 상단 정렬 정책은 유지해야 한다

## Constraints

- 현재 UX를 크게 바꾸지 않는다
- 홈 스크롤/요약 카드 구조는 유지한다
- 계약 필드는 바꾸지 않는다

## Done Criteria

- 홈 화면이 server-first, local-fallback 구조로 명확해진다
