# Implementation 09: Android Back Navigation Policy

작성일: 2026-03-26

## 범위

- Task 19

## 구현 내용

- 커스텀 navigator의 단일 `route` 상태를 `routeStack`으로 확장해 하위 화면 진입 시 이전 화면 문맥을 보존하도록 바꿨다.
- 상단 세그먼트 이동은 base route 전환으로 취급해 스택을 초기화하고, 생성 폼 화면은 child route로 push되도록 분리했다.
- Android에서는 `BackHandler`를 연결해 다음 정책을 적용했다.
  - child route에서는 이전 화면으로 복귀
  - `pets`, `schedules`, `settings` 같은 base route에서는 홈으로 복귀
  - 홈 화면에서는 종료 확인 다이얼로그를 띄우고, 확인 시에만 앱 종료
- 반려동물 등록/일정 등록 화면의 취소 동작도 고정 라우트 이동 대신 `navigateBack`을 사용하도록 맞췄다.

## 기대 효과

- `새 반려동물 등록` 같은 하위 화면에서 하드웨어 뒤로가기를 눌렀을 때 앱이 종료되지 않고 이전 화면으로 돌아간다.
- 홈이 아닌 주요 섹션에서 뒤로가기를 누르면 홈으로 돌아가 Android 앱 기본 기대에 더 가깝게 동작한다.
- 홈 화면에서는 실수로 앱이 바로 종료되지 않고 확인 절차를 거친다.

## 주요 파일

- `app/src/app/navigation/root-navigator.tsx`
- `docs/plan-android-ui-fixes.md`

## 검증

- `npm run typecheck`
- `npx expo export --platform android`
