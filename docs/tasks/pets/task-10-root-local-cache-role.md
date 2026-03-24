# Task 10: Root Local Cache Role

## Goal

루트 `pets` 상태의 역할을 source of truth가 아니라 등록 직후 fallback cache로 명확히 정리한다.

## Files

- `app/src/app/navigation/root-navigator.tsx`

## Requirements

- 등록 직후 즉시 반영 UX는 유지해야 한다
- 홈/반려동물 탭이 같은 로컬 상태를 공유해야 한다
- 서버 조회 성공 시 그 데이터가 우선된다는 전제가 코드상 드러나야 한다

## Constraints

- 현재 route state 구조는 유지한다
- 전역 상태 라이브러리는 추가하지 않는다
- 불필요한 리팩토링은 하지 않는다

## Done Criteria

- 루트 로컬 `pets` 상태의 역할이 fallback cache 수준으로 명확해진다
