# Task 01: Theme Color Tokens

## Goal

앱 전역에서 재사용할 색상 토큰 파일을 추가한다.

## Files

- `app/src/theme/colors.ts`
- `app/src/theme/index.ts`

## Requirements

- warm neutral 기반 배경 색상 정의
- brand, text, border, state color role 정의
- hex 값은 역할 이름과 함께 export
- 이후 컴포넌트에서 참조할 수 있도록 index 재노출

## Constraints

- 기존 화면 구현 로직은 바꾸지 않는다
- 다크모드까지 확장하지 않는다
- 컴포넌트 직접 수정은 하지 않는다

## Done Criteria

- `colors.ts`가 생성되어 앱 공통 색상 토큰을 export한다
- `theme/index.ts`에서 색상 토큰이 재export된다

