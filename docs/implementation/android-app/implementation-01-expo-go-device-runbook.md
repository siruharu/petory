# Implementation 01: Expo Go Device Runbook

작성일: 2026-03-25

## 범위

- Task 01
- Task 02
- Task 03

## 구현 내용

- `app/.env.example`를 추가해 실기기용 `EXPO_PUBLIC_API_BASE_URL` 예시를 남겼다.
- `app/package.json`에 `start:lan`, `start:tunnel` 스크립트를 추가해 Expo Go 연결 방식을 명확히 했다.
- `app/src/services/api/client.ts`에서 네트워크 실패 시 `localhost` 오설정과 LAN 연결 점검을 구분해 안내하도록 보강했다.
- `app/src/services/api/client.ts`에서 현재 API base URL을 노출하는 `getApiBaseUrl()`를 추가했다.
- `app/src/screens/settings/settings-screen.tsx`에 현재 API base URL 표시와 Expo Go 푸시 제한 안내를 추가했다.

## 실기기 실행 절차

1. 서버를 `8080` 포트에서 실행한다.
2. 개발 머신의 LAN IP를 확인한다.
3. `app/.env.example`를 참고해 `EXPO_PUBLIC_API_BASE_URL=http://<LAN-IP>:8080/api` 값을 준비한다.
4. `cd app` 후 환경 변수를 적용한 상태에서 `npm run start:lan`을 실행한다.
5. 안드로이드 폰과 개발 머신이 같은 Wi-Fi에 연결돼 있는지 확인한다.
6. Expo Go로 QR 코드를 스캔해 앱을 연다.
7. 로그인 후 홈/반려동물 bootstrap이 실제 서버 기준으로 동작하는지 확인한다.
8. 설정 화면의 `API_BASE_URL` 표시가 기대한 값과 일치하는지 확인한다.

## 실패 시 확인 포인트

- Expo Go가 프로젝트에 접속하지 못하면 Wi-Fi/LAN 또는 방화벽을 먼저 확인한다.
- 로그인이나 홈 조회가 실패하면 설정 화면의 `API_BASE_URL`이 `localhost`로 남아 있는지 먼저 확인한다.
- `API 서버에 연결하지 못했어요` 메시지가 나오면 LAN IP, 서버 실행 여부, 같은 네트워크 연결을 점검한다.
- 웹 회원가입 메일 인증이 막히면 SMTP 설정과 이메일 인증 링크 경로를 확인한다.

## 주요 파일

- `app/.env.example`
- `app/package.json`
- `app/src/services/api/client.ts`
- `app/src/screens/settings/settings-screen.tsx`
- `docs/plan-android-app.md`

## 검증

- 앱 `npm run typecheck`

