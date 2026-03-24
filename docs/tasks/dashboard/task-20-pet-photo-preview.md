# Task 20: Pet Photo Preview

## Goal

반려동물 등록 폼에 입력된 이미지가 사용자에게 미리보기 형태로 보이도록 최소 preview UI를 추가한다.

## Files

- `app/src/components/forms/pet-form.tsx`
- 필요 시 `app/src/components/common/`

## Requirements

- `photoUrl` 값이 있으면 폼 내부에서 preview가 보여야 한다
- 이미지가 없을 때와 있을 때 상태가 명확히 구분되어야 한다
- 웹 프리뷰에서 레이아웃이 깨지지 않아야 한다

## Constraints

- 파일 업로드 기능은 추가하지 않는다
- 외부 이미지 라이브러리를 새로 도입하지 않는다
- preview는 최소 범위의 정적 이미지 표시로 제한한다

## Done Criteria

- 이미지 URL 입력 후 preview가 렌더링된다
- 잘못된 URL이 들어와도 폼 전체 레이아웃이 크게 깨지지 않는다
- 기존 입력 필드 동작이 유지된다
