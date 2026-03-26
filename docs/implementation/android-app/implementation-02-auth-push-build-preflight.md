# Implementation 02: Auth Push And Build Preflight

작성일: 2026-03-25

## 범위

- Task 04
- Task 05
- Task 06
- Task 07

## 구현 내용

- 회원가입/이메일 인증 화면에 모바일 앱에서는 메일 링크가 자동 deep link로 복귀하지 않을 수 있다는 안내를 추가했다.
- 이메일 인증 화면에서 수동 토큰 입력이 모바일의 공식 우회 경로라는 점을 명시했다.
- 설정 화면에 Expo Go에서는 푸시 알림이 제한되거나 미지원일 수 있다는 안내를 추가했다.
- `docs/plan-android-app.md`에 task 01~07 완료 체크를 반영했다.

## Android 빌드 전략 정리

- 현재 단계의 1차 목표는 Expo Go 실기기 smoke test다.
- APK/native Android 경로는 실제 prebuild 이전에 전략을 먼저 정리하는 단계로 유지한다.
- 현재 코드베이스에는 다음이 없다.
  - `android/`
  - `eas.json`
  - `android.package`
  - `google-services.json`
- 따라서 APK 빌드를 바로 시작하지 않고, 아래 선행 조건을 먼저 닫는 전략으로 유지한다.

## APK Preflight Checklist

- Android package 식별자 확정
- `expo prebuild`와 EAS Build 중 하나 선택
- Firebase Messaging 유지 여부 결정
- `google-services.json` 및 native 설정 준비 여부 결정
- signing 전략 결정
- Android SDK/JDK/Gradle 로컬 준비 상태 확인
- prebuild로 `android/` 구조가 생긴 뒤의 저장/관리 전략 결정

## 주요 파일

- `app/src/screens/auth/signup-screen.tsx`
- `app/src/screens/auth/verify-email-screen.tsx`
- `app/src/screens/settings/settings-screen.tsx`
- `docs/plan-android-app.md`

## 검증

- 앱 `npm run typecheck`

