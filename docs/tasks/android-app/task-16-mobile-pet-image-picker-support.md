# Task 16: Mobile Pet Image Picker Support

## Goal

반려동물 등록/수정 화면에서 Android 실기기로 이미지를 실제 선택하고 미리보기까지 확인할 수 있도록 mobile image picker 경로를 추가한다.

## Files

- `app/src/screens/pets/pet-form-screen.tsx`
- `app/src/components/forms/pet-form.tsx`
- 신규 공통 image picker 유틸
- 필요 시 `app/package.json`

## Requirements

- 웹과 앱의 이미지 선택 경로를 분리해야 한다
- Android/iOS에서는 native picker를 통해 이미지를 선택할 수 있어야 한다
- 선택 결과가 현재 `photoUrl`/preview 흐름과 호환되어야 한다
- 안내 문구가 실제 지원 정책과 일치해야 한다

## Constraints

- 서버 API 계약을 임의로 multipart 업로드로 전환하지 않는다
- 현재 `photoUrl` 중심 payload 구조를 유지한다
- 웹 전용 picker를 제거하지 않고 플랫폼별로 공존시킨다

## Done Criteria

- Android 실기기에서 이미지 선택 버튼이 실제 사진 선택으로 이어진다
- 선택 후 미리보기가 보이고 저장 payload에 반영된다
- 웹과 앱의 UX 문구가 실제 동작과 어긋나지 않는다
