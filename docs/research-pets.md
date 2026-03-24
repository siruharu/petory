# 반려동물 등록 / 대시보드 / 반려동물 탭 연구

작성일: 2026-03-24  
대상:
- `app/src/app/navigation/root-navigator.tsx`
- `app/src/screens/pets/pet-form-screen.tsx`
- `app/src/components/forms/pet-form.tsx`
- `app/src/screens/home/home-screen.tsx`
- `app/src/screens/pets/pet-list-screen.tsx`
- `app/src/screens/pets/pet-switcher-sheet.tsx`
- `app/src/features/pets/pet-api.ts`
- `app/src/features/home/home-api.ts`
- `server/src/main/kotlin/com/petory/pet/*`
- `server/src/main/kotlin/com/petory/dashboard/*`
- `docs/api-contract.md`

목적:
- 현재 코드 기준으로 반려동물 추가 등록, 대시보드 표시, 반려동물 탭 연동 흐름을 깊이 있게 추적한다.
- app/server가 각각 실제로 어디까지 구현됐는지 구분한다.
- 현재 UX가 왜 “부분적으로는 잘 보이고”, “새로고침/재진입 기준으로는 약한지” 구조적으로 정리한다.

---

## 1. 전체 결론

현재 반려동물 흐름은 앱 기준으로는 상당히 진전되어 있다.

1. 반려동물 등록 화면 진입이 가능하다.
2. 종/품종/성별/중성화/생일/몸무게/이미지까지 입력할 수 있다.
3. 등록 성공 후 홈에서 즉시 반영된다.
4. 홈에서 반려동물 탭으로 이동해도 같은 세션 안에서는 등록된 반려동물이 이어서 보인다.
5. 다중 반려동물 전환 시 현재 선택 항목을 상단에 보여주는 정책도 적용되어 있다.

하지만 서버 기준으로는 핵심 도메인이 아직 스켈레톤이다.

1. `GET /api/pets`는 여전히 빈 배열을 반환한다.
2. `POST /api/pets`는 저장 없이 응답 DTO만 즉석 생성한다.
3. `GET /api/dashboard/home`도 빈 `pets`와 `selectedPet = null`을 반환한다.
4. 즉 현재 “등록 후 홈과 목록이 이어지는 것”은 서버 persistence가 아니라 앱 루트 로컬 상태 덕분이다.

따라서 현재 구조는:

- UX 관점: 부분적으로 동작
- persistence 관점: 미완성
- server truth 관점: 거의 미구현

---

## 2. app 기준 핵심 데이터 흐름

### 2.1 루트 상태가 사실상 반려동물 source of truth 역할을 한다

파일:
- [root-navigator.tsx](/Users/zephyr/Documents/projects/petory/app/src/app/navigation/root-navigator.tsx)

`AppState()` 내부 핵심 상태:

- `route`
- `pets: Pet[]`
- `selectedPetId?: string`
- `homeRefreshToken: number`

핵심 함수:

- `upsertPet(nextPet)`
- `handlePetCreateSuccess(nextPet)`

등록 성공 시 현재 실제 흐름:

1. `POST /api/pets` 성공
2. 응답 `Pet`를 `handlePetCreateSuccess(nextPet)`로 받음
3. 루트 `pets` 배열에 합침
4. `selectedPetId = nextPet.id`
5. `homeRefreshToken += 1`
6. `route = 'home'`

즉, 앱은 서버 조회 결과를 기다리지 않고 루트 메모리 상태를 먼저 반영한다.

이 구조의 장점:

- 서버가 비어 있어도 등록 직후 UX가 이어진다.

이 구조의 한계:

- 새로고침/앱 재시작/세션 초기화 시 메모리 상태는 사라진다.
- 따라서 이 구조는 persistence가 아니라 “local fallback cache”에 가깝다.

---

## 3. 반려동물 추가 등록 흐름

### 3.1 진입 경로

등록 화면 진입은 아래 세 경로로 이어진다.

- 홈의 `onCreatePet`
- 반려동물 탭의 `onCreatePet`
- `PetSwitcherSheet`의 `onAddPet`

모두 결국 루트에서 `route = 'pet-create'`로 이어진다.

