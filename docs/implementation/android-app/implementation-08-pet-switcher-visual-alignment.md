# Implementation 08: Pet Switcher Visual Alignment

작성일: 2026-03-26

## 범위

- Task 18

## 구현 내용

- `PetSwitcherSheet`의 바깥 컨테이너 배경을 더 중립적인 `surface.subtle`로 낮춰 선택 카드와의 레이어 충돌을 줄였다.
- 선택 카드(`selectedRow`)는 별도 강조 카드로 보이도록 배경을 정돈하고 border/shadow를 단순하게 조정했다.
- 현재 선택 반려동물에 이니셜 avatar를 추가해 시선을 배경보다 정보 자체로 모으도록 했다.
- `선택됨` badge를 pill 형태로 정리해 선택 상태가 여백이 아니라 의도된 강조로 읽히도록 바꿨다.

## 기대 효과

- 선택 카드가 바깥 컨테이너와 따로 뜨는 느낌이 줄어든다.
- 선택 상태가 내부 흰 여백이 아니라 정보 강조로 읽힌다.
- 다른 반려동물 카드와 비교했을 때 현재 선택 카드의 시각 규칙이 더 명확해진다.

## 주요 파일

- `app/src/screens/pets/pet-switcher-sheet.tsx`
- `docs/plan-android-ui-fixes.md`

## 검증

- `npm run typecheck`
- `npx expo export --platform android`
