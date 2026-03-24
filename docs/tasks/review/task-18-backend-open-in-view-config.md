# Task 18: Backend Open-In-View Config

## Goal

API 서버 기준으로 `spring.jpa.open-in-view` 설정을 명시해 부팅 경고와 의도 불명확성을 줄인다.

## Files

- `server/src/main/resources/application.yml`

## Requirements

- `spring.jpa.open-in-view=false` 명시
- 현재 JPA 초기화 및 API 응답 구조와 충돌하지 않는지 확인

## Constraints

- 컨트롤러/서비스 리팩토링은 하지 않는다
- lazy loading 구조를 새로 설계하지 않는다

## Done Criteria

- 부팅 시 `open-in-view` 기본값 경고가 사라진다
- 설정 의도가 문서 없이도 드러난다
