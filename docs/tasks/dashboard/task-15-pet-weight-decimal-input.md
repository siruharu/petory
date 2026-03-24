# Task 15: Pet Weight Decimal Input

## Goal

몸무게 필드가 웹 기준으로 소수점 입력을 안정적으로 처리하도록 폼 상태와 저장 payload를 정리한다.

## Files

- `app/src/screens/pets/pet-form-screen.tsx`
- `app/src/components/forms/pet-form.tsx`

## Requirements

- 몸무게 입력 중 `3.`, `3.5` 같은 소수점 intermediate state가 깨지지 않아야 한다
- 제출 시에는 API payload가 숫자 또는 `null` 형태를 유지해야 한다
- 기존 수정 모드와 생성 모드 모두 같은 방식으로 동작해야 한다

## Constraints

- 백엔드 계약은 바꾸지 않는다
- 몸무게 외 다른 필드 상태 구조는 최소 범위에서만 수정한다
- validation 로직은 과도하게 확장하지 않는다

## Done Criteria

- 웹에서 몸무게 소수점 입력이 가능하다
- 제출 시 잘못된 문자열이 숫자 payload로 전송되지 않는다
- 타입 오류 없이 기존 폼 제출 흐름이 유지된다
