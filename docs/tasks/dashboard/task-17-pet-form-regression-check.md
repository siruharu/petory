# Task 17: Pet Form Regression Check

## Goal

홈 동기화, 몸무게 입력, 품종 UI 수정 이후 기존 선택형 입력과 생일/나이 자동 계산이 회귀하지 않도록 점검하고 필요한 보정을 한다.

## Files

- `app/src/components/forms/pet-form.tsx`
- `app/src/screens/pets/pet-form-screen.tsx`
- `app/src/utils/pet-age.ts`
- 필요 시 `app/src/components/forms/select-field.tsx`
- 필요 시 `app/src/components/forms/date-picker-field.tsx`

## Requirements

- species 변경 시 breed reset이 유지되어야 한다
- birthDate 변경 시 ageText 자동 계산이 유지되어야 한다
- sex, neuteredStatus 선택 필드 동작이 깨지지 않아야 한다
- 웹 스크롤과 하단 제출 버튼 접근성도 다시 확인해야 한다

## Constraints

- 새로운 기능을 추가하지 않는다
- 회귀 수정에 필요한 최소 코드만 조정한다
- 이미 해결된 UX를 다시 단순 text input으로 되돌리지 않는다

## Done Criteria

- 기존 선택형 입력과 생일/나이 연동이 유지된다
- 홈 동기화/몸무게/품종 UI 수정 이후 typecheck가 통과한다
- 등록 폼의 기본 흐름이 전체적으로 유지된다
