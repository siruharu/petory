# Task 23: Pet Photo File Picker Strategy

## Goal

반려동물 이미지 등록을 URL 입력이 아닌 실제 파일 선택 UX로 전환하기 위한 최소 구현 전략을 코드베이스 기준으로 정리하고 반영 범위를 고정한다.

## Files

- `app/src/components/forms/pet-form.tsx`
- `app/src/screens/pets/pet-form-screen.tsx`
- 필요 시 `app/src/components/common/`

## Requirements

- 웹 기준 파일 선택 UX를 우선 고려한다
- 선택된 파일 preview와 submit payload 연결 방식을 정한다
- 기존 `photoUrl` 필드와 충돌 없이 연결되는 경로를 정리한다

## Constraints

- 기술 선택은 바꾸지 않는다
- 업로드 인프라를 새로 설계하지 않는다
- 현재 코드베이스에서 10~30분 내 구현 가능한 최소 범위로 제한한다

## Done Criteria

- 파일 선택 기반 이미지 UX의 최소 범위가 정해진다
- 변경 대상 파일이 명확히 좁혀진다
- 이후 구현 task가 더 작은 단위로 나눌 수 있는 상태가 된다
