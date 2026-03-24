# UI/UX 상세 구현 계획

작성일: 2026-03-24  
기준 문서: `docs/research-uiux.md`, `docs/research-app.md`, `docs/plan-app.md`  
대상: `app/` 하위 앱 UI/UX 구조  
중요: 이 문서는 구현 계획 문서다. 코드 구현은 포함하지 않는다.

## 0. 명시적 가정

- 현재 기술 스택은 Expo + React Native + TypeScript를 유지한다.
- 화면 전환은 현 상태의 단순 분기 구조를 당장 버리기보다, 먼저 UI 계층을 정리한 후 네비게이션 정교화로 이어간다.
- MVP 범위는 로그인, 회원가입, 이메일 인증 안내, 홈, 반려동물, 일정, 기록, 설정이다.
- 피그마 산출물은 실제 개발 핸드오프를 목표로 하며, 단순 무드보드가 아니다.
- 2026년형 UI를 참고하되, 과도한 실험 UI보다 “실행 가능한 고품질 앱”을 목표로 한다.
- 웹 프리뷰에서도 확인 가능해야 하므로, 폭이 좁은 모바일 기준 레이아웃을 웹에서 그대로 재현할 수 있어야 한다.

## 1. 접근 방식

### 1.1 목표

현재 Petory 앱의 문제는 기능 부족보다 “경험 구조 부재”다.

- 로그인은 동작하지만 제품다운 진입 경험이 없다.
- 홈은 데이터는 보여주지만 우선순위가 없다.
- 목록 화면은 조회는 하지만 실행을 유도하지 못한다.
- 상태 화면은 있어도 디자인 시스템이 없어 화면마다 톤이 분리될 가능성이 높다.

따라서 UI/UX 구현은 아래 순서가 맞다.

1. 디자인 토큰과 공통 레이아웃 기준 확정
2. 공통 컴포넌트 계층 정리
3. 인증 화면 재구성
4. 홈 화면 재구성
5. 반려동물/일정/기록 화면 재구성
6. 상태 화면과 피드백 패턴 통일
7. 피그마 핸드오프 구조 정리

### 1.2 핵심 원칙

#### 원칙 1: 한 화면, 한 목적

- 로그인은 로그인만
- 회원가입은 가입과 인증 안내만
- 홈은 오늘의 돌봄 요약만
- 일정 목록은 실행만
- 기록 목록은 회고만

#### 원칙 2: 카드 중심 구조

현재 단순 `Text` 나열 방식 대신, 모든 핵심 정보는 카드 단위로 묶는다.

- 홈: summary card / alert card / recent card
- 일정: actionable schedule card
- 기록: type-specific record card
- 반려동물: profile card / switch row

#### 원칙 3: CTA는 직설적이고 가까워야 한다

- 버튼 문구는 추상 금지
- 입력 화면의 주요 버튼은 하단 고정 영역을 우선 검토
- 목록 화면의 “추가” 액션은 화면 상단 텍스트 버튼보다 시각적으로 분명해야 한다

#### 원칙 4: 상태는 비주얼과 문구를 함께 설계한다

`loading / empty / error / success`는 단순 문자열이 아니라 공통 패턴으로 설계한다.

#### 원칙 5: 감성보다 신뢰를 우선한다

- 사진, 재질감, 컬러는 감성을 만든다
- 정보 구조, 시각 계층, 마지막 업데이트 시각은 신뢰를 만든다
- Petory는 감성 앱이 아니라 생활형 관리 앱이다

## 2. 디자인 시스템 계획

## 2.1 색상 체계

앱 전역에 아래 역할 기반 컬러 체계를 도입한다.

- `bg.primary`: 메인 배경
- `bg.secondary`: 보조 배경
- `surface.default`: 일반 카드
- `surface.elevated`: 강조 카드
- `surface.glass`: 반투명 헤더/시트
- `text.primary`: 핵심 본문
- `text.secondary`: 보조 정보
- `text.inverse`: 역상 텍스트
- `border.subtle`: 얕은 구분선
- `brand.primary`: 메인 액션
- `brand.secondary`: 선택/강조 보조
- `state.success`
- `state.warning`
- `state.error`
- `state.info`

