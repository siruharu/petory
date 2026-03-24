# Task 26: Pet Photo Payload Bridge

## Goal

파일 선택 기반 이미지 상태와 기존 `photoUrl` payload 사이의 브리지를 정리해 저장 경로를 일관되게 만든다.

## Files

- `app/src/screens/pets/pet-form-screen.tsx`
- 필요 시 `app/src/features/pets/pet-api.ts`
- 필요 시 `app/src/types/domain.ts`

## Requirements

- 현재 단계에서 저장 가능한 이미지 값이 무엇인지 명확히 해야 한다
- 파일 선택 상태와 API payload 사이 변환 지점을 한 곳으로 모은다
- 임시 preview URL과 실제 저장 값을 혼동하지 않도록 한다

## Constraints

- 서버 계약 변경은 최소화한다
- 업로드 API가 없으면 임시 placeholder 정책을 명확히 해야 한다
- 추상적인 TODO만 남기지 않는다

## Done Criteria

- 이미지 상태와 payload 변환 경로가 코드상 명확하다
- preview용 값과 저장용 값이 구분된다
- 이후 업로드 API가 생겨도 갈아끼우기 쉬운 구조가 된다