### 3.2 등록 폼 상태

파일:
- [pet-form-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-form-screen.tsx)

현재 폼 상태는 `PetFormState`로 관리된다.

구성:

- `name`
- `species`
- `breed`
- `sex`
- `neuteredStatus`
- `birthDate`
- `ageText`
- `weightDraft`
- `note`
- `photoUrl`
- `photoName`

핵심 설계:

#### 3.2.1 몸무게는 문자열 draft

`weightDraft`를 문자열로 유지한 뒤 제출 시 `parseWeightDraft()`로 숫자 변환한다.

이유:

- `3.`
- `4.2`
- `0.5`

같은 입력 중간 상태를 깨지 않게 하기 위해서다.

#### 3.2.2 이미지 선택은 data URL 기반

파일:
- [web-image-picker.ts](/Users/zephyr/Documents/projects/petory/app/src/utils/web-image-picker.ts)

현재 웹 이미지 선택 흐름:

1. `input[type=file]`
2. `FileReader.readAsDataURL`
3. 결과를 `photoUrl`에 저장
4. 파일명은 `photoName`에 저장

즉 실제 업로드 API는 없고, 현재는 브라우저 내부 data URL을 저장 payload처럼 쓰는 상태다.

### 3.3 폼 컴포넌트 UI

파일:
- [pet-form.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form.tsx)

입력 UX:

- 이름: `TextField`
- 종: `SelectField`
- 품종: `SearchSelectField`
- 성별: `SelectField`
- 중성화 상태: `SelectField`
- 생일: `DatePickerField`
- 현재 나이: 읽기 전용
- 체중: 문자열 input + decimal-pad
- 메모: multiline
- 이미지:
  - 파일 선택 버튼
  - 이미지 지우기 버튼
  - fallback URL 입력
  - 미리보기 카드

현재 상태 판단:

- UX 자체는 상당히 개선되어 있다.
- 다만 image는 아직 data URL MVP이며, 운영 수준 업로드는 아니다.

---

## 4. 홈 대시보드 확인 흐름

파일:
- [home-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/home/home-screen.tsx)
- [home-api.ts](/Users/zephyr/Documents/projects/petory/app/src/features/home/home-api.ts)

### 4.1 서버 응답과 로컬 pet 상태를 병합한다

핵심 함수:

- `mergePets(primaryPets, secondaryPets)`
- `deriveStatus(response)`
- `orderPetsForDisplay(pets, selectedPetId)`

현재 홈 로드 흐름:

1. `fetchHome({ petId: selectedPetId })`
2. 성공 시:
   - 서버 `response.pets`와 루트 `pets` 병합
   - `selectedPet` 결정
   - `status` 계산
3. 실패 시:
   - 루트 `pets`가 있으면
     - 로컬 pet 기반으로 `status = 'success'`
   - 로컬도 없으면
     - `status = 'error'`

즉 홈은 이미 “server-first처럼 보이지만 실제로는 local fallback에 강하게 의존”한다.

### 4.2 홈 empty state가 완전히 서버 truth는 아니다

`deriveStatus()`는 아래가 모두 비었을 때만 `empty`다.

- `pets`
- `todaySchedules`
- `overdueSchedules`
- `recentRecords`

즉 현재는 서버 홈 집계가 비어 있어도, 루트 `pets`가 병합되면 홈 empty state를 피할 수 있다.

이건 UX적으로는 유리하지만, server truth를 정확히 반영한 상태는 아니다.

### 4.3 다중 반려동물 전환 정책

현재 정책:

- 현재 선택된 반려동물을 목록 상단에 위치시킨다.
- 나머지는 기존 순서를 유지한다.

이 정렬은 홈의 `PetSwitcherSheet`에 적용된다.

장점:

- 현재 컨텍스트 파악이 쉽다.

주의:

- 이 정책은 데이터 저장 순서가 아니라 view order다.

---

## 5. 반려동물 탭 연동 흐름

파일:
- [pet-list-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-list-screen.tsx)
- [pet-api.ts](/Users/zephyr/Documents/projects/petory/app/src/features/pets/pet-api.ts)

### 5.1 현재 증상과 보정

이전 문제:

