# 반려동물 등록/대시보드/반려동물 탭 구현 계획

작성일: 2026-03-24  
기준 문서: `docs/research-pets.md`  
목적: 현재 앱 로컬 상태 보강에 의존하는 반려동물 흐름을, 실제 서버 저장/조회와 일관된 앱 데이터 흐름으로 전환하기 위한 상세 구현 계획을 정리한다.  
중요: 구현하지 않는다. 설계와 변경 방향만 기록한다.

---

## 1. 접근 방식

현재 문제의 본질은 UI 자체가 아니라 데이터 진실 원천이 앱 로컬 상태에 머물러 있다는 점이다.

현재 구조:

1. `POST /api/pets`는 응답만 만들고 저장하지 않는다.
2. `GET /api/pets`는정 항상 빈 배열을 준다.
3. `GET /api/dashboard/home`도 항상 빈 구조를 준다.
4. 앱은 이를 보완하려고 `root-navigator.tsx` 내부 로컬 `pets` 상태를 홈/반려동물 탭에 병합한다.
5. 현재 첫 로그인 직후 홈은 초기 hydration 타이밍에 error state를 먼저 보여줄 수 있다.
6. `다시 불러오기`는 전체 화면 loading으로 전환돼 UI가 깜빡이는 인상을 준다.

따라서 구현 방향은 아래 두 축으로 나뉜다.

### 1.1 1차 축: 서버를 실제 source of truth로 만든다

- `PetService`를 실제 persistence와 연결한다.
- `DashboardService`가 같은 반려동물 데이터를 집계해서 홈 응답으로 돌려주게 한다.
- 인증 사용자 기준으로 반려동물을 격리한다.

### 1.2 2차 축: 앱은 서버 truth를 우선 사용하고, 로컬 보강은 fallback으로 축소한다

- 등록 직후 UX는 유지하되, 서버가 정상 응답하는 경우 로컬 병합에 덜 의존하도록 줄인다.
- 홈과 반려동물 탭이 같은 응답 기준으로 움직이게 맞춘다.
- 현재 선택 반려동물 정렬 정책은 유지하되, 서버 persistence가 생겨도 일관되게 동작하게 한다.
- 첫 로그인 직후 홈 hydration은 error flash보다 loading/skeleton 유지 쪽으로 다듬는다.
- 수동 refresh는 full-screen loading 대신 soft refresh로 바꾼다.

### 1.3 기본 원칙

- 현재 기술 선택은 유지한다.
- 앱 구조를 완전히 갈아엎지 않는다.
- 기존 UX 개선 사항은 가능한 한 유지한다.
  - 선택형 필드
  - 몸무게 소수점 입력
  - 파일 선택 이미지 preview
  - 홈/탭의 현재 선택 항목 상단 고정 정책

---

## 2. 구현 목표

이번 구현 계획의 최종 목표는 아래다.

1. 반려동물 등록이 실제 서버 저장으로 이어진다.
2. 홈 대시보드가 서버에서 반려동물 목록과 선택된 반려동물 정보를 돌려준다.
3. 반려동물 탭이 서버에서 같은 반려동물 목록을 읽는다.
4. 앱은 새로고침 후에도 같은 반려동물 데이터를 다시 볼 수 있다.
5. 현재 앱의 UX 보정 로직은 서버 미응답 fallback 수준으로만 남긴다.
6. 첫 로그인 직후 홈 대시보드가 불필요한 error state를 먼저 노출하지 않는다.
7. `다시 불러오기`는 전체 화면 초기 loading으로 전환되지 않고 현재 화면 위에서 부드럽게 갱신된다.

---

## 3. 서버 구조 계획

### 3.1 현재 서버 상태

현재 파일 기준:

- [PetService.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/pet/PetService.kt)
  - `getPets()` → `emptyList()`
  - `createPet()` → 메모리 저장 없이 DTO 즉석 생성
- [DashboardService.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/dashboard/DashboardService.kt)
  - 항상 빈 응답
- [PetEntity.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/pet/PetEntity.kt)
  - persistence 모델 존재
- [PetRepository.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/pet/PetRepository.kt)
  - 인터페이스만 존재

즉 저장 구조의 형태는 있으나 wiring이 없다.

### 3.2 목표 서버 구조

#### 3.2.1 PetRepository 실제화

필요 변경:

- 현재 custom interface만 있는 `PetRepository`를 Spring Data JPA 기반으로 바꾼다.
- `PetEntity`를 JPA 엔티티로 전환한다.
- `users`와의 관계는 최소 MVP 기준으로 `userId` 값만 유지해도 된다.

