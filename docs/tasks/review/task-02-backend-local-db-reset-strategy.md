# Task 02: Backend Local DB Reset Strategy

## Goal

개발용 H2 file DB가 기존 스키마 때문에 부팅을 막지 않도록 로컬 DB 초기화 전략을 문서와 설정에 반영한다.

## Files

- `server/src/main/resources/application.yml`
- `README.md`

## Requirements

- 로컬 개발 기준 H2 file DB reset 방법 문서화
- 필요 시 local profile 또는 주석 수준으로 reset 기준 명시
- migration 이후 validate 부팅 검증 절차 명시

## Constraints

- destructive reset 명령을 코드로 자동 실행하지 않는다
- production DB 전략까지 확장하지 않는다

## Done Criteria

- 개발자가 로컬 DB 파일을 언제/어떻게 정리해야 하는지 문서로 알 수 있다

