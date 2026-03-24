# Task 27: Pet Switcher Order Policy

## Goal

여러 반려동물 전환 시 현재 선택 항목을 첫 위치로 올릴지 여부를 코드베이스 기준으로 결정하고, 필요한 상태 구조를 정리한다.

## Files

- `app/src/screens/home/home-screen.tsx`
- `app/src/screens/pets/pet-switcher-sheet.tsx`
- `app/src/app/navigation/root-navigator.tsx`

## Requirements

- 선택 상태와 정렬 상태를 분리해서 생각해야 한다
- 최소한 현재 구현이 어떤 정책을 따를지 명확히 해야 한다
- 홈과 반려동물 전환 UI가 같은 기준을 사용해야 한다

## Constraints

- 기술 선택은 바꾸지 않는다
- 이번 task에서 바로 구현하지 않아도 되지만, 구현 가능한 수준으로 정책을 좁혀야 한다
- 과도한 상태 관리 도입은 피한다

## Done Criteria

- 정렬 정책 후보와 선택 기준이 명확해진다
- 이후 구현이 필요한 파일이 좁혀진다
- `review-dashboard`와 충돌하지 않는 방향으로 정리된다
