# 대시보드 반려동물 접근 리뷰

작성일: 2026-03-24  
대상: `app/src/screens/pets/`, `app/src/components/forms/`, `app/src/components/common/screen-container.tsx`  
목적: 대시보드에서 반려동물 등록으로 이어지는 흐름을 유지한 상태에서, 반려동물 등록 폼 UX와 웹 레이아웃 품질이 현재 구현에서 얼마나 개선됐는지 정리한다.

## 검증 결과

확인된 항목:

- `app`: `npm run typecheck` 통과
- 종/성별/중성화 상태가 선택형 입력으로 전환됨
- 품종이 종에 따라 달라지는 후보군 선택 UX를 가짐
- 생일 입력이 달력형 선택 UI로 바뀜
- 나이가 생일 기준 자동 계산 표시로 전환됨
- 반려동물 등록 화면이 스크롤 가능한 구조로 바뀜
- 반려동물 등록 성공 후 홈 복귀 시 로컬 반려동물 상태와 홈 표시가 동기화되도록 보강됨
- 몸무게 필드가 문자열 draft 기반으로 바뀌어 소수점 입력이 안정화됨
- 품종 검색/선택 UI가 웹에서 더 읽기 쉬운 패널 구조로 정리됨
- 반려동물 등록 폼에서 웹 파일 선택 기반 이미지 입력과 미리보기가 가능해짐
- 홈 대시보드가 웹에서도 스크롤 가능한 구조로 바뀜
- 다중 반려동물 전환 시 현재 선택 항목을 상단 기준으로 보여주는 정책이 반영됨

직접 확인한 파일:

- [pet-form.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form.tsx)
- [pet-form-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-form-screen.tsx)
- [select-field.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/select-field.tsx)
- [search-select-field.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/search-select-field.tsx)
- [date-picker-field.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/date-picker-field.tsx)
- [pet-form-options.ts](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form-options.ts)
- [pet-age.ts](/Users/zephyr/Documents/projects/petory/app/src/utils/pet-age.ts)
- [screen-container.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/common/screen-container.tsx)
- [home-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/home/home-screen.tsx)
- [root-navigator.tsx](/Users/zephyr/Documents/projects/petory/app/src/app/navigation/root-navigator.tsx)
- [pet-summary-card.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/cards/pet-summary-card.tsx)
- [pet-switcher-sheet.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-switcher-sheet.tsx)
- [web-image-picker.ts](/Users/zephyr/Documents/projects/petory/app/src/utils/web-image-picker.ts)

## 해결된 항목

### 1. 종/성별/중성화 상태가 자유 입력 위주였던 문제

- 기존 문제:
  - 종, 성별, 중성화 상태가 자유 텍스트에 가까워 데이터 품질이 불안정했다.
- 현재 상태:
  - [pet-form.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form.tsx)에서 종, 성별, 중성화 상태가 모두 선택형 입력으로 바뀌었다.
  - [pet-form-options.ts](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form-options.ts)에 옵션 기준이 분리됐다.

### 2. 품종이 종과 연결되지 않았던 문제

- 기존 문제:
  - 품종 입력은 자유 입력이라 종에 따른 후보군 탐색 UX가 없었다.
- 현재 상태:
  - [search-select-field.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/search-select-field.tsx)가 추가됐다.
  - `species` 값에 따라 `dog`, `cat` 품종 후보군이 달라지도록 연결됐다.

### 3. 생일과 나이를 동시에 직접 입력하던 문제

- 기존 문제:
  - 생일과 나이를 사용자가 동시에 적게 되어 불일치 가능성이 있었다.
- 현재 상태:
  - [date-picker-field.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/date-picker-field.tsx)가 추가돼 달력형 날짜 선택 UI를 제공한다.
  - [pet-age.ts](/Users/zephyr/Documents/projects/petory/app/src/utils/pet-age.ts)가 생일 기준 나이 계산을 담당한다.
  - `ageText`는 읽기 전용 표시로 바뀌고, `birthDate` 변경 시 자동 계산된다.

### 4. 웹에서 반려동물 등록 화면 하단이 잘리던 문제

- 기존 문제:
  - 창 높이가 작으면 등록 폼 하단과 제출 버튼 접근이 어려웠다.
- 현재 상태:
  - [screen-container.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/common/screen-container.tsx)에 `scrollable` 구조가 추가됐다.
  - [pet-form-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-form-screen.tsx)가 이를 사용하도록 바뀌어 웹에서 스크롤 가능한 등록 화면이 됐다.

### 5. 몸무게 필드에서 소수점 입력이 끊기던 문제

- 기존 문제:
  - 몸무게 입력값을 즉시 숫자로 변환하던 구조 때문에 소수점 입력 중간 상태가 깨질 수 있었다.