예상 변경 파일:

- `server/src/main/kotlin/com/petory/pet/PetEntity.kt`
- `server/src/main/kotlin/com/petory/pet/PetRepository.kt`

핵심 설계:

- `findAllByUserIdOrderByCreatedAtDesc(...)` 또는 등록 순서 유지에 맞는 조회 메서드 추가
- `findByIdAndUserId(...)`
- `save(...)`

#### 3.2.2 PetService persistence 연결

필요 변경:

- 인증 사용자 `userId`를 받아 pet 저장/조회에 사용한다.
- DTO <-> Entity 매핑 함수를 내부에 둔다.

예상 변경 파일:

- `server/src/main/kotlin/com/petory/pet/PetService.kt`
- 필요 시 `server/src/main/kotlin/com/petory/auth/` 또는 인증 principal 관련 파일

핵심 메서드:

- `getPets(userId)`
- `createPet(userId, request)`
- `updatePet(userId, petId, request)`

주의:

- 현재 컨트롤러는 user context를 받지 않는다.
- 인증 principal 또는 JWT subject 기반 userId 주입 경로가 추가로 필요하다.

#### 3.2.3 PetController 인증 사용자 연결

필요 변경:

- 현재는 단순 request body만 받는다.
- 로그인 사용자 기준으로 pet를 저장해야 하므로 controller에서 current user 정보를 service에 넘겨야 한다.

예상 변경 파일:

- `server/src/main/kotlin/com/petory/pet/PetController.kt`
- 이미 존재하는 auth/security/current user 관련 코드

방식 후보:

- `Authentication` 주입
- custom current user principal 주입

현재 권장:

- 기존 JWT 인증 흐름에 맞춰 principal에서 `userId`를 꺼내는 방식

#### 3.2.4 DashboardService 집계 구현

필요 변경:

- `pets`를 실제 사용자 pet 목록에서 조회
- `selectedPet`는 쿼리 파라미터 `petId` 또는 첫 번째 pet 기준으로 결정
- 일정/기록은 현재 미구현이어도 최소한 pet 정보는 실제 목록을 돌려줘야 한다

예상 변경 파일:

- `server/src/main/kotlin/com/petory/dashboard/DashboardService.kt`
- `server/src/main/kotlin/com/petory/dashboard/DashboardController.kt`

핵심 전략:

- 1단계에서는 `pets`, `selectedPet`만 실제화
- `todaySchedules`, `overdueSchedules`, `recentRecords`는 빈 리스트 유지 가능
- 이 단계만으로도 홈 empty state 문제는 크게 줄어든다

#### 3.2.5 DTO/계약 정합성 유지

현재 `PetResponse`와 `DashboardPetResponse`는 필드 구조가 유사하다.

유지 원칙:

- 앱이 이미 사용하는 필드명은 바꾸지 않는다
- `photoUrl`은 그대로 둔다
- `weight`는 `Double?`
- `ageText`는 서버가 그대로 저장된 문자열을 돌려주거나, 최소 MVP에서는 request 값 유지

---

## 4. 앱 구조 계획

### 4.1 현재 앱 상태

앱은 현재 `root-navigator.tsx`의 로컬 `pets` 배열에 강하게 의존한다.

현재 장점:

- 서버가 비어 있어도 UX는 이어진다

현재 단점:

- persistence가 없다
- 홈과 반려동물 탭의 truth가 서버가 아니라 메모리다

### 4.2 목표 앱 구조

#### 4.2.1 루트 `pets` 상태 역할 축소

현재 역할:

- 등록 성공 직후 truth 역할

목표 역할:

- optimistic/fallback cache 역할만 수행

즉:

- 서버 조회 성공 시 서버 데이터 우선
- 서버 조회 실패 시에만 로컬 fallback 사용

#### 4.2.2 HomeScreen 서버 우선화

현재:

- `fetchHome()` 응답 + 로컬 `pets` 병합

목표:

- 서버가 정상 응답하면 서버 목록을 주 데이터로 사용
- 로컬 pets 병합은 실패 fallback 또는 등록 직후 transition 보조로만 사용
- 초기 hydration과 수동 refresh를 같은 상태로 취급하지 않는다

변경 대상:

- [home-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/home/home-screen.tsx)

추가 설계:

