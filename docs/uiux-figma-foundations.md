# Petory Figma Foundations

작성일: 2026-03-24  
목적: `docs/plan-uiux.md` 기준으로 피그마 foundations 파일을 바로 구성할 수 있도록 토큰 구조와 페이지 구성을 정리한다.

## 1. 파일 이름

`Petory Foundations`

## 2. 페이지 구조

- `00 Cover`
- `01 Colors`
- `02 Typography`
- `03 Spacing`
- `04 Radius`
- `05 Elevation`
- `06 Motion`
- `07 Usage Rules`

## 3. Color Variables

권장 변수 그룹:

- `bg/primary`
- `bg/secondary`
- `bg/tinted`
- `surface/default`
- `surface/elevated`
- `surface/glass`
- `text/primary`
- `text/secondary`
- `text/tertiary`
- `text/inverse`
- `border/subtle`
- `border/strong`
- `brand/primary`
- `brand/secondary`
- `brand/accent`
- `state/success`
- `state/warning`
- `state/error`
- `state/info`

코드 대응 기준:

- `app/src/theme/colors.ts`

## 4. Typography Styles

권장 스타일:

- `display/large`
- `title/xlarge`
- `title/large`
- `title/medium`
- `body/large`
- `body/medium`
- `body/small`
- `label/large`
- `label/medium`

코드 대응 기준:

- `app/src/theme/typography.ts`

## 5. Spacing / Radius

Spacing:

- `xxs = 4`
- `xs = 8`
- `sm = 12`
- `md = 16`
- `lg = 20`
- `xl = 24`
- `xxl = 32`

Radius:

- `sm = 12`
- `md = 16`
- `lg = 20`
- `xl = 28`
- `full = 999`

코드 대응 기준:

- `app/src/theme/spacing.ts`
- `app/src/theme/radius.ts`

## 6. Elevation / Motion

Elevation:

- `card`
- `floating`

Motion:

- `duration/fast = 120`
- `duration/base = 180`
- `duration/slow = 260`
- `easing/standard`
- `easing/emphasized`
- `easing/exit`

코드 대응 기준:

- `app/src/theme/shadows.ts`
- `app/src/theme/motion.ts`

## 7. Usage Rules

- 카드 배경은 pure white보다 warm neutral surface를 우선한다.
- CTA는 `brand/primary` 또는 `text/primary` 기반으로 제한한다.
- overdue/error는 state color와 텍스트 라벨을 함께 사용한다.
- 11pt 이하 텍스트 금지.
- 한 카드 안에서 타이포 계층은 최대 3단계만 사용한다.