- 홈에서는 반려동물이 보이는데
- 반려동물 탭은 `fetchPets()` 실패 시 바로 error로 떨어졌다

현재 수정 후 흐름:

1. `fetchPets()` 시도
2. 성공 시:
   - 서버 pet 목록 + 로컬 pet 목록 병합
   - `selectedPetId` 기준 정렬
3. 실패 시:
   - `localPets.length > 0`이면 success 유지
   - 로컬도 없으면 error

즉 이제 반려동물 탭도 홈과 같은 “local fallback” 구조로 보강되었다.

### 5.2 현재 연동의 본질

반려동물 탭은 서버 `GET /api/pets`를 호출하긴 하지만,
현재 서버 구현이 비어 있으므로 실질적으로는 루트 `pets` 상태가 계속 UX를 살린다.

즉 현재는:

- 홈 → 로컬 fallback
- 반려동물 탭 → 로컬 fallback

둘 다 local state 덕분에 이어진다.

---

## 6. app에서 실제로 연동되는 파일들

### 6.1 앱 라우팅/상태

- [root-navigator.tsx](/Users/zephyr/Documents/projects/petory/app/src/app/navigation/root-navigator.tsx)

역할:

- 반려동물 세션 상태 보관
- 등록 성공 후 홈 복귀
- 홈/반려동물 탭에 같은 pet state 전달

### 6.2 반려동물 등록

- [pet-form-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-form-screen.tsx)
- [pet-form.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form.tsx)

역할:

- 입력 UX
- payload 생성
- 등록 성공 후 루트에 전달

### 6.3 홈

- [home-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/home/home-screen.tsx)

역할:

- 홈 집계 API 호출
- 로컬 pet fallback
- 선택 반려동물 정렬/표시

### 6.4 반려동물 탭

- [pet-list-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-list-screen.tsx)

역할:

- 목록 API 호출
- 로컬 pet fallback
- 홈과 같은 정렬 정책 적용

### 6.5 전환 UI

- [pet-switcher-sheet.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-switcher-sheet.tsx)

역할:

- 현재 선택 항목 표시
- 다른 반려동물 전환
- 현재 정책을 UI 문구로 설명

---

## 7. server 기준 현재 상태

### 7.1 PetController는 존재하지만 실제 persistence가 없다

파일:
- [PetController.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/pet/PetController.kt)

현재 라우트:

- `GET /api/pets`
- `POST /api/pets`
- `PATCH /api/pets/{petId}`

문제는 controller가 아니라 service다.

### 7.2 PetService는 스켈레톤

파일:
- [PetService.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/pet/PetService.kt)

현재 구현:

- `getPets()` → `emptyList()`
- `createPet(request)` → UUID를 새로 만들고 request 필드로 `PetResponse` 생성
- `updatePet(petId, request)` → request 기반으로 `PetResponse` 생성

즉:

- 저장 없음
- 조회 없음
- 사용자 격리 없음
- repository 미사용

### 7.3 DashboardService도 스켈레톤

파일:
- [DashboardService.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/dashboard/DashboardService.kt)

현재 구현:

- `selectedPet = null`
- `pets = emptyList()`
- `todaySchedules = emptyList()`
- `overdueSchedules = emptyList()`
- `recentRecords = emptyList()`

즉 홈은 현재 서버 관점에서 “항상 빈 대시보드”다.

### 7.4 persistence 구조는 후보만 존재

파일:
- [PetEntity.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/pet/PetEntity.kt)
- [PetRepository.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/pet/PetRepository.kt)

확인된 점:

- `PetEntity`는 있지만 JPA 어노테이션이 없다
- `PetRepository`는 Spring Data JPA repository가 아니라 plain interface 수준이다
- `PetService`는 둘 다 사용하지 않는다

즉 설계만 있고 연결은 없다.

---

## 8. 인증/사용자 연계 관점

반려동물 persistence를 실제화하려면 인증 사용자와 연결돼야 한다.

관련 파일:
- [JwtAuthenticationFilter.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/auth/JwtAuthenticationFilter.kt)
- [AuthenticatedUser.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/auth/AuthenticatedUser.kt)
- [AuthService.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/auth/AuthService.kt)

