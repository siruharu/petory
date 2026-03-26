# Task 17: Dev Client Runtime Error Triage

## Goal

Android 실기기 스크린샷에서 관찰된 `expo-keep-awake` rejection 로그가 앱 코드 문제인지, Expo dev client/runtime 문제인지 재현과 근거를 기준으로 분리한다.

## Files

- Android 실행 관련 구현 문서
- 필요 시 `docs/review-android-app.md`
- 필요 시 `docs/implementation/android-app/` 하위 runbook

## Requirements

- 홈 진입 직후 동일 로그가 재현되는지 확인 결과가 남아야 한다
- 현재 앱 코드에서 직접 원인이 없는지 재확인 내용이 문서에 있어야 한다
- known issue인지 follow-up 수정 대상인지 판단 결과가 있어야 한다

## Constraints

- 증거 없이 앱 로직 문제로 단정하지 않는다
- 우선순위가 safe area와 이미지 picker보다 낮다는 점을 유지한다
- 불필요한 런타임/의존성 대규모 변경으로 확장하지 않는다

## Done Criteria

- 로그의 성격이 문서로 정리된다
- 수정 대상인지 관찰 대상인지 후속 방향이 명확해진다
