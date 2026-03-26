# Implementation 06: Schedule Pet Target Selection

작성일: 2026-03-25

## 범위

- Task 16
- Task 17

## 구현 내용

- 일정 생성 화면이 전달받은 반려동물 목록을 기준으로 실제 제출 대상 `petId`를 별도 상태로 관리하도록 정리했다.
- 반려동물이 한 마리인 경우 해당 반려동물을 자동 지정하고, 선택 UI 없이 자동 지정 안내만 노출하도록 변경했다.
- 반려동물이 여러 마리인 경우 생성 화면에서 선택 가능한 반려동물 목록을 표시하고, 현재 `selectedPetId`가 있으면 초기값으로 사용하도록 반영했다.
- 반려동물 목록이 없거나 선택이 완료되지 않은 상태에서는 잘못된 `petId`로 제출되지 않도록 제출 전 검증을 보강했다.
- 루트 일정 생성 진입 경로에서 반려동물 목록을 폼 화면으로 함께 전달하도록 연결했다.
- `docs/plan-schedule.md` 진행 상태에 task 16, 17 완료 표시를 추가했다.

## 주요 파일

- `app/src/app/navigation/root-navigator.tsx`
- `app/src/screens/schedules/schedule-form-screen.tsx`
- `app/src/components/forms/schedule-form.tsx`
- `docs/plan-schedule.md`

## 검증

- 앱 `npm run typecheck`
