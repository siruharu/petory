# Task 21: Verify Landing Strategy

## Goal

메일의 verify 링크를 프론트 verify landing URL로 처리한다는 전략을 코드와 문서 기준으로 고정한다.

## Files

- `docs/plan-review.md`
- 필요 시 `README.md`
- 필요 시 `app/src/app/navigation/root-navigator.tsx`

## Requirements

- `/verify-email?token=...`를 앱이 직접 처리하는 방향으로 기준 고정
- `EMAIL_VERIFY_BASE_URL`이 프론트 landing URL이라는 점을 명확히 함
- 백엔드 confirm endpoint를 이번 범위에서 도입하지 않는다는 점을 분명히 함

## Constraints

- 백엔드 인증 구조 전체를 바꾸지 않는다
- 정식 라우터 도입은 이 task 범위가 아니다

## Done Criteria

- verify 링크 처리 전략이 문서와 구현 방향에서 일치한다

