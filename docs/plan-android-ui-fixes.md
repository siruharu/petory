# Android UI/실기기 보완 계획

작성일: 2026-03-26  
기준 문서: `docs/review-android-app.md`  
목적: Android 실기기 리뷰에서 확인된 UI/기능 문제를 사용자 체감 기준으로 우선순위화하고, 구현 가능한 작업 단위로 정리한다.  
중요: 이 문서는 계획 문서다. 구현은 포함하지 않는다.

---

## 진행 대상

- Finding 0: Android 하드웨어 뒤로가기 즉시 종료
- Finding 1: Android safe area 부재
- Finding 2: 반려동물 사진 등록 web-only
- Finding 3: 반려동물 전환 선택 카드 시각 불일치
- Finding 4: dev client `expo-keep-awake` rejection 로그 확인

## 진행 상태

- [x] Task 19: Android Back Navigation Policy
- [x] Task 15: Android Safe Area Container Alignment
- [x] Task 16: Mobile Pet Image Picker Support
- [x] Task 17: Dev Client Runtime Error Triage
- [x] Task 18: Pet Switcher Selected Card Visual Alignment

---

## 0. 명시적 가정

- 현재 앱은 Expo dev client + Android native debug build 경로를 기준으로 검증한다.
- 현재 `app/android/`는 이미 생성되어 있고, Android debug build는 가능하다.
- `google-services.json`이 아직 없으므로 푸시까지 포함한 native 재구성은 이번 계획의 핵심 범위가 아니다.
- 이번 단계의 목표는 “앱이 뜬다”가 아니라 “Android 실기기에서 UI가 안전하게 보이고, 반려동물 사진 등록이 실제로 동작한다”이다.

---

## 1. 핵심 결론

현재 Android 앱에서 가장 먼저 고쳐야 하는 것은 디자인 polish가 아니라 내비게이션 계약, 공통 레이아웃 규칙, 입력 기능 계약이다.

우선순위:

1. Android 하드웨어 뒤로가기 정책 정의
2. 공통 safe area/container 정책 수정
3. 반려동물 사진 등록의 native 지원 추가
4. 반려동물 전환 선택 카드 시각 정리
5. dev client 런타임 로그의 재현 범위 확인

이 순서를 택하는 이유:

- 뒤로가기는 Android 앱의 기본 사용 계약이라서, 폼 화면에서 즉시 종료가 발생하면 다른 UI 개선보다 먼저 신뢰를 무너뜨린다.
- safe area는 거의 모든 화면의 첫인상과 조작 안정성에 영향을 준다.
- 사진 등록은 명확한 기능 누락이며, 현재 버튼이 보여서 사용자가 실패로 인식한다.
- 반려동물 전환 선택 카드는 기능 오류는 아니지만 홈 화면 품질 인상에 직접 영향을 준다.
- `expo-keep-awake` 로그는 관찰 필요성이 있지만, 현재 사용자 핵심 불편보다 우선순위가 낮다.

---

## 2. 구현 목표

이번 계획의 최종 목표는 아래와 같다.

1. Android 실기기에서 상단/하단 UI가 시스템 영역과 시각적으로 충돌하지 않는다.
2. 하위 화면에서 Android 뒤로가기를 누르면 이전 화면 또는 홈으로 정상 복귀한다.
3. 홈 화면에서는 Android 뒤로가기를 눌렀을 때 종료 확인 메시지가 먼저 노출된다.
4. 스크롤/비스크롤 화면 모두 동일한 safe area 정책을 따른다.
5. 반려동물 등록 화면에서 Android 실기기로 이미지 선택이 실제로 가능하다.
6. 웹과 앱의 사진 입력 UX 차이가 사용자에게 혼란을 주지 않는다.
7. 반려동물 전환 선택 카드가 하나의 일관된 시각 계층으로 보인다.
8. dev client 환경에서 보이는 `expo-keep-awake` 로그가 앱 코드 문제인지 런타임 문제인지 분리된다.

---

## 3. 설계 결정

### 3.0 Android 뒤로가기 정책

정책:

