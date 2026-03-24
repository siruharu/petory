# Petory Figma Screens

작성일: 2026-03-24  
목적: `docs/plan-uiux.md` 기준으로 피그마 screens / prototype 파일 구성을 바로 시작할 수 있도록 화면 목록과 상태 프레임을 정리한다.

## 1. 파일 이름

- `Petory Screens`
- `Petory Prototype`

## 2. 핵심 화면 목록

- Login
- Signup
- Verify Email
- Home
- Pet List
- Pet Switcher Sheet
- Pet Form
- Schedule List
- Schedule Form
- Record List
- Record Form
- Settings

## 3. 화면별 필수 프레임

각 화면마다 아래 프레임을 만든다.

- `Default`
- `Loading`
- `Empty`
- `Error`
- `Success`

추가 프레임:

- 인증 화면: `Keyboard`
- 홈 화면: `Multiple Pets`
- 일정 화면: `Overdue`
- 기록 화면: `Memo Heavy`

## 4. Prototype Flows

### Auth Flow

- Login default
- Login error
- Signup success / verification pending
- Verify email success

### Home Flow

- Home with selected pet
- Pet switcher open
- Selected pet changed

### Schedule Flow

- Schedule list
- Complete schedule
- Success feedback

### Record Flow

- Record list
- Record form
- Save success

## 5. 상태 검토 체크리스트

- 키보드가 CTA를 가리지 않는가
- empty 상태에 다음 행동 CTA가 있는가
- error 상태에 재시도 문구가 있는가
- overdue와 completed가 색만이 아니라 라벨로도 구분되는가
- 홈에서 반려동물 컨텍스트가 가장 먼저 읽히는가

