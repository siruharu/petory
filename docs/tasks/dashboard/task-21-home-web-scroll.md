# Task 21: Home Web Scroll

## Goal

홈 대시보드가 웹에서도 하단 섹션까지 스크롤 가능하도록 레이아웃을 정리한다.

## Files

- `app/src/screens/home/home-screen.tsx`
- `app/src/components/common/screen-container.tsx`
- 필요 시 `app/src/app/navigation/root-navigator.tsx`

## Requirements

- 웹 브라우저에서 홈 하단 콘텐츠까지 스크롤로 접근 가능해야 한다
- 현재 헤더와 본문 구조를 크게 깨뜨리지 않아야 한다
- 일정, 최근 기록, 빈 상태 모두 같은 스크롤 구조 안에서 보여야 한다

## Constraints

- 새로운 네비게이션 라이브러리를 추가하지 않는다
- 홈 데이터 로직과 UI 로직은 최소 범위에서만 수정한다
- 반려동물 등록 화면의 스크롤 동작은 회귀하면 안 된다

## Done Criteria

- 홈 화면 하단까지 웹에서 스크롤 가능하다
- typecheck가 통과한다
- 기존 홈 상태 분기(`loading/success/empty/error`)가 유지된다
