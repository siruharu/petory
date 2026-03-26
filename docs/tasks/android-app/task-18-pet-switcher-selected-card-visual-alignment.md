# Task 18: Pet Switcher Selected Card Visual Alignment

## Goal

홈 화면의 `반려동물 전환` 영역에서 현재 선택 카드가 바깥 컨테이너와 어색하게 겹쳐 보이지 않도록 시각 계층을 정리한다.

## Files

- `app/src/screens/pets/pet-switcher-sheet.tsx`
- 필요 시 `app/src/screens/home/home-screen.tsx`

## Requirements

- 선택 카드와 바깥 컨테이너의 배경/테두리/여백 역할이 명확해야 한다
- 선택 상태가 “레이아웃 틈”이 아니라 “의도된 강조”로 읽혀야 한다
- 다른 반려동물 카드와 비교했을 때 선택 카드의 시각 규칙이 일관돼야 한다

## Constraints

- 기능 로직이나 반려동물 전환 동작은 바꾸지 않는다
- 홈 화면 전체 레이아웃 리디자인으로 범위를 넓히지 않는다
- 색상/배지/테두리 강조를 과하게 중복하지 않는다

## Done Criteria

- 실기기에서 선택 카드의 내부 흰 여백처럼 보이는 위화감이 줄어든다
- 선택 상태가 더 명확하고 자연스럽게 보인다
