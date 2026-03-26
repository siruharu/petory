# Task 30: Home Initial Pet Load

## Goal

로그인 직후 홈 대시보드가 현재 사용자 반려동물 데이터를 즉시 불러오거나, 이미 가진 루트 상태를 바로 소비하도록 초기 동기화 경로를 정리하고 구현한다.

## Files

- `app/src/app/navigation/root-navigator.tsx`
- `app/src/screens/home/home-screen.tsx`
- 필요 시 `app/src/features/pets/`

## Requirements

- 로그인 직후 홈 첫 진입에서 반려동물 데이터 조회 트리거가 명확해야 한다
- 루트 상태에 이미 반려동물 데이터가 있으면 홈 첫 렌더에서 즉시 사용할 수 있어야 한다
- 실제 데이터가 있는데도 첫 진입에서 `등록된 반려동물이 없어요` empty state가 잘못 노출되지 않아야 한다
- 새로고침 또는 인증 bootstrap 이후에도 같은 기준으로 동작해야 한다

## Constraints

- 기존 단순 상태 분기 구조는 유지한다
- 새로운 전역 상태 라이브러리나 라우팅 구조를 도입하지 않는다
- 백엔드 API 계약은 변경하지 않는다
- 등록 후 홈 반영 문제 해결 범위와 섞지 말고, 로그인 직후 초기 로딩 문제에 집중한다

## Done Criteria

- 로그인 직후 홈 대시보드에서 반려동물 데이터가 즉시 보이거나 로딩 후 안정적으로 채워진다
- 첫 진입 empty state가 실제 데이터 유무와 일치한다
- 기존 홈 진입, 등록 후 복귀, 반려동물 전환 흐름이 깨지지 않는다