- 첫 진입용 `loading`과 수동 갱신용 `refreshing`을 분리한다.
- `hasLoadedOnce` 또는 동등한 기준으로 첫 진입 실패와 이후 refresh 실패를 다르게 처리한다.
- 이미 화면에 그린 데이터가 있으면 refresh 실패가 full-screen error로 번지지 않게 막는다.

#### 4.2.3 PetListScreen 서버 우선화

현재:

- `fetchPets()` 실패 시 local pets로 대체

목표:

- 서버 응답 정상화 이후에는 목록 화면이 서버 데이터와 거의 일치하도록 유지
- 로컬 fallback은 등록 직후/오프라인 느낌의 보조 역할만 수행

변경 대상:

- [pet-list-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-list-screen.tsx)

#### 4.2.4 등록 성공 후 refresh 흐름 단순화

현재:

- `handlePetCreateSuccess()`가 `upsertPet()`, `selectedPetId`, `homeRefreshToken`까지 모두 관리

목표:

- 등록 성공 응답은 일단 루트 상태에 넣어 immediate UX 유지
- 이후 `fetchHome()`, `fetchPets()`가 실제 서버 데이터로 이를 곧 덮어쓰게 한다

즉:

- 현재 구조는 유지하되 “영구 truth”가 아니라 “중간 cache”라고 보는 것이 맞다

### 4.3 반려동물 전환 정렬 정책 유지

현재 정책:

- 선택 항목 상단 고정
- 나머지 순서 유지

이 정책은 서버 persistence 구현 후에도 앱 레벨 view ordering으로 유지 가능하다.

즉 서버 저장 순서와 별개로:

- UI 표시만 `selectedPetId` 기준 재정렬
- 저장 데이터 자체를 reorder하지 않음

이 방식이 가장 안전하다.

---

## 5. 데이터 흐름 계획

### 5.1 등록 흐름

1. 사용자가 `PetFormScreen`에서 입력
2. 앱이 `CreatePetPayload` 생성
3. `POST /api/pets`
4. 서버가 DB에 저장
5. 서버가 저장된 `PetResponse` 반환
6. 앱 루트가 로컬 `pets`에 임시 반영
7. 홈 화면 진입 시 `GET /api/dashboard/home`
8. 서버가 실제 저장된 pet 목록을 반환
9. 앱이 로컬 fallback보다 서버 응답을 우선 표시

### 5.2 홈 진입 흐름

1. `HomeScreen` 마운트
2. `fetchHome({ petId })`
3. 서버가 사용자 pet 목록 반환
4. `selectedPet` 결정
5. 앱이 switcher와 summary card를 그림

보강 조건:

- fallback 여부가 결정되기 전에는 성급하게 `error`로 내리지 않는다.
- 서버 실패여도 로컬 fallback pet가 있으면 `error` 대신 `success` 또는 `empty`로 수렴시킨다.
- 서버와 로컬 모두 비었을 때만 최종 empty state를 노출한다.

### 5.2.1 홈 수동 refresh 흐름

1. 사용자가 `다시 불러오기`를 누른다.
2. 기존 화면 데이터는 유지한다.
3. 별도 `refreshing` 상태만 올린다.
4. 동일한 `fetchHome({ petId })`를 다시 호출한다.
5. 성공 시 현재 데이터만 교체한다.
6. 실패 시 기존 데이터는 유지하고, 작은 오류 메시지나 상태 텍스트만 갱신한다.

핵심:

- refresh는 full-screen loading이 아니라 soft refresh여야 한다.
- 이미 렌더된 카드와 목록을 비우지 않는다.

### 5.3 반려동물 탭 진입 흐름

1. `PetListScreen` 마운트
2. `fetchPets()`
3. 서버가 사용자 pet 목록 반환
4. 앱이 `selectedPetId` 기준 view ordering 적용
5. 화면 렌더

### 5.4 이미지 흐름

현재 MVP:

1. 웹 파일 선택
2. `FileReader.readAsDataURL`
3. data URL을 `photoUrl`에 저장
4. 서버 저장

장기 목표:

1. 파일 선택
2. 업로드 API 호출
3. 업로드 결과 URL 획득
4. 그 URL을 `photoUrl`로 저장

즉 현행 구현은 장기 구조의 placeholder다.

---

## 6. 파일별 변경 계획

### 서버

#### 6.1 [PetEntity.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/pet/PetEntity.kt)

변경 계획:

- JPA 엔티티 어노테이션 추가
- 테이블/컬럼 매핑 추가
- no-arg/JPA 호환 구조 유지

