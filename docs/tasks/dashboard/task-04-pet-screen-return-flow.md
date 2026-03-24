# Task 04: Pet Screen Return Flow

## Goal

반려동물 목록/등록 화면에서 이동과 복귀가 실제 사용 흐름으로 닫히도록 정리한다.

## Files

- `app/src/screens/pets/pet-list-screen.tsx`
- `app/src/screens/pets/pet-form-screen.tsx`
- 필요 시 `app/src/app/navigation/root-navigator.tsx`

## Requirements

- 목록 화면에서 등록 화면으로 이동 가능 구조 추가
- 등록 성공 후 홈 또는 목록으로 복귀하는 최소 정책 추가
- 필요 시 새로 등록된 반려동물 선택 상태 반영을 위한 callback 구조 추가

## Constraints

- 등록 성공 후 복잡한 전역 상태 동기화까지 확장하지 않는다
- 수정 모드 정책까지 완전히 닫는 것은 필수가 아니다

## Done Criteria

- 반려동물 등록 후 사용자가 흐름을 잃지 않고 홈 또는 목록으로 돌아올 수 있다

