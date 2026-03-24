# Task 25: Pet Photo Preview From File

## Goal

선택한 로컬 이미지 파일을 반려동물 등록 폼과 홈 카드 흐름에서 미리볼 수 있도록 연결한다.

## Files

- `app/src/components/forms/pet-form.tsx`
- `app/src/screens/pets/pet-form-screen.tsx`
- `app/src/components/cards/pet-summary-card.tsx`

## Requirements

- 파일 선택 후 즉시 preview가 보여야 한다
- 폼 내부 preview와 홈 카드 표현이 가능한 한 일관돼야 한다
- 기존 `photoUrl` 기반 표현과 자연스럽게 연결되어야 한다

## Constraints

- 서버 업로드는 포함하지 않는다
- preview를 위해 필요한 최소 브라우저 API만 사용한다
- 메모리 누수 가능성이 있는 object URL 정리는 고려해야 한다

## Done Criteria

- 로컬 파일 선택 후 preview가 보인다
- 반려동물 저장 직전 화면에서 이미지 확인이 가능하다
- typecheck가 통과한다
