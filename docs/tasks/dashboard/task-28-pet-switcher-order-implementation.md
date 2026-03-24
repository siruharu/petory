# Task 28: Pet Switcher Order Implementation

## Goal

정해진 정책에 따라 여러 반려동물 전환 시 정렬과 선택 강조가 일관되게 보이도록 구현한다.

## Files

- `app/src/screens/home/home-screen.tsx`
- `app/src/screens/pets/pet-switcher-sheet.tsx`
- 필요 시 `app/src/app/navigation/root-navigator.tsx`

## Requirements

- 선택한 반려동물을 첫 위치로 올리거나, 반대로 고정 순서를 유지하는 정책 중 하나를 실제 코드에 반영한다
- 홈과 switcher가 같은 정렬 결과를 사용해야 한다
- 선택 강조와 정렬 기준이 서로 모순되지 않아야 한다

## Constraints

- 새로운 전역 상태 라이브러리를 추가하지 않는다
- 현재 단순 상태 구조 안에서 해결한다
- 기존 홈/등록 흐름을 깨뜨리면 안 된다

## Done Criteria

- 다중 반려동물 전환 시 정렬 정책이 실제 화면에 반영된다
- 사용자가 현재 선택 항목을 쉽게 인지할 수 있다
- typecheck가 통과한다
