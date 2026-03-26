# Task 10: Android App Identifier And Scheme

## Goal

Android native/dev build 준비 전에 필요한 앱 식별자(`android.package`)와 필요 시 deep link 대비 `scheme` 정책을 확정한다.

## Files

- `app/app.json`
- 필요 시 `app/app.config.*`
- 필요 시 관련 계획 문서

## Requirements

- `android.package` 값이 확정되거나 최소 후보와 결정 기준이 남아 있어야 한다
- dev/release 충돌 없이 유지 가능한 식별자 전략이 정리돼야 한다
- 이메일 인증 deep link를 지금 도입할지, 추후로 미룰지 정책이 기록돼야 한다

## Constraints

- 실제 native build 생성은 이 task의 범위가 아니다
- 서버 API 계약 변경은 포함하지 않는다

## Done Criteria

- Android 빌드에 필요한 앱 식별자 결정이 닫힌다
- 후속 prebuild/dev client 작업이 식별자 문제로 막히지 않는다
