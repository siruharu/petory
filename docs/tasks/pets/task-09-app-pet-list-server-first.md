# Task 09: App Pet List Server First

## Goal

PetListScreen이 서버 목록을 우선 사용하고 로컬 pet 상태는 fallback으로만 쓰도록 정리한다.

## Files

- `app/src/screens/pets/pet-list-screen.tsx`

## Requirements

- 서버 `fetchPets()` 성공 시 목록 화면은 서버 응답 기준으로 그려야 한다
- 서버 실패 시 로컬 pet fallback을 사용할 수 있어야 한다
- 현재 선택 항목 상단 정렬 정책은 유지해야 한다

## Constraints

- 목록 화면의 loading/empty/error 분기 구조는 유지한다
- 홈과 상충하는 정렬 정책을 만들지 않는다
- 새로운 상태 라이브러리는 추가하지 않는다

## Done Criteria

- 목록 화면도 server-first, local-fallback 구조가 된다
