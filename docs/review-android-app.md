# Android 앱 실행 리뷰

작성일: 2026-03-26  
근거 자료: 사용자 제공 Android 실기기 스크린샷 6장, 현재 `app/` 코드베이스

## Findings

### 1. High: Android safe area 처리가 실질적으로 빠져 있어 상단/하단 UI가 시스템 영역에 과도하게 붙는다

근거:

- 스크린샷에서 로그인 화면, 홈 화면, 반려동물 등록 화면 모두 상단 헤더가 상태바 바로 아래에 붙어 있다.
- 하단 CTA와 카드도 내비게이션 바와 매우 가깝게 배치돼 있다.

원인:

- `app/src/components/common/screen-container.tsx`는 `react-native`의 `SafeAreaView`만 사용한다.
- 현재 구현은 Android insets를 별도로 계산하지 않는다.
- `content`와 `scrollContent`의 상하 여백도 고정 `spacing`만 사용한다.

관련 코드:

- `app/src/components/common/screen-container.tsx:2`
- `app/src/components/common/screen-container.tsx:16`
- `app/src/components/common/screen-container.tsx:39`
- `app/src/components/common/screen-container.tsx:48`

영향:

- Android 실기기에서 첫인상이 조밀하고 답답하게 보인다.
- 상단 헤더, 설정 버튼, 하단 CTA가 시스템 UI와 시각적으로 충돌한다.
- 기기별 상태바/내비게이션 바 높이 차이를 흡수하지 못한다.

권장 조치:

- `react-native-safe-area-context` 기반으로 공통 컨테이너를 교체한다.
- 상단은 `top inset + 디자인 여백`, 하단은 `bottom inset + CTA 여백` 정책으로 바꾼다.
- 스크롤 화면과 비스크롤 화면 모두 동일 정책을 쓰게 맞춘다.

### 2. High: 반려동물 사진 등록이 Android에서 동작하지 않는 것은 버그가 아니라 현재 구현이 웹 전용으로 고정되어 있기 때문이다

근거:

- 사용자가 “앱으로 반려동물 추가할 때 사진등록이 안됨”을 보고했다.
- 스크린샷에도 안내 문구가 “현재 단계에서는 웹 파일 선택을 우선 지원해요.”로 노출된다.

원인:

- `app/src/components/forms/pet-form.tsx`에서 `Platform.OS === 'web'`일 때만 파일 선택 지원으로 안내하고 있다.
- `app/src/screens/pets/pet-form-screen.tsx`의 `handlePickPhoto()`는 항상 `pickWebImageAsDataUrl()`만 호출한다.
- `app/src/utils/web-image-picker.ts`는 DOM `document.createElement('input')`와 `FileReader`에 의존한다.
- 따라서 Android native runtime에서는 버튼이 있어도 실제 파일 선택 경로가 없다.

관련 코드:

- `app/src/components/forms/pet-form.tsx:126`
- `app/src/screens/pets/pet-form-screen.tsx:141`
- `app/src/utils/web-image-picker.ts:18`
- `app/src/utils/web-image-picker.ts:27`

영향:

- Android 앱에서 반려동물 프로필 이미지 등록이 사실상 불가능하다.
- 사용자는 버튼이 보이기 때문에 “지원되는 기능이 실패했다”고 인식한다.
- 웹과 앱의 기능 계약이 달라 동일 폼 UX가 신뢰를 잃는다.

권장 조치:

- Android/iOS에서는 `expo-image-picker` 또는 동등한 native picker를 붙인다.
- 공통 `pickImage` 추상화를 만들고, 웹은 기존 DOM picker, 앱은 native picker로 분기한다.
- 앱에서 native picker가 아직 없으면 버튼을 비활성화하거나 명시적으로 “미지원” 배지와 후속 계획을 노출한다.

### 3. Medium: 반려동물 전환의 선택 카드가 내부 여백과 배경 계층이 맞지 않아 선택 상태가 어색해 보인다

근거:

- 추가 스크린샷에서 `반려동물 전환` 영역의 현재 선택 카드가 바깥 카드와 안쪽 강조 카드의 계층이 따로 노는 것처럼 보인다.
- 선택된 카드 내부의 밝은 여백과 강조 배경이 일관되지 않아 카드가 한 덩어리로 읽히지 않는다.

원인:

- `app/src/screens/pets/pet-switcher-sheet.tsx`는 바깥 `container`에 별도 카드 배경을 주고, 그 안의 `selectedRow`에도 다시 강조 배경과 테두리를 준다.
- 현재 구조는 “카드 안의 카드” 형태인데, 선택 상태의 배경/여백 규칙이 충분히 구분되지 않아 내부 흰 여백이 의도치 않은 틈처럼 보인다.
- 특히 `container`의 `padding`과 `selectedRow`의 자체 `padding/backgroundColor/border` 조합이 선택 상태 강조보다 여백 분리를 더 강하게 보이게 한다.

관련 코드:

- `app/src/screens/pets/pet-switcher-sheet.tsx:24`
- `app/src/screens/pets/pet-switcher-sheet.tsx:67`
- `app/src/screens/pets/pet-switcher-sheet.tsx:85`
- `app/src/screens/pets/pet-switcher-sheet.tsx:95`