방향:

- 베이스는 warm neutral
- 포인트는 orange + green 조합
- overdue와 error는 coral 계열
- 병원/메모 계열은 mist blue 계열

## 2.2 타이포 체계

앱 전체 타이포는 4단계 안쪽으로 제한한다.

- `display`: 로그인/홈의 핵심 헤드라인
- `title`: 섹션 제목, 카드 제목
- `body`: 본문, 메타 정보
- `label`: 버튼, 배지, 입력 라벨

권장 크기:

- display: 28~32
- title large: 22~24
- title medium: 18~20
- body: 15~17
- label: 13~15

제약:

- 11 이하 금지
- 한 카드 안에서 굵기 3종 이상 사용 금지

## 2.3 간격과 재질감

토큰:

- spacing: `4 / 8 / 12 / 16 / 20 / 24 / 32`
- radius: `12 / 16 / 20 / 28 / full`
- card stroke: 1px subtle border
- shadow: 얕은 depth 1~2단계만
- blur: 시트/상단 유리층에만 제한 사용

적용 방향:

- 일반 카드: radius 20
- 버튼: radius 16
- 바텀시트: radius 28
- 입력: radius 16

## 2.4 모션 체계

토큰:

- fast: 120ms
- base: 180ms
- slow: 260ms

적용:

- 시트 등장/퇴장
- 일정 완료 시 카드 축소/정렬
- 반려동물 전환
- 성공 메시지 등장

제외:

- hover 위주 애니메이션
- 과도한 skeleton shimmer
- 장식용 parallax

## 3. 공통 컴포넌트 구조 계획

현재 앱에는 재사용 UI 컴포넌트가 거의 없다.  
단순 폼/카드 스켈레톤을 “화면 품질을 결정하는 공통 UI”로 끌어올릴 필요가 있다.

## 3.1 변경 대상 폴더

```text
app/src/components/common/
app/src/components/forms/
app/src/components/cards/
app/src/components/feedback/
app/src/components/navigation/
app/src/components/pets/
```

## 3.2 새로 정의할 공통 컴포넌트

### common

- `screen-shell.tsx`
- `section-header.tsx`
- `sticky-action-bar.tsx`
- `app-top-bar.tsx`

### feedback

- `empty-state.tsx`
- `error-state.tsx`
- `loading-state.tsx`
- `inline-message.tsx`
- `status-chip.tsx`

### cards

- `pet-summary-card.tsx`
- `schedule-summary-card.tsx`
- `schedule-alert-card.tsx`
- `record-summary-card.tsx`
- `dashboard-summary-card.tsx`

### inputs/forms

- `text-field.tsx`
- `field-group.tsx`
- `form-section.tsx`
- 기존 `pet-form`, `schedule-form`, `record-form`은 새 필드 컴포넌트 위에 재구성

## 3.3 기존 파일 기준 수정 대상

- `app/src/components/common/screen-container.tsx`
- `app/src/components/cards/schedule-card.tsx`
- `app/src/components/cards/record-card.tsx`
- `app/src/components/forms/pet-form.tsx`
- `app/src/components/forms/schedule-form.tsx`
- `app/src/components/forms/record-form.tsx`

## 4. 화면 구조 계획

## 4.1 루트 네비게이션

현재 [root-navigator.tsx](/Users/zephyr/Documents/projects/petory/app/src/app/navigation/root-navigator.tsx)는 `Button` 두 개로 화면을 바꾸는 개발용 구조다.  
UI/UX 관점에서는 이 파일이 “사용자용 레이아웃 셸”을 책임지면 안 된다.

변경 방향:

- `LoadingState`, `ErrorState`, `AuthState`, `AppState`를 시각적으로 완성된 상태 화면으로 바꾼다.
- 상단 개발용 `Auth Stack`, `App Stack` 텍스트와 수동 버튼은 제거 대상이다.
- 인증 영역과 앱 영역의 시각 규칙을 분리한다.

권장 구조:

