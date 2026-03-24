# Task 22: App Verify Query Token Read

## Goal

웹 진입 시 URL query의 `token`을 읽어 verify landing 흐름에 전달할 수 있게 만든다.

## Files

- `app/src/app/navigation/root-navigator.tsx`
- 필요 시 `app/App.tsx`

## Requirements

- 웹 환경에서 현재 URL의 `token` query를 읽는 최소 구조 추가
- `token`이 있으면 일반 login/signup 화면 대신 verify landing 화면으로 분기
- `token`이 없으면 기존 auth 흐름 유지

## Constraints

- React Navigation 또는 별도 라우터 라이브러리를 새로 도입하지 않는다
- 네이티브 deep link까지 확장하지 않는다

## Done Criteria

- 웹에서 `/verify-email?token=...` 형태로 진입하면 token 값을 앱이 인식한다

