# Task 16: Schedule Single Pet Auto Target

## Goal

반려동물을 한 마리만 보유한 사용자가 일정 생성 화면에 진입했을 때 대상 반려동물이 자동으로 지정되도록 한다.

## Files

- `app/src/screens/schedules/schedule-form-screen.tsx`
- `app/src/components/forms/schedule-form.tsx`
- 필요 시 현재 선택 반려동물 상태를 주입하는 일정 라우팅 관련 파일

## Requirements

- 사용자 반려동물 목록이 한 마리일 경우 일정 생성 대상 `petId`가 자동으로 결정돼야 한다
- 단일 반려동물 사용자에게는 불필요한 대상 선택 입력을 강제하지 않아야 한다
- 제출 payload의 `petId`는 자동 지정된 반려동물과 일치해야 한다
- 반려동물 목록 로딩 전에는 잘못된 기본값으로 제출되지 않아야 한다

## Constraints

- 서버 API 계약은 유지한다
- 새로운 일정 생성 구조를 만들지 않는다
- 임의 mock 데이터나 임시 petId 문자열을 사용하지 않는다

## Done Criteria

- 단일 반려동물 사용자는 별도 선택 없이 일정 생성이 가능하다
- 생성 요청의 `petId`가 실제 소유 반려동물 ID와 일치한다
- 반려동물 목록 로딩 타이밍 때문에 잘못된 반려동물로 제출되지 않는다