- `AuthState`: 꽉 찬 단일 컬럼, 입력 집중형
- `AppState`: 상단 컨텍스트 헤더 + 콘텐츠 스택 + 하단 내비게이션 또는 상단 섹션 전환

## 4.2 로그인 화면

대상 파일:

- `app/src/screens/auth/login-screen.tsx`

문제:

- 입력 필드와 버튼이 단순 나열이다.
- `Resend Verification Email`이 같은 우선순위로 보여서 주 CTA를 흐릴 수 있다.
- 서버 오류와 사용자 입력 오류가 같은 톤으로 보인다.

변경 계획:

- 상단에 작은 브랜드/제품 설명
- 중앙에 이메일/비밀번호 필드
- 하단 sticky action 영역에 주요 CTA
- 미인증 상태일 때만 보조 재전송 영역 노출
- 오류 문구는 필드 수준 또는 CTA 위 인라인 메시지로 제한

화면 섹션:

1. top intro
2. form fields
3. inline error/info
4. primary CTA
5. secondary link group

## 4.3 회원가입 화면

대상 파일:

- `app/src/screens/auth/signup-screen.tsx`

변경 계획:

- 입력 폼과 성공 후 안내 상태를 같은 시각 체계 안에서 분리한다.
- 가입 완료 후 “다음 행동”을 명확히 하는 success panel을 둔다.
- 재전송 버튼은 성공 카드 안쪽 보조 CTA로 내린다.

상태:

- initial
- submitting
- signup success / verification pending
- resend success
- resend failure

## 4.4 이메일 인증 화면

대상 파일:

- `app/src/screens/auth/verify-email-screen.tsx`

변경 계획:

- 링크 기반 진입과 수동 토큰 입력 두 경우를 모두 수용하는 레이아웃
- 토큰 입력은 개발/예외용 보조 흐름처럼 보이게 구성
- 기본 경험은 “메일 링크로 인증 완료”를 전제한 success-first 구조가 맞다

섹션:

1. 인증 안내
2. 토큰 입력 보조 UI
3. 인증 성공/실패 상태 블록
4. 메일 재전송 링크

## 4.5 홈 화면

대상 파일:

- `app/src/screens/home/home-screen.tsx`

현재 장점:

- 데이터 구조는 이미 홈에 필요한 핵심 도메인을 갖고 있다.

현재 문제:

- 정보 우선순위가 없다.
- 반려동물 컨텍스트와 행동 유도가 약하다.
- `Refresh Home` 버튼 같은 개발형 인터랙션이 사용자 경험을 깨고 있다.

변경 계획:

- 상단 `pet context hero`
- 그 아래 `오늘 돌봄 요약 카드`
- `놓친 일정` 경고 카드
- `오늘 일정 리스트`
- `최근 기록`
- `빠른 행동` 영역

세부 규칙:

- `selectedPet`이 있으면 이름, 종, 짧은 상태 문구를 헤더에 넣는다.
- overdue가 1개 이상이면 홈 최상단 경고 카드로 끌어올린다.
- `recentRecords`는 3개 초과 노출 금지
- `refresh`는 pull-to-refresh 또는 아이콘형 보조 액션으로 낮춘다.

## 4.6 반려동물 목록 / 전환

대상 파일:

- `app/src/screens/pets/pet-list-screen.tsx`
- `app/src/screens/pets/pet-switcher-sheet.tsx`
- `app/src/screens/pets/pet-form-screen.tsx`

계획:

- 반려동물 목록은 “단순 리스트”가 아니라 “현재 반려동물 + 다른 반려동물 + 새 등록” 흐름으로 정리
- `PetSwitcherSheet`는 실제 핵심 패턴 컴포넌트로 승격
- `PetListScreen`은 관리 화면 성격, `PetSwitcherSheet`는 빠른 전환 성격으로 역할 분리

목록 카드 정보:

- 이름
- 종
- 성별/생일 또는 나이
- 마지막 활동 요약
- 선택 상태

## 4.7 일정 목록 / 생성

대상 파일:

