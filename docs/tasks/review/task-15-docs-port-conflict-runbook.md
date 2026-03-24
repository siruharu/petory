# Task 15: Docs Port Conflict Runbook

## Goal

서버 실행 시 `8080` 포트 충돌이 발생했을 때의 진단과 우회 절차를 문서에 반영한다.

## Files

- `README.md`
- 필요 시 `docs/plan.md`

## Requirements

- 포트 충돌 증상 예시 추가
- 점유 프로세스 확인 명령 추가
  - `lsof -i :8080`
- 대체 포트 실행 방법 추가
  - `SERVER_PORT=8081 ./gradlew --no-daemon bootRun`
  - 또는 동등한 실행 예시
- 앱의 `EXPO_PUBLIC_API_BASE_URL`도 함께 바꿔야 한다는 점 추가

## Constraints

- 실행 포트 기본값 자체를 바꾸지 않는다
- 운영 배포 문서까지 확장하지 않는다

## Done Criteria

- 개발자가 포트 충돌을 코드 오류와 구분할 수 있다
- 문서만 보고 다른 포트로 서버와 앱을 함께 실행할 수 있다
