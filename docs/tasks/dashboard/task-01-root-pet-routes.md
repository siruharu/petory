# Task 01: Root Pet Routes

## Goal

앱 루트 상태 분기에 반려동물 목록/등록 경로를 추가해 홈 외의 반려동물 화면으로 진입할 수 있게 만든다.

## Files

- `app/src/app/navigation/root-navigator.tsx`

## Requirements

- 앱 상태 분기에 최소 `pets`, `pet-create` 추가
- 기존 `home`, `settings` 흐름은 유지
- 홈에서 전달받은 callback으로 반려동물 화면 이동 가능 구조 추가

## Constraints

- React Navigation 같은 새 라우터를 도입하지 않는다
- 앱 전체 내비게이션 구조를 재설계하지 않는다

## Done Criteria

- 루트에서 반려동물 목록과 등록 화면으로 실제 전환할 수 있다