- `app/src/screens/schedules/schedule-list-screen.tsx`
- `app/src/components/cards/schedule-card.tsx`
- `app/src/screens/schedules/schedule-form-screen.tsx`
- `app/src/components/forms/schedule-form.tsx`

변경 계획:

- 일정 목록은 시간표보다 실행 중심 리스트로 설계
- 카드 안에 `제목 / 타입 / 시각 / 펫 / 완료 CTA`를 명확히 둔다
- 완료 버튼은 눈에 띄되 destructive하게 보이지 않게 한다
- 생성 화면은 필드 나열이 아니라 단계적 그룹화로 읽히게 한다

필수 시각 상태:

- due soon
- overdue
- completed
- repeating

## 4.8 기록 목록 / 생성

대상 파일:

- `app/src/screens/records/record-list-screen.tsx`
- `app/src/components/cards/record-card.tsx`
- `app/src/screens/records/record-form-screen.tsx`
- `app/src/components/forms/record-form.tsx`

변경 계획:

- 기록은 timeline 중심으로 재배치
- 기록 타입에 따라 카드 강조 포인트를 달리한다
- 병원 메모는 메모 본문이 우선
- 체중 기록은 값과 단위가 우선

형태:

- compact timeline row
- memo card
- measurement card

## 4.9 설정

대상 파일:

- `app/src/screens/settings/settings-screen.tsx`

현재 문제:

- 버튼이 기능 위주로만 배치되어 있다.
- 계정/알림/세션이 한 덩어리로 보인다.

변경 계획:

- `계정`
- `알림`
- `세션`

3개 섹션으로 분리한다.

표시 정보:

- 로그인 이메일
- 이메일 인증 여부
- 푸시 권한 상태
- 토큰 등록 상태
- 로그아웃

## 5. 코드 구조 계획

## 5.1 공통 스타일 진입점

새 파일 후보:

```text
app/src/theme/colors.ts
app/src/theme/typography.ts
app/src/theme/spacing.ts
app/src/theme/radius.ts
app/src/theme/shadows.ts
app/src/theme/motion.ts
app/src/theme/index.ts
```

역할:

- 화면마다 inline style을 복붙하지 않기 위한 토큰 레이어
- 피그마 토큰과 코드 토큰을 대응시키기 위한 기준점

## 5.2 화면별 스타일 분리 방식

선호 방식:

- 화면 로직과 스타일 토큰은 같은 파일에 둘 수 있다
- 다만 구조가 복잡한 경우 `styles` 객체를 하단에 분리
- 공통 컴포넌트는 자체 스타일을 가지되 토큰만 참조

금지:

- 화면마다 색상 hex 직접 입력
- 동일 padding/radius 값 하드코딩 반복

## 5.3 복합 UI 분리 기준

아래처럼 분리한다.

- `home-screen.tsx`: 데이터 조합 + 섹션 배치
- `dashboard-summary-card.tsx`: 오늘 요약 카드
- `schedule-alert-card.tsx`: overdue 경고 카드
- `pet-summary-card.tsx`: 선택된 반려동물 상단 카드

즉, 화면은 배열과 상태를 관리하고, 시각적 의미 단위는 컴포넌트가 책임진다.

## 6. 상태 UI 계획

현재 앱은 `loading / success / empty / error` 문자열은 갖고 있지만, 시각 패턴은 없다.  
이를 공통 피드백 컴포넌트로 통일한다.

## 6.1 Loading

요구:

- 단순 `Loading...` 텍스트 대신, 섹션 수에 맞는 skeleton block 또는 placeholder card
- 홈은 3~4개 카드 skeleton
- 목록은 row skeleton

## 6.2 Empty

요구:

- 비어 있는 이유
- 다음 행동
- 보조 설명

예:

- `오늘 일정이 없어요`
- `새 일정을 추가하면 여기에서 바로 확인할 수 있어요`
- `일정 추가`

## 6.3 Error

요구:

- 기술 오류 문구 금지
- 무엇이 실패했는지 설명
- 재시도 CTA 제공

예:

- `홈 정보를 불러오지 못했어요`
- `잠시 후 다시 시도해 주세요`
- `다시 불러오기`