- 현재 상태:
  - [pet-form-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-form-screen.tsx)가 `weightDraft` 문자열 상태를 별도로 관리한다.
  - 제출 시점에만 숫자로 변환해 payload를 만들도록 바뀌었다.
  - [pet-form.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form.tsx)도 이 문자열 draft를 그대로 표시하도록 정리됐다.

### 6. 반려동물 등록 후 홈에서 빈 상태가 유지되던 문제

- 기존 문제:
  - 반려동물 등록 성공 후 홈으로 복귀해도 “등록된 반려동물이 없어요” 상태가 남을 수 있었다.
- 현재 상태:
  - [root-navigator.tsx](/Users/zephyr/Documents/projects/petory/app/src/app/navigation/root-navigator.tsx)가 등록 성공한 반려동물을 상위 상태로 유지한다.
  - [home-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/home/home-screen.tsx)가 홈 API 응답과 로컬 반려동물 상태를 병합해 표시한다.
  - 따라서 홈 API가 일정/기록을 비워 반환해도, 방금 등록한 반려동물 자체는 홈에서 바로 보이도록 보강됐다.

### 7. 품종 검색/선택 UI가 웹에서 깨져 보이던 문제

- 기존 문제:
  - 품종 검색 input, 옵션 목록, 선택 상태가 한 덩어리처럼 보여 웹에서 리스트가 무너져 보였다.
- 현재 상태:
  - [search-select-field.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/search-select-field.tsx)에 현재 선택값, 검색 영역, 옵션 목록, 선택 상태 표시가 분리된 패널 구조를 적용했다.
  - 옵션 목록은 내부 스크롤 가능한 리스트로 바뀌어 길이가 길어져도 레이아웃이 덜 무너진다.

### 8. 반려동물 이미지 등록 경로가 없던 문제

- 기존 문제:
  - 반려동물 등록 폼에는 이미지 등록 경로가 없어 `photoUrl` 필드를 실제로 채울 수 없었다.
- 현재 상태:
  - [web-image-picker.ts](/Users/zephyr/Documents/projects/petory/app/src/utils/web-image-picker.ts)가 웹 파일 선택 후 data URL을 읽는 유틸을 제공한다.
  - [pet-form.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form.tsx)에 이미지 파일 선택 버튼과 미리보기가 추가됐다.
  - [pet-form-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-form-screen.tsx)가 선택된 파일 값을 `photoUrl` payload와 연결한다.
  - [pet-summary-card.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/cards/pet-summary-card.tsx)도 `photoUrl`이 있으면 홈 카드에서 이미지를 우선 표시한다.
  - 이미지 URL 직접 입력은 보조 fallback 경로로 낮아졌다.

### 9. 홈 대시보드가 웹에서 스크롤되지 않던 문제

- 기존 문제:
  - 웹 기준으로 홈 하단 콘텐츠까지 스크롤되지 않아 일정/최근 기록 섹션 확인이 어려웠다.
- 현재 상태:
  - [home-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/home/home-screen.tsx)가 내부 `ScrollView`를 사용하도록 바뀌었다.
  - 따라서 홈 카드, 일정, 최근 기록이 길어져도 웹에서 하단까지 접근 가능하다.

### 10. 다중 반려동물 전환 정렬 정책이 없던 문제

- 기존 문제:
  - 여러 반려동물을 등록한 뒤 전환할 때 현재 선택 항목을 어떤 위치에 보여줄지 기준이 없었다.
- 현재 상태:
  - [home-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/home/home-screen.tsx)가 현재 선택된 반려동물을 display order의 첫 위치로 정렬한다.
  - [pet-switcher-sheet.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-switcher-sheet.tsx)는 현재 선택 항목을 상단에 고정 표시하고, 나머지 반려동물은 기존 순서를 유지한다.
  - 현재 정책은 “선택 항목 상단 고정, 나머지는 기존 순서 유지”다.

## 남아 있는 문제

### 1. 품종 선택은 현재 대표 품종 리스트 기준의 단순 구조다

- 관련 파일:
  - [pet-form-options.ts](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form-options.ts)
  - [search-select-field.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/search-select-field.tsx)
- 문제:
  - `dog`, `cat`의 대표 품종 리스트만 제공한다.
  - 모든 품종을 exhaustive하게 다루는 구조는 아니다.
- 영향:
  - 일부 사용자에게는 원하는 품종이 목록에 없을 수 있다.
- 리스크 수준:
  - 중간

### 2. 생일 미상 사용자에 대한 대체 UX는 단순하다

- 관련 파일:
  - [pet-form.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form.tsx)
  - [pet-age.ts](/Users/zephyr/Documents/projects/petory/app/src/utils/pet-age.ts)
- 문제:
  - 현재는 생일이 없으면 나이를 계산하지 않고 안내 문구만 보여준다.
  - 생일을 모르는 사용자가 대략적인 나이를 수동 입력할 경로는 없다.
