# Task 19: Android Back Navigation Policy

## Goal

Android 실기기에서 하드웨어 뒤로가기 버튼이 화면 이동 계약을 따르도록 정리한다.

## Files

- `app/App.tsx`
- navigation 관련 루트 파일
- 필요 시 `app/src/screens/home/home-screen.tsx`
- 필요 시 `app/src/screens/pets/pet-form-screen.tsx`

## Requirements

- 하위 화면에서는 Android 뒤로가기를 누르면 이전 화면 또는 홈으로 복귀해야 한다
- 홈 화면에서는 Android 뒤로가기를 누를 때 즉시 종료하지 않고 종료 확인 메시지를 먼저 보여야 한다
- 종료 확인에서 사용자가 확인했을 때만 앱이 종료되어야 한다

## Constraints

- 화면 이동 구조 자체를 임의로 재설계하지 않는다
- 개별 화면마다 중복된 뒤로가기 로직을 흩뿌리지 않는다
- 저장/취소 버튼 플로우와 충돌하는 임시 우회 처리로 끝내지 않는다

## Done Criteria

- `새 반려동물 등록` 같은 하위 화면에서 뒤로가기가 앱 종료가 아니라 화면 복귀로 동작한다
- 홈 화면에서 뒤로가기를 누르면 종료 확인 다이얼로그가 보인다
- 확인 시 앱이 종료되고, 취소 시 현재 화면에 남는다