#### 6.2 [PetRepository.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/pet/PetRepository.kt)

변경 계획:

- Spring Data JPA repository로 전환
- 사용자 기준 조회 메서드 추가

#### 6.3 [PetService.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/pet/PetService.kt)

변경 계획:

- persistence 저장/조회 구현
- DTO 매핑 함수 추가
- update 시 기존 entity 조회 후 patch 적용

#### 6.4 [PetController.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/pet/PetController.kt)

변경 계획:

- 인증 사용자 식별자 주입
- service 호출 시 userId 전달

#### 6.5 [DashboardService.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/dashboard/DashboardService.kt)

변경 계획:

- pet list 조회 구현
- selectedPet 결정 구현
- 최소 home 응답 실데이터화

#### 6.6 [DashboardController.kt](/Users/zephyr/Documents/projects/petory/server/src/main/kotlin/com/petory/dashboard/DashboardController.kt)

변경 계획:

- 인증 사용자 식별자 전달

### 앱

#### 6.7 [root-navigator.tsx](/Users/zephyr/Documents/projects/petory/app/src/app/navigation/root-navigator.tsx)

변경 계획:

- 로컬 `pets`를 fallback cache 의미로 유지
- 필요 시 이후 `selectedPetId` persistence 검토

#### 6.8 [home-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/home/home-screen.tsx)

변경 계획:

- 서버 성공 시 서버 기준 우선화
- fallback 로직은 유지하되 축소
- 초기 hydration에서 error flash가 나지 않도록 상태 전환 조건 정리
- `다시 불러오기`는 별도 `refreshing` 상태로 분리
- 기존 데이터 유지 상태에서 soft refresh UX 제공

#### 6.9 [pet-list-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-list-screen.tsx)

변경 계획:

- 홈과 동일하게 서버 우선/fallback 보조 구조 유지
- 에러와 empty를 서버 truth 기준으로 더 명확히 나눔

#### 6.10 [pet-form-screen.tsx](/Users/zephyr/Documents/projects/petory/app/src/screens/pets/pet-form-screen.tsx)

변경 계획:

- 현재 UX 구조 유지
- 향후 data URL vs 업로드 URL 저장 정책 바뀔 경우 브리지 지점으로 사용

#### 6.11 [pet-form.tsx](/Users/zephyr/Documents/projects/petory/app/src/components/forms/pet-form.tsx)

변경 계획:

- 현재 UX 유지
- 운영 이미지 업로드 구조가 생기면 URL 입력 fallback 제거 가능

---

## 7. 코드 수준 구현 방향 예시

### 7.1 서버 `PetService` 예시 방향

```kotlin
@Service
class PetService(
    private val petRepository: PetRepository,
) {
    fun getPets(userId: UUID): List<PetResponse> =
        petRepository.findAllByUserIdOrderByCreatedAtDesc(userId).map(::toResponse)

    fun createPet(userId: UUID, request: CreatePetRequest): PetResponse {
        val saved = petRepository.save(
            PetEntity(
                userId = userId,
                name = request.name,
                species = request.species,
                breed = request.breed,
                sex = request.sex,
                neuteredStatus = request.neuteredStatus,
                ageText = request.ageText,
                note = request.note,
                photoUrl = request.photoUrl,
            ),
        )
        return toResponse(saved)
    }
}
```

핵심 포인트:

- request를 즉석 응답으로 돌려주지 않고 저장 결과를 응답으로 만든다.

### 7.2 앱 `PetListScreen` 장기 방향 예시

```tsx
const result = await fetchPets();
setPets(orderPetsForDisplay(result, selectedPetId));
setStatus(result.length === 0 ? 'empty' : 'success');
```

fallback은 이렇게 분리한다.

```tsx
catch {
  if (localPets.length > 0) {
    setPets(orderPetsForDisplay(localPets, selectedPetId));
    setStatus('success');
    return;
  }
  setStatus('error');
}
```

핵심 포인트:

- fallback은 유지하지만 기본 truth는 서버가 되어야 한다.

### 7.3 앱 `HomeScreen` hydration/refresh 방향 예시

