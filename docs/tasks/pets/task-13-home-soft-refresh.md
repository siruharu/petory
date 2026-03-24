# Task 13: Home Soft Refresh

## Goal

홈 화면의 `다시 불러오기`가 전체 화면 loading으로 전환되지 않고 기존 데이터를 유지한 채 부드럽게 갱신되도록 수정한다.

## Files

- `app/src/screens/home/home-screen.tsx`
- 필요 시 `app/src/components/feedback/inline-message.tsx`

## Requirements

- 수동 refresh와 첫 진입 loading 상태를 분리해야 한다
- refresh 중에도 기존 카드와 목록은 유지되어야 한다
- refresh 실패 시 full-screen error로 바꾸지 말고, 작은 안내 메시지나 버튼 상태 변화로 처리해야 한다
- refresh 성공 시 최신 서버 데이터로 자연스럽게 교체되어야 한다

## Constraints

- 홈 화면 전체 레이아웃은 크게 바꾸지 않는다
- pull-to-refresh 같은 신규 제스처는 추가하지 않는다
- 홈의 server-first 정책은 유지한다

## Done Criteria

- `다시 불러오기` 클릭 시 화면 전체 깜빡임이 사라진다
- refresh 중에도 기존 홈 데이터가 유지된다
- refresh 실패가 전체 화면 에러로 번지지 않는다
