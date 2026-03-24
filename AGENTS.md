# AGENTS.md

## Core Principle
AI는 실행 담당이다.
설계, 범위, 기술 선택, 방향 전환은 인간이 결정한다.

## Workflow
1. Research → docs/research.md 작성
2. Planning → docs/plan.md 작성
3. Annotation → 사람이 메모 추가 후 plan 수정
4. Task Breakdown → docs/tasks/*.md 생성
5. Implementation → task 단위로 구현
6. Review → plan 및 contract 기준 검토

## Hard Rules
- chat 요약으로 끝내지 말고 반드시 markdown 파일에 남긴다.
- plan 확정 전 구현 금지
- task 없이 대규모 구현 금지
- 명시적 승인 없는 기술 변경 금지
- 임의 리팩토링 금지
- 백엔드/모바일 계약 변경 시 docs/api-contract.md 갱신 필수

## Backend Rules
- Kotlin + Spring Boot 기준으로 작성
- any 수준의 타입 우회 금지
- controller/service/repository/domain 책임 분리
- validation, error response, test 고려
- API는 명시적 DTO 사용

## Mobile Rules
- React Native 기준으로 작성
- 화면 상태는 loading / success / empty / error 고려
- API 응답 구조는 docs/api-contract.md 기준
- 임의 mock 구조 생성 금지

## Output Rule
모든 단계 결과는 파일로 남긴다.