# Task 14: Docs SMTP Runbook

## Goal

회원가입 테스트에 필요한 SMTP 실행 조건을 `README.md` 중심으로 명확히 문서화한다.

## Files

- `README.md`
- 필요 시 `docs/plan-login.md`

## Requirements

- 회원가입 테스트 시 메일 발송이 필수라는 점 명시
- 필수 env 목록 정리
  - `MAIL_HOST`
  - `MAIL_PORT`
  - `MAIL_USERNAME`
  - `MAIL_PASSWORD`
  - `EMAIL_VERIFY_BASE_URL`
- 어떤 설정이 누락되면 `Failed to send verification email`가 발생할 수 있는지 설명
- 개발자가 “서버는 뜨는데 signup이 실패하는 이유”를 빠르게 파악할 수 있게 작성

## Constraints

- 메일 발송 정책 자체는 바꾸지 않는다
- 개발 모드 우회 구현은 이 task 범위가 아니다

## Done Criteria

- `README.md`만 보고 회원가입용 메일 설정 조건을 재현할 수 있다
- 메일 설정 누락 시 어떤 증상이 나는지 문서에 드러난다
