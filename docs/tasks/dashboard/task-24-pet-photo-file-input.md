# Task 24: Pet Photo File Input

## Goal

반려동물 등록 폼에 웹 기준 파일 선택 input을 추가해 사용자가 이미지 파일을 직접 고를 수 있게 한다.

## Files

- `app/src/components/forms/pet-form.tsx`
- 필요 시 `app/src/components/common/`

## Requirements

- 파일 선택 버튼 또는 input trigger가 보여야 한다
- 사용자가 로컬 이미지 파일을 선택할 수 있어야 한다
- 기존 `photoUrl` URL 입력 방식은 제거하거나 보조 경로로 낮춘다

## Constraints

- 외부 업로드 라이브러리를 추가하지 않는다
- 브라우저 환경 기준 최소 동작만 우선 지원한다
- 파일 선택만 하고 실제 서버 업로드는 다음 단계로 넘길 수 있다

## Done Criteria

- 웹에서 이미지 파일 선택이 가능하다
- 선택된 파일 정보가 폼 상태에 반영된다
- 기존 입력 UX와 충돌하지 않는다
