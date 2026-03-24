# Task 07: App API Client Header Merge

## Goal

API client의 headers 병합 취약성을 수정한다.

## Files

- `app/src/services/api/client.ts`

## Requirements

- `Authorization`, `Content-Type`, custom headers가 동시에 유지되도록 병합 로직 수정
- 기존 envelope/error parsing은 유지

## Constraints

- base URL 정책은 바꾸지 않는다
- fetch wrapper를 다른 라이브러리로 교체하지 않는다

## Done Criteria

- `init.headers`가 있어도 기본 인증/콘텐츠 헤더가 사라지지 않는다

