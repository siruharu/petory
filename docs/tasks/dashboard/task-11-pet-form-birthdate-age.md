# Task 11: Pet Form Birthdate Age

## Goal

생일은 달력 선택으로, 나이는 생일 기준 자동 계산 표시로 전환한다.

## Files

- `app/src/components/forms/pet-form.tsx`
- `app/src/screens/pets/pet-form-screen.tsx`
- 필요 시 `app/src/utils/`

## Requirements

- `birthDate` 입력을 달력 선택 UI 또는 동등한 날짜 선택 UX로 전환
- `ageText`는 직접 입력이 아니라 자동 계산 표시로 변경
- 현재 날짜와 생일을 기준으로 나이 문자열 계산
- 생일이 없을 때의 fallback 표시 정의

## Constraints

- 서버 API 필드 이름은 유지한다
- 네이티브 전용 date picker 라이브러리를 필수 전제로 두지 않는다

## Done Criteria

- 생일을 선택하면 나이가 자동 계산되어 표시된다
- 사용자가 생일과 나이를 중복 입력하지 않는다

