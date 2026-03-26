# Task 13: EAS Internal APK Evaluation

## Goal

팀 공유용 Android 내부 테스트 APK가 필요한 경우를 대비해 `EAS Build` 도입 여부와 필요한 설정 범위를 평가한다.

## Files

- 필요 시 `eas.json`
- `app/app.json`
- 관련 계획 문서

## Requirements

- EAS Build가 필요한 상황과 로컬 prebuild가 충분한 상황이 구분돼야 한다
- 내부 테스트 APK 또는 AAB 생성에 필요한 최소 설정 목록이 정리돼야 한다
- 계정, secret, Firebase 파일 관리 포인트가 문서에 남아야 한다

## Constraints

- 이 task는 평가/정리 중심이며 즉시 배포를 강제하지 않는다
- 승인 없이 클라우드 빌드 체계를 고정하지 않는다

## Done Criteria

- EAS 도입 여부를 결정할 수 있다
- 도입 시 필요한 후속 작업이 task 수준으로 분해된다