- 영향:
  - 실제 사용자 상황에 따라 입력 제약처럼 느껴질 수 있다.
- 리스크 수준:
  - 중간

### 3. 홈 반영은 현재 세션 기준 로컬 동기화 보강에 의존한다

- 관련 파일:
  - [root-navigator.tsx](/Users/zephyr/Documents/projects/petory/app/src/app/navigation/root-navigator.tsx)
  - [home-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/home/home-screen.tsx)
- 문제:
  - 현재 홈 반영 보강은 등록 직후 세션 안에서 동작하는 로컬 상태 병합 방식이다.
  - 백엔드 홈 집계 API가 신규 반려동물을 완전히 반영하는지까지 보장하는 구조는 아니다.
- 영향:
  - 현재 사용 흐름은 해결되지만, 새로고침 후에도 완전히 일관적인지는 서버 구현 상태에 영향을 받는다.
- 리스크 수준:
  - 중간

### 4. 이미지 업로드는 아직 data URL 기반의 최소 구조다

- 관련 파일:
  - [pet-form.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form.tsx)
  - [pet-form-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-form-screen.tsx)
  - [web-image-picker.ts](/Users/zephyr/Documents/projects/petory/app/src/utils/web-image-picker.ts)
- 문제:
  - 현재는 웹 파일 선택 UX가 생겼지만, 실제 업로드 API나 저장소 연동은 없다.
  - 선택한 이미지를 data URL로 다루기 때문에 파일 크기와 장기 저장 관점에서는 한계가 있다.
- 영향:
  - 사용자 경험은 크게 좋아졌지만, 운영 수준의 이미지 업로드 완성도는 아직 아니다.
- 리스크 수준:
  - 중간

### 5. 현재 선택 항목 상단 고정 정책이 최종 UX로 적절한지는 추가 검토가 필요하다

- 관련 파일:
  - [home-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/home/home-screen.tsx)
  - [pet-switcher-sheet.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-switcher-sheet.tsx)
- 문제:
  - 현재는 선택한 반려동물을 상단에 고정하는 정책을 적용했지만, 등록 순서 고정을 더 자연스럽게 느끼는 사용자도 있을 수 있다.
- 영향:
  - 현재 컨텍스트 인지는 쉬워졌지만, 실제 사용자 테스트 전까지는 최종 정책으로 단정하기 어렵다.
- 리스크 수준:
  - 낮음

### 6. 루트 상태 분기 구조는 여전히 장기 확장에 취약하다

- 관련 파일:
  - [root-navigator.tsx](/Users/zephyr/Documents/projects/petory/app/src/app/navigation/root-navigator.tsx)
- 문제:
  - 현재 구조는 최소 수정에는 적합하지만 화면이 늘수록 수동 상태 분기 관리가 복잡해진다.
- 영향:
  - 이후 일정/기록/반려동물 상세까지 확장하면 재정리가 필요할 가능성이 높다.
- 리스크 수준:
  - 낮음

## 수정 필요 항목

### 우선 수정

1. 품종 후보군 범위를 더 넓힐지, “기타” 입력 fallback을 넣을지 정책을 정한다.
2. 생일을 모르는 사용자를 위한 대체 나이 입력 정책을 검토한다.
3. 홈 집계 API가 신규 반려동물을 영속적으로 반영하는지 서버 기준으로 다시 확인한다.
4. 이미지 업로드를 data URL MVP에 둘지, 실제 업로드 API/저장소 연동으로 확장할지 결정한다.
5. 현재 선택 항목 상단 고정 정책이 실제 사용자 테스트 기준으로 적절한지 검증한다.

### 다음 수정

6. 화면 수가 더 늘어나기 전에 라우팅 구조를 정식 navigation으로 전환할지 판단한다.

## 리스크 수준

### 중간

- 대표 품종 리스트 한계
- 생일 미상 사용자 UX 단순화
- 세션 기반 홈 동기화의 한계
- data URL 기반 이미지 업로드의 한계

### 낮음

- 현재 선택 항목 상단 고정 정책의 추가 검증 필요
- 수동 라우팅 분기 확장성 제한

## 총평

대시보드에서 반려동물 등록으로 진입하고 저장한 뒤 홈에서 바로 확인하는 핵심 흐름은 이번 단계에서 한 번 더 올라왔다.  
이제 홈 미반영, 몸무게 소수점 입력, 품종 선택 UI 붕괴뿐 아니라 이미지 등록 부재, 홈 웹 스크롤, 반려동물 전환 정렬 기준 부재도 앱 기준으로 우선 해소됐다.  
남은 일은 저장 직후 흐름을 막는 장애보다는, 품종 범위, 생일 미상 사용자 대응, 서버 집계와의 장기 일관성, 운영 수준의 이미지 업로드 방식 같은 다음 단계의 제품 결정 영역이다.
