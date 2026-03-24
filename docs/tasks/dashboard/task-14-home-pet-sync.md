# Task 14: Home Pet Sync

## Goal

반려동물 등록 성공 후 홈으로 복귀했을 때 신규 반려동물이 즉시 반영되도록 홈 데이터 동기화 경로를 만든다.

## Files

- `app/src/screens/pets/pet-form-screen.tsx`
- `app/src/app/navigation/root-navigator.tsx`
- `app/src/screens/home/home-screen.tsx`

## Requirements

- 반려동물 등록 성공 이벤트가 상위 상태 또는 홈 재조회로 연결되어야 한다
- 홈 복귀 직후 `등록된 반려동물이 없어요` 상태가 남지 않아야 한다
- 현재 단순 상태 분기 구조 안에서 동작해야 한다

## Constraints

- React Navigation 같은 새로운 기술로 전환하지 않는다
- 반려동물 등록 API 계약은 바꾸지 않는다
- 최소 범위에서 홈 반영 문제만 해결한다

## Done Criteria

- 반려동물 등록 후 홈에서 신규 반려동물이 보인다
- 홈 empty state가 잘못 유지되지 않는다
- 기존 홈 진입/복귀 흐름이 깨지지 않는다