## 6.4 Success / Inline feedback

요구:

- 일정 완료
- 인증 메일 재전송
- 기록 저장

등은 토스트 또는 인라인 성공 메시지로 짧게 끝낸다.

## 7. 피그마 산출물 계획

## 7.1 최소 피그마 파일 세트

1. `Petory Foundations`
2. `Petory Components`
3. `Petory Screens`
4. `Petory Prototype`
5. `Petory Handoff`

## 7.2 화면 프레임 규칙

각 핵심 화면마다 아래 프레임을 만든다.

- default
- loading
- empty
- error
- success
- keyboard

화면 목록:

- login
- signup
- verify-email
- home
- pet-list
- pet-switcher-sheet
- pet-form
- schedule-list
- schedule-form
- record-list
- record-form
- settings

## 7.3 컴포넌트 변형 규칙

예:

- button / primary / default
- button / primary / pressed
- button / primary / disabled
- card / schedule / due
- card / schedule / overdue
- card / schedule / completed
- card / record / memo
- card / record / weight

## 7.4 개발 핸드오프 규칙

피그마에서 반드시 명시할 항목:

- spacing 값
- radius 값
- typography style 이름
- color token 이름
- component state 이름
- empty/error/loading copy

## 8. 파일별 변경 계획

## 8.1 우선 변경 파일

```text
app/src/app/navigation/root-navigator.tsx
app/src/components/common/screen-container.tsx
app/src/screens/auth/login-screen.tsx
app/src/screens/auth/signup-screen.tsx
app/src/screens/auth/verify-email-screen.tsx
app/src/screens/home/home-screen.tsx
```

이 파일들은 앱 첫인상과 핵심 경험을 결정하므로 1차 적용 대상이다.

## 8.2 2차 변경 파일

```text
app/src/screens/pets/pet-list-screen.tsx
app/src/screens/pets/pet-switcher-sheet.tsx
app/src/screens/pets/pet-form-screen.tsx
app/src/components/forms/pet-form.tsx
app/src/screens/schedules/schedule-list-screen.tsx
app/src/components/cards/schedule-card.tsx
app/src/screens/schedules/schedule-form-screen.tsx
app/src/components/forms/schedule-form.tsx
```

## 8.3 3차 변경 파일

```text
app/src/screens/records/record-list-screen.tsx
app/src/components/cards/record-card.tsx
app/src/screens/records/record-form-screen.tsx
app/src/components/forms/record-form.tsx
app/src/screens/settings/settings-screen.tsx
```

## 9. 트레이드오프

### 9.1 빠른 구현 vs 토큰화

- 빠른 구현은 inline style로 가능하다.
- 하지만 지금 inline style을 더 쌓으면 이후 전면 재작업 비용이 커진다.
- 따라서 최소 토큰 레이어는 먼저 필요하다.

### 9.2 웹 우선 검증 vs 모바일 정교함

- 웹 우선이면 빠르게 볼 수 있다.
- 하지만 모바일 키보드, safe area, 바텀시트 감각은 약해질 수 있다.
- 따라서 피그마에서 모바일 상태 프레임을 함께 보완해야 한다.

### 9.3 단일 화면 단순화 vs 정보량

- 홈에 너무 많은 정보를 넣으면 풍부해 보이지만 실행성이 떨어진다.
- MVP에서는 정보량보다 우선순위가 더 중요하다.

## 10. 리스크

### 10.1 디자인 시스템 없이 화면만 예쁘게 바꾸는 경우

결과:

- 로그인과 홈의 스타일이 따로 놀 수 있다.
- 일정/기록 카드가 일관되지 않다.

### 10.2 피그마와 코드 토큰 불일치

결과:

- 핸드오프 문서는 있어도 실제 코드가 따라가지 못한다.

### 10.3 개발용 구조를 사용자용 UI에 남겨두는 경우

예:

- `Auth Stack`
- `App Stack`
- `Refresh Home`

이런 텍스트/버튼은 반드시 제거 대상으로 관리해야 한다.

