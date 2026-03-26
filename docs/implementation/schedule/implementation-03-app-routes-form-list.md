# Implementation 03: App Routes, Form, List

작성일: 2026-03-25

## 범위

- Task 08
- Task 09
- Task 10
- Task 11

## 구현 내용

- 루트 navigator에 일정 목록/일정 생성 route를 추가했다.
- 홈과 상단 segmented navigation에서 일정 화면으로 실제 진입할 수 있게 연결했다.
- `selectedPetId`가 홈에서 루트 상태로 다시 올라가도록 연결해, 일정 화면이 현재 선택 반려동물 기준으로 움직이게 했다.
- 일정 생성 화면에서 `petId` 직접 입력을 제거하고, 현재 선택 반려동물 기준 생성으로 바꿨다.
- 일정 종류/반복 주기를 선택형 입력으로 전환했다.
- 예정 시각은 날짜 + 시간 입력으로 나누고 submit 전에 ISO-8601으로 정규화했다.
- 일정 목록은 background refresh, inline message, 완료 중 중복 클릭 방지, soft refresh 흐름을 반영했다.
- 일정 카드 완료 버튼은 `isCompleting` 중 비활성화되도록 바꿨다.

## 주요 파일

- `app/src/app/navigation/root-navigator.tsx`
- `app/src/screens/schedules/schedule-form-screen.tsx`
- `app/src/components/forms/schedule-form.tsx`
- `app/src/screens/schedules/schedule-list-screen.tsx`
- `app/src/components/cards/schedule-card.tsx`

## 검증

- `app`에서 `npm run typecheck` 통과
