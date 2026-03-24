# Task 25: Docs Verify Link Runbook

## Goal

메일 링크 클릭 후 기대 동작과 `EMAIL_VERIFY_BASE_URL` 의미를 실행 문서에 맞게 정리한다.

## Files

- `README.md`
- 필요 시 `docs/plan-login.md`
- 필요 시 `docs/plan.md`

## Requirements

- `EMAIL_VERIFY_BASE_URL`이 프론트 verify landing URL이라는 점 명시
- 메일 링크 클릭 후 자동 인증이 수행된다는 기대 동작 설명
- verify landing 예시 URL 추가
- 로그인 검증 절차를 새 흐름에 맞게 수정

## Constraints

- SMTP 정책 자체는 바꾸지 않는다
- 운영 배포 문서까지 확장하지 않는다

## Done Criteria

- 문서만 보고 verify 링크 클릭 후 동작을 이해할 수 있다
- 설정값 의미와 실제 동작이 어긋나지 않는다