현재 확인된 점:

- JWT filter는 `AuthenticatedUser(id, email)`를 principal로 넣는다
- 즉 현재 security context에 `userId`는 이미 존재한다
- 하지만 `PetController`와 `DashboardController`는 아직 이 principal을 사용하지 않는다

의미:

- server에서 user별 pet 저장/조회로 가기 위한 기반은 있다
- 다만 controller/service wiring이 비어 있다

---

## 9. app/server 불일치의 핵심

앱이 기대하는 것:

- `POST /api/pets` 저장됨
- `GET /api/pets` 같은 데이터 다시 나옴
- `GET /api/dashboard/home`에도 그 pet가 보임

현재 서버가 하는 것:

- `POST /api/pets`는 저장 없이 응답만 생성
- `GET /api/pets`는 항상 빈 배열
- `GET /api/dashboard/home`는 항상 빈 데이터

현재 앱이 하는 것:

- `POST` 응답만 받아 로컬 메모리에 넣음
- `GET`이 실패하거나 비어도 로컬 메모리로 UX를 이어감

즉 현재 반려동물 UX는 “API integration”이라기보다 “API skeleton 위에 얹은 local continuity layer”다.

---

## 10. edge case

### 10.1 등록 직후 홈은 보이는데 새로고침 후 사라짐

가능성 높음.

이유:

- 루트 `pets`는 메모리 상태
- 서버 목록/홈 API는 아직 비어 있음

### 10.2 홈과 반려동물 탭이 세션 안에서는 맞지만, 다른 브라우저 탭에서 다름

가능성 높음.

이유:

- local state는 현재 탭 안에서만 유지됨

### 10.3 이미지 payload가 너무 큼

가능성 있음.

이유:

- 현재 웹 이미지 선택은 data URL 기반
- 큰 이미지는 request body가 커질 수 있음

### 10.4 선택 반려동물 정렬이 저장 순서를 가림

가능성 있음.

이유:

- 현재 view order는 selected-first
- 실제 등록 순서와 다르게 보일 수 있음

### 10.5 목록 API가 나중에 실제화되면 로컬 fallback과 충돌 가능

가능성 있음.

이유:

- 지금은 merge 전략이 UX를 살리지만
- 서버 truth가 생긴 뒤에도 merge를 과도하게 유지하면 중복/정렬 혼란이 생길 수 있음

---

## 11. 현재 구조의 장점

1. UI 관점에서 등록 후 즉시성이 좋다.
2. 홈/반려동물 탭 불일치를 앱 레벨에서 완화했다.
3. 이미지, 몸무게, 선택형 입력 등 등록 UX는 꽤 정리됐다.
4. server persistence가 들어와도 app 쪽 구조는 fallback layer로 재활용 가능하다.

---

## 12. 현재 구조의 핵심 한계

1. persistence가 없다.
2. server truth가 없다.
3. 홈/반려동물 탭 일관성이 세션 메모리에 의존한다.
4. data URL 이미지 저장은 운영 구조로 오래 가져가기 어렵다.
5. 반려동물 도메인에서 user ownership이 API 계층까지 연결되지 않았다.

---

## 13. 다음 단계에서 가장 중요한 작업

현재 코드 기준으로 가장 중요한 후속 구현은 아래 순서다.

1. server `PetEntity`를 JPA entity로 전환
2. `PetRepository`를 실제 persistence repository로 전환
3. `PetService`를 저장/조회 기반으로 구현
4. `PetController`가 인증 사용자 기준으로 동작하도록 변경
5. `DashboardService`에서 실제 `pets`와 `selectedPet`를 반환
6. 앱은 local fallback은 유지하되 server-first 구조로 점진적 축소

---

## 14. 최종 판단

현재 반려동물 추가 등록 / 대시보드 확인 / 반려동물 탭 연동은 앱 UX만 놓고 보면 상당 부분 닫혀 있다.  
하지만 그 안정성의 원인은 server 구현이 아니라 app의 로컬 상태 보강이다.  
따라서 다음 단계의 핵심은 UI 추가 작업이 아니라 server의 `PetService`와 `DashboardService`를 실제 저장/조회 구조로 바꾸는 일이다.
