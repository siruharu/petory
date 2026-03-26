# Task 17: Schedule Multi Pet Picker

## Goal

반려동물을 여러 마리 보유한 사용자가 일정 생성 시 대상 반려동물을 목록에서 명시적으로 선택할 수 있게 한다.

## Files

- `app/src/screens/schedules/schedule-form-screen.tsx`
- `app/src/components/forms/schedule-form.tsx`
- 필요 시 반려동물 목록/선택 상태를 전달하는 일정 진입 경로 파일

## Requirements

- 사용자 반려동물 목록이 여러 마리일 경우 일정 생성 화면에서 선택 가능한 반려동물 목록이 보여야 한다
- 기존 `selectedPetId`가 있으면 초기 선택값으로 사용할 수 있어야 한다
- 사용자는 초기값을 다른 반려동물로 변경할 수 있어야 한다
- 제출 payload의 `petId`는 화면에서 최종 선택한 반려동물과 일치해야 한다
- 선택 가능한 반려동물이 없거나 아직 준비되지 않았으면 제출을 막고 이유를 보여야 한다

## Constraints

- 서버 API 계약은 유지한다
- 새로운 반려동물 선택 구조를 만들지 않는다
- 자유 텍스트 `petId` 입력으로 되돌리지 않는다

## Done Criteria

- 다두 반려동물 사용자는 일정 생성 전 대상 반려동물을 명시적으로 선택할 수 있다
- 초기 선택값과 최종 제출값이 화면 상태와 일치한다
- 반려동물 목록 부재/로딩 상태에서 잘못된 제출이 발생하지 않는다
