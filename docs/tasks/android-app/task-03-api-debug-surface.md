# Task 03: API Debug Surface

## Goal

안드로이드 실기기 테스트 중 API host 문제와 인증 문제를 빠르게 구분할 수 있도록 최소한의 디버그 정보를 노출하거나 에러 메시지를 정리한다.

## Files

- `app/src/services/api/client.ts`
- 필요 시 `app/src/screens/settings/settings-screen.tsx`
- 필요 시 공통 피드백 컴포넌트

## Requirements

- 개발 단계에서 현재 API base URL 또는 동등한 진단 정보를 확인할 수 있어야 한다
- 네트워크 실패와 인증 실패가 완전히 같은 메시지로 보이지 않도록 해야 한다
- 실기기 테스트 시 호스트 오설정 여부를 빨리 파악할 수 있어야 한다

## Constraints

- 운영 사용자 UX를 과하게 오염시키지 않는다
- API 계약은 변경하지 않는다
- 디버그 구조를 대규모로 새로 만들지 않는다

## Done Criteria

- 실기기에서 API 연결 실패 원인을 추적하기 쉬워진다
- 최소 한 곳에서 현재 연결 기준을 확인할 수 있다