### 10.4 인증 화면 과설명

인증 흐름은 복잡하지만, 화면이 장황해지면 이탈이 커진다.

원칙:

- 안내는 짧게
- 다음 행동은 크게
- 예외 복구는 보조로

## 11. 최종 구현 우선순위

1. theme 토큰 추가
2. 공통 레이아웃 / 상태 컴포넌트 추가
3. 로그인 / 회원가입 / 인증 화면 개편
4. 홈 화면 개편
5. 반려동물 전환 패턴 정리
6. 일정 카드 / 목록 / 폼 개편
7. 기록 카드 / 목록 / 폼 개편
8. 설정 화면 정리
9. 피그마 핸드오프 정리

## 12. 완료 기준

이 계획이 완료됐다고 볼 수 있는 기준은 아래다.

- 로그인, 회원가입, 인증 화면이 제품 수준의 시각 계층과 CTA 구조를 가진다.
- 홈 화면이 “오늘의 돌봄 대시보드”처럼 보인다.
- 반려동물 전환, 일정 완료, 기록 확인이 공통 카드/시트 패턴으로 읽힌다.
- `loading / empty / error / success`가 공통 UX 패턴으로 통일된다.
- 피그마 파일 구조가 토큰-컴포넌트-스크린-프로토타입-핸드오프로 정리된다.
- 코드베이스에 theme 토큰과 공통 UI 계층이 생겨, 이후 화면 확장 시 동일 규칙을 재사용할 수 있다.

## 13. Review Annotation

`docs/review.md` 기준으로 UI/UX 계획에는 아래 보정이 추가된다.

### 13.1 공통 컴포넌트 범위 재정렬

계획에는 `screen-shell`, `section-header`, `sticky-action-bar`, `app-top-bar`, `status-chip`, `schedule-summary-card`, `record-summary-card`, `form-section`까지 포함돼 있었지만, 실제 구현은 그보다 적은 범위로 진행됐다.

따라서 다음 기준 중 하나를 택해야 한다.

1. 실제 계획 범위를 현재 구현 수준으로 축소한다.
2. 또는 누락된 공통 컴포넌트를 추가 구현해 계획과 맞춘다.

현재 기준으로는 2번이 더 적절하다. 이유는 화면별 ad-hoc 스타일이 다시 늘어나는 조짐이 있기 때문이다.

### 13.2 루트 UI 셸 기준 보정

검토 결과 `RootNavigator`가 상단 셸을 그리고 하위 화면이 다시 전체 화면 컨테이너를 가지는 구조가 생겼다.

따라서 UI/UX 계획에는 아래를 명시한다.

- 화면 셸은 한 단계만 둔다.
- auth, home, settings는 하나의 상위 layout rule 안에 있어야 한다.
- 상단 설명과 실제 화면이 분리된 2단 레이아웃은 피한다.

### 13.3 CTA 진실성 기준 추가

UI 계획에는 CTA의 위계는 적었지만, 실제로 동작하지 않는 CTA 금지 규칙이 빠져 있었다.

추가 원칙:

- 보이는 주요 CTA는 반드시 행동 가능해야 한다.
- 아직 연결되지 않은 액션은 disabled 또는 숨김 처리한다.
- fake CTA는 UX 신뢰를 크게 떨어뜨리므로 허용하지 않는다.

### 13.4 상태 컴포넌트 완료 기준 보정

현재 `loading / empty / error` 공통화는 일부 됐지만, 계획 문서가 의도한 수준의 상태 일관성은 아직 미완성이다.

추가 기준:

- 상태 컴포넌트는 루트/auth/home/list/form 전 영역에서 같은 패턴으로 읽혀야 한다.
- success/information feedback도 tone과 위치 기준을 통일한다.

### 13.5 다음 UI/UX 단계 우선순위 갱신

1. 루트/화면 컨테이너 책임 정리
2. 누락된 공통 UI 컴포넌트 보강
3. dead CTA 제거 또는 실제 연결
4. auth / home / settings의 상태 위치와 CTA 위치 통일
5. 이후 cards/forms 세부 polish