- Android 하드웨어 뒤로가기는 화면 계층을 우선 따라야 한다.
- 스택에 이전 화면이 있으면 종료 대신 `goBack` 동작을 우선한다.
- 홈 화면에서는 즉시 종료하지 않고 종료 확인 다이얼로그를 거친다.

적용 대상:

- 루트 navigation container
- 홈 화면
- 반려동물 등록/수정 등 하위 폼 화면

주의:

- 화면마다 제각각 `BackHandler`를 붙여 정책이 분산되지 않게 한다.
- 폼 화면에서 뒤로가기 정책을 바꾸더라도 기존 저장/취소 플로우와 충돌하지 않게 한다.

### 3.1 Safe area 정책

정책:

- `react-native-safe-area-context`를 공통 컨테이너 기준으로 사용한다.
- 화면은 단순 padding이 아니라 `device inset + design spacing` 조합으로 여백을 계산한다.
- 스크롤 화면과 고정 화면이 같은 규칙을 공유해야 한다.

적용 대상:

- `app/src/components/common/screen-container.tsx`
- 이 컨테이너를 사용하는 auth/home/pets/schedules/records/settings 화면 전반

주의:

- 특정 화면만 개별 보정하는 방식으로 끝내지 않는다.
- 공통 컨테이너 기준이 먼저 닫혀야 후속 화면 튜닝 비용이 줄어든다.

### 3.2 반려동물 사진 등록 정책

정책:

- Android/iOS는 native image picker를 사용한다.
- 웹은 기존 DOM 기반 picker를 유지한다.
- 공통 `pickImage` 계층을 만들고, 플랫폼별 구현을 분리한다.

현재 권장:

- `expo-image-picker`를 우선 검토한다.
- 사진 데이터는 현재 구조를 크게 흔들지 않도록 우선 `photoUrl` 기반 payload와 호환되는 방식으로 연결한다.
- 서버 파일 업로드 정책은 이번 단계에서 바꾸지 않는다.

주의:

- 사진 업로드 스택을 임의로 서버 multipart 업로드로 전환하지 않는다.
- 현재 계약을 유지한 채 Android 입력 경로를 우선 닫는다.

### 3.3 `expo-keep-awake` 로그 처리 정책

정책:

- 이번 단계에서는 원인 확정보다 “앱 코드 이슈인지 dev client 런타임 로그인지” 구분하는 데 집중한다.
- 앱 코드에서 사용 흔적이 없으면 Android 실행 문서에 known issue 또는 관찰 메모로 남긴다.

주의:

- 증거 없이 앱 로직 문제로 단정하지 않는다.
- 우선순위는 safe area와 사진 등록보다 낮다.

### 3.4 반려동물 전환 선택 카드 정책

정책:

- `PetSwitcherSheet`의 선택 상태는 “카드 안의 카드”처럼 보이지 않도록 계층을 단순화한다.
- 선택 카드와 바깥 컨테이너의 배경/테두리/여백 역할을 명확히 분리한다.
- 선택 강조는 배경, badge, avatar, text tone 중 1~2개 축으로 정리하고 중복 강조를 줄인다.

적용 대상:

- `app/src/screens/pets/pet-switcher-sheet.tsx`
- 필요 시 `home-screen`에서 감싸는 섹션 카드

주의:

- 기능 로직은 바꾸지 않는다.
- 선택 카드만 고치기보다 리스트 내 다른 카드와의 시각 관계를 함께 본다.

---

## 4. 단계별 계획

### Step 0. Android 뒤로가기 정책 정리

목적:

- Android 실기기에서 뒤로가기 버튼이 앱 종료가 아니라 화면 복귀/종료 확인 규칙을 따르도록 만든다.

예상 변경 파일:

- `app/App.tsx`
- navigation 관련 루트 파일
- 필요 시 `app/src/screens/home/home-screen.tsx`
- 필요 시 반려동물 등록/수정 화면

필요 변경:

- 현재 navigation stack과 뒤로가기 기본 동작 확인
- 하위 화면에서는 스택 복귀 우선 적용
- 홈 화면에서는 종료 확인 다이얼로그 연결

완료 기준:

- `새 반려동물 등록` 같은 하위 화면에서 뒤로가기를 누르면 홈 또는 이전 화면으로 복귀한다.
- 홈 화면에서 뒤로가기를 누르면 종료 확인 메시지가 먼저 보이고, 확인 시에만 앱이 종료된다.

### Step 1. 공통 ScreenContainer safe area 보강

목적:

- Android 실기기에서 모든 주요 화면의 상단/하단 여백 규칙을 공통으로 맞춘다.

예상 변경 파일:

- `app/src/components/common/screen-container.tsx`
- 필요 시 `app/package.json`

필요 변경:

- `react-native-safe-area-context` 도입 여부 확인
- top/bottom inset 반영
- scrollable/non-scrollable 공통 spacing 정책 정리

완료 기준:

- 로그인/홈/반려동물 등록 화면에서 상단 헤더와 하단 CTA가 시스템 UI와 충돌하지 않는다.

### Step 2. Android 반려동물 사진 picker 도입

목적:

- 반려동물 등록/수정 화면에서 Android 실기기로 이미지 선택이 실제로 가능하게 만든다.

예상 변경 파일:

- `app/src/screens/pets/pet-form-screen.tsx`
- `app/src/components/forms/pet-form.tsx`
- 신규 공통 image picker 유틸
- 필요 시 `app/package.json`

필요 변경:

- 웹 picker와 native picker를 분리
- Android/iOS에서 파일 선택 성공 시 현재 `photoUrl` 상태에 반영
- 미지원 안내 문구를 실제 지원 정책과 일치하게 수정

완료 기준:

- Android 실기기에서 이미지 선택 버튼을 눌러 실제 사진을 선택할 수 있다.
- 선택 결과가 미리보기에 반영된다.

### Step 3. dev client 로그 재현 확인

목적:

- `expo-keep-awake` rejection 로그가 수정 대상인지 관찰 대상인지 분리한다.

예상 변경 파일:

- 문서 위주
- 필요 시 Android 실행 runbook

필요 변경:

- 홈 진입 직후 재현 여부 기록
- 앱 코드 직접 원인 여부 재확인
- known issue 또는 follow-up 메모 정리

완료 기준:

- 로그의 처리 방향이 명확해진다.

### Step 4. PetSwitcher 선택 카드 시각 정리

목적:

- 홈 화면의 `반려동물 전환` 영역에서 선택 카드가 내부 여백과 배경 계층 때문에 어색하게 보이지 않도록 정리한다.

예상 변경 파일:

- `app/src/screens/pets/pet-switcher-sheet.tsx`
- 필요 시 `app/src/screens/home/home-screen.tsx`

필요 변경:

- selected row와 container의 배경/테두리 역할 재정리
- 선택 badge와 텍스트 강조 수위 조정
- 안쪽 흰 여백처럼 보이는 시각 분리 최소화

완료 기준:

- 선택된 반려동물이 명확히 강조되면서도 카드 계층이 자연스럽게 읽힌다.

---

## 5. 후속 task 분해 기준

이 계획은 아래 5개 task로 분해하는 것이 적절하다.

1. Android Back Navigation Policy
2. Android Safe Area Container Alignment
3. Mobile Pet Image Picker Support
4. Dev Client Runtime Error Triage
5. Pet Switcher Selected Card Visual Alignment

task 분해 시 공통 원칙:

- 뒤로가기는 navigation 정책 중심으로 수정한다.
- safe area는 공통 컨테이너 중심으로 수정한다.
- 사진 등록은 플랫폼별 picker 분리로 해결한다.
- 선택 카드 문제는 시각 계층 단순화로 해결한다.
- 런타임 로그는 추정이 아니라 재현 결과를 문서로 남긴다.

---

## 6. 완료 기준

- Android 실기기에서 뒤로가기 동작이 화면 계층과 종료 확인 규칙을 따른다.
- Android 실기기에서 상단/하단 여백 문제가 개선된다.
- 반려동물 사진 등록이 Android에서 실제 동작한다.
- 반려동물 전환 선택 카드의 시각 위화감이 줄어든다.
- dev client 로그의 우선순위와 처리 방향이 문서로 남는다.