영향:

- 현재 선택된 반려동물이 강조되기보다 오히려 카드 내부 레이어가 어색하게 보인다.
- 선택 상태 시각 언어가 “강조”보다 “레이아웃 틈”처럼 읽혀 UI 완성도가 떨어진다.

권장 조치:

- `selectedRow`를 독립 카드처럼 보이게 할지, 시트 안의 리스트 아이템처럼 보이게 할지 하나로 정한다.
- 선택 카드의 배경색, border, 내부 padding을 바깥 `container`와 중복되지 않게 단순화한다.
- 필요 시 선택 카드에만 avatar/배지/강조 톤을 주고, 바깥 카드 배경은 더 중립적으로 낮춘다.

### 4. High: Android 하드웨어 뒤로가기 동작이 화면 이동 계약을 따르지 않고 즉시 앱 종료로 이어진다

근거:

- 사용자가 Android 폰에서 뒤로가기 버튼을 누르면 화면 이동이 아니라 앱이 바로 종료된다고 보고했다.
- 기대 동작은 `새 반려동물 등록` 같은 하위 화면에서는 홈 또는 이전 화면으로 복귀하는 것이고, 홈 화면에서는 종료 확인 메시지를 거쳐야 한다.

원인:

- 현재 저장소의 `app/src`와 `App.tsx`에서 `BackHandler`, `hardwareBackPress`, `beforeRemove`, `canGoBack` 같은 Android 뒤로가기 제어 흔적이 검색되지 않는다.
- 따라서 Android 하드웨어 뒤로가기가 기본 동작으로 흘러가고 있고, 내비게이션 스택 복귀와 앱 종료 확인 정책이 정의되지 않았을 가능성이 높다.
- 특히 홈 화면과 폼 화면의 뒤로가기 정책이 분리되어 있지 않으면, Android에서 사용자 기대와 다른 종료 동작이 바로 드러난다.

관련 코드:

- `app/App.tsx`
- `app/src`

영향:

- 사용자가 폼 작성 중 뒤로가기를 눌렀을 때 이전 화면 복귀 대신 앱이 종료되어 작업 흐름이 끊긴다.
- 홈 화면에서도 실수로 앱이 닫혀 Android 앱 기본 기대치에 맞지 않는다.
- 앱 전반의 내비게이션 신뢰도가 떨어진다.

권장 조치:

- Android 하드웨어 뒤로가기 정책을 화면 계층 기준으로 명시한다.
- 하위 화면에서는 `navigation.goBack()` 또는 스택 복귀를 우선 적용한다.
- 홈 화면에서는 첫 뒤로가기 시 종료 확인 다이얼로그를 띄우고, 확인 시에만 앱을 종료하게 한다.
- 이 정책은 개별 화면 임시 처리보다 공통 navigation 레벨에서 정의하는 편이 안전하다.

### 5. Medium: dev client 전환 중 `expo-keep-awake` rejection 로그가 보이지만, 현재 앱 코드 직접 원인은 확인되지 않는다

근거:

- 스크린샷에 `Exception in promise ... ExpoKeepAwake.activate has been rejected` 로그가 보인다.

관찰:

- 현재 저장소의 `app/src`와 `App.tsx`에서는 `expo-keep-awake`, `activateKeepAwake`, `useKeepAwake` 사용이 검색되지 않는다.
- 따라서 이 로그는 현재 앱 화면 코드보다 Expo dev launcher 또는 런타임 전환 과정에서 발생했을 가능성이 높다.

영향:

- 사용자는 앱 자체 오류로 인식할 수 있다.
- 하지만 우선순위는 safe area와 사진 등록보다 낮다.

권장 조치:

- dev client로 홈 진입 직후 동일 로그가 재현되는지 별도 확인한다.
- 재현 시 앱 코드가 아니라 dev client/Expo 런타임 로그인지 분리 기록한다.

## Open Questions

- 사진 업로드를 서버에 파일로 올릴지, 지금처럼 data URL 또는 외부 URL 입력을 유지할지 정책 결정이 필요하다.
- 푸시를 계속 유지할 경우 `google-services.json` 도입 이후 prebuild 재실행과 이미지 picker native 의존성 범위를 함께 정리하는 편이 효율적이다.
- Android 뒤로가기 정책을 React Navigation 전역 규칙으로 둘지, 홈/폼 화면별로 분리할지 구현 단위 결정이 필요하다.

## Review Summary

- 현재 Android 앱의 큰 사용자 체감 문제는 `safe area`, `사진 등록`, `하드웨어 뒤로가기` 3개다.
- 반려동물 전환 선택 카드의 배경/여백 불일치는 기능 오류는 아니지만 시각적 위화감이 커서 별도 UI 조정 항목으로 볼 필요가 있다.
- 다음 수정 우선순위는 `1) Android 뒤로가기 정책 정의`, `2) 공통 ScreenContainer safe area 수정`, `3) 반려동물 사진 picker의 native 지원 추가`, `4) PetSwitcher 선택 카드 시각 정리`가 맞다.