```tsx
const [status, setStatus] = useState<HomeStatus>('loading');
const [isRefreshing, setIsRefreshing] = useState(false);
const [homeData, setHomeData] = useState<HomeResponse | null>(null);

async function loadHome(mode: 'initial' | 'refresh') {
  if (mode === 'initial' && homeData === null) {
    setStatus('loading');
  } else {
    setIsRefreshing(true);
  }

  try {
    const result = await fetchHome({ petId: selectedPetId ?? undefined });
    setHomeData(result);
    setStatus(result.pets.length === 0 ? 'empty' : 'success');
  } catch {
    if (homeData !== null) {
      setStatus(homeData.pets.length === 0 ? 'empty' : 'success');
      return;
    }

    if (localPets.length > 0) {
      setHomeData(createFallbackHomeResponse(localPets, selectedPetId));
      setStatus('success');
      return;
    }

    setStatus('error');
  } finally {
    setIsRefreshing(false);
  }
}
```

핵심 포인트:

- 첫 진입과 refresh는 같은 fetch를 써도 상태 전환은 다르게 해야 한다.
- 이미 데이터가 있으면 refresh 실패가 full-screen error로 번지지 않게 막는다.

---

## 8. 트레이드오프

### 8.1 앱 로컬 보강을 유지하는 경우

장점:

- 서버 미구현 상태에서도 UX가 즉시 좋아진다.

단점:

- 서버 truth와 불일치할 수 있다.
- 복구/재진입 일관성이 약하다.

현재 판단:

- 완전히 제거하지는 말고 fallback 수준으로 낮추는 것이 적절하다.

### 8.2 홈 집계를 한 번에 실제화하는 경우

장점:

- 홈 empty state 문제를 구조적으로 해결한다.

단점:

- 일정/기록까지 같이 하려 들면 범위가 커진다.

현재 판단:

- 첫 단계는 `pets`와 `selectedPet`만 실제화하면 충분하다.

### 8.3 이미지 업로드를 지금 서버까지 완결하는 경우

장점:

- UX와 저장 구조가 바로 맞물린다.

단점:

- 저장소/API 범위가 갑자기 커진다.

현재 판단:

- 지금 단계의 핵심은 pet persistence다.
- 이미지 업로드는 data URL 임시 저장을 유지하고 후속 단계로 넘길 수 있다.

---

## 9. 리스크

### 높음

- `PetService`와 `DashboardService`가 계속 스켈레톤이면 현재 UX는 새로고침 후 무너진다.

### 중간

- 인증 사용자 `userId`를 pet/domain 서비스에 안전하게 주입하는 경로가 정리되지 않으면 persistence 연결이 지연될 수 있다.
- data URL 기반 이미지 저장을 오래 끌면 payload 크기 문제가 생길 수 있다.
- 홈과 반려동물 탭의 fallback 정책이 너무 오래 유지되면 디버깅이 어려워질 수 있다.
- 첫 로그인 직후 hydration 분기가 잘못 잡히면 서버가 정상이어도 일시적 error flash가 남을 수 있다.
- refresh 상태를 별도 분리하지 않으면 작은 기능 수정에도 전체 화면 깜빡임이 재발할 수 있다.

### 낮음

- 선택 항목 상단 정렬 정책 자체는 view layer 문제라 서버 persistence와는 충돌이 적다.

---

## 10. 완료 기준

이 계획이 완료됐다고 볼 기준:

1. `POST /api/pets`가 실제 DB 저장으로 이어진다.
2. `GET /api/pets`가 현재 사용자 pet 목록을 돌려준다.
3. `GET /api/dashboard/home`가 최소한 `pets`와 `selectedPet`을 실제 데이터로 돌려준다.
4. 앱에서 새로고침 후에도 홈/반려동물 탭에서 같은 반려동물을 다시 볼 수 있다.
5. 현재 앱 UX 개선 사항은 유지된다.
   - 파일 선택 이미지
   - 몸무게 소수점 입력
   - 홈/탭 정렬 정책
   - 홈/탭 스크롤
6. 첫 로그인 직후 홈에서 불필요한 error flash 없이 로딩 후 데이터 또는 empty state로 수렴한다.
7. `다시 불러오기` 클릭 시 전체 화면이 깜빡이지 않고 기존 데이터 위에서 갱신된다.

---

## 11. 최종 판단

현재 코드베이스에서 가장 중요한 다음 단계는 `반려동물 UI를 더 예쁘게 만드는 것`이 아니다.  
핵심은 서버의 `PetService`, `PetRepository`, `DashboardService`를 실제 데이터 흐름으로 연결해서 앱이 더 이상 메모리 보강에 크게 의존하지 않게 만드는 것이다.  
앱 쪽은 이미 상당한 UX 보강이 들어가 있으므로, 다음 구현은 서버 persistence와 앱의 server-first 전환을 중심으로 진행하는 것이 맞다.
