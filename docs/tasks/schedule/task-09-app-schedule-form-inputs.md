# Task 09: App Schedule Form Inputs

## Goal

일정 생성 화면을 자유 텍스트 중심 skeleton에서 실제 제출 가능한 입력 UX로 전환한다.

## Files

- `app/src/screens/schedules/schedule-form-screen.tsx`
- `app/src/components/forms/schedule-form.tsx`
- 필요 시 `app/src/components/forms/`

## Requirements

- `petId` 직접 입력 대신 현재 선택 반려동물 컨텍스트를 사용해야 한다
- `type`은 선택형 입력으로 제공해야 한다
- `recurrenceType`은 선택형 입력으로 제공해야 한다
- `dueAt` 입력은 submit 가능한 형식으로 보정돼야 한다
- submit error와 field error를 사용자에게 보여줄 수 있어야 한다

## Constraints

- API 계약은 유지한다
- 임의 mock 구조나 임시 문자열 우회를 만들지 않는다
- 고급 캘린더 UI 도입까지는 강제하지 않는다

## Done Criteria

- 일정 생성 화면이 현재 반려동물 기준으로 제출 가능하다
- 잘못된 입력과 서버 검증 오류를 화면에서 구분해 보여줄 수 있다
