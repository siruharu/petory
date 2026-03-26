# Task 11: Expo Dev Client Bootstrap

## Goal

Expo Go를 우회하는 1차 대안으로, 현재 프로젝트를 `Expo Dev Client` 기반 Android 실기기 실행 경로로 부팅 가능하게 만든다.

## Files

- `app/app.json`
- 필요 시 `app/app.config.*`
- `app/package.json`
- 필요 시 `eas.json`
- 필요 시 Android 실행 문서

## Requirements

- 프로젝트 전용 dev client 빌드 경로가 정리돼야 한다
- Android 실기기에서 Expo Go 대신 dev build를 설치해 Metro에 연결할 수 있어야 한다
- 현재 LAN API 환경 변수 주입 방식과 충돌하지 않아야 한다

## Constraints

- release APK 배포까지 범위를 넓히지 않는다
- Firebase 설정을 임의로 생략하거나 임의 구조로 만들지 않는다
- 승인 없는 EAS 도입은 하지 않는다

## Done Criteria

- Android dev client 실행 절차가 재현 가능하다
- Expo Go가 아니어도 실기기에서 앱 부팅을 시도할 수 있다
