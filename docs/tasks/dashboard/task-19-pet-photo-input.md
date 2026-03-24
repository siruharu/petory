# Task 19: Pet Photo Input

## Goal

반려동물 등록 폼에서 `photoUrl`을 실제로 입력할 수 있는 최소 이미지 등록 경로를 추가한다.

## Files

- `app/src/components/forms/pet-form.tsx`
- `app/src/screens/pets/pet-form-screen.tsx`

## Requirements

- 사용자가 반려동물 이미지 값을 입력할 수 있어야 한다
- 기존 `photoUrl` payload 필드를 그대로 사용해야 한다
- 생성 모드와 수정 모드 모두 같은 방식으로 동작해야 한다

## Constraints

- 업로드 인프라나 저장소 연동은 이번 task 범위에 포함하지 않는다
- 기술 선택은 유지한다
- 최소 입력 UX만 추가한다

## Done Criteria

- 반려동물 등록 폼에 이미지 입력 경로가 보인다
- submit 시 `photoUrl` 값이 payload에 포함된다
- typecheck가 통과한다
