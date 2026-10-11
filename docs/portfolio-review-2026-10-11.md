# 포트폴리오 개선 및 검증 보고서

작업일: 2026-10-11. 기준 버전: `3591f30`. 작업 시작 시 Git 작업 트리는 깨끗했습니다.

## A. 수정 요약

| 영역 | 확인한 문제 | 적용 내용 |
| --- | --- | --- |
| INTRO → ABOUT | ‘카드 밖의 이야기’가 성장 연출의 연장으로 읽힘 | ‘이제, 저를 소개합니다.’와 프론트엔드 개발자 소개로 변경. 모바일 긴 한글 제목의 잘림도 수정 |
| PC 첫 화면 | 직무 설명이 작고 일부 너비에서 단계 바와 겹침 | `FRONTEND DEVELOPER`와 한글 직무·이름을 별도 읽기 영역에 표시 |
| WORK 표지 | 본격적인 프로젝트 소개라는 설명이 부족함 | 짙은 갈색 헤더, 한글 프로젝트 설명, 개인 01–03 / 팀 04–06 안내. SELECTED WORK와 기존 지면 구성 유지 |
| 프로젝트 본문 | 버전·기술 나열이 혼재하고 모바일 담당 영역 라벨이 숨겨짐 | BUILT WITH를 역할별로 묶고 핵심 기술을 먼저 표시. 한글 개인/팀 구분과 ‘담당한 부분’ 상시 표시 |
| 팀 프로젝트 진입 | 04부터 팀 작업이라는 구분이 모바일에서 숨겨짐 | 04에 ‘04—06 / 팀 프로젝트’ 표시. 추가 탐색 화면은 넣지 않음 |
| 기술 섹션 | 기술 이름과 일반 설명 위주 | ‘프로젝트에 활용한 기술’로 정의. 카드별로 적용 프로젝트와 구현 기능을 추가 |
| 태블릿 820px | 기술 카드가 3열로 좁게 배치됨 | 761–900px 구간만 2열로 변경. 한글 단어 중간 줄바꿈 방지 |
| PLAY | 섹션 의미와 구현 설명의 가독성이 약함 | 직접 제작한 게임·개발 실험임을 한글로 안내. 구현 본문 15px, 중요한 보조 정보 12px |
| CONTACT | 이전 요청의 화면 압축 여부 확인 필요 | 1440×900에서 현재 높이 834px, 제목·이메일·GitHub가 함께 보임을 확인. 이미 반영된 배치와 복사 기능 유지 |
| 모바일 목차 | HELLO 라벨 및 작은 화면의 메뉴 폭 | CONTACT로 변경. 320px에서 전 메뉴 노출, 12px 라벨과 44px 높이 터치 영역 |
| 대표 작업 CTA | WORK 표지를 거쳐야 첫 프로젝트에 도착함 | 첫 프로젝트를 선택하고 표지를 열어 `work-pages`로 직접 이동. 일반 스크롤의 표지는 유지 |
| 모바일 미리보기 | 모바일 영상이 숨겨진 채 요청됨 | 준비된 실제 PC/모바일 미디어에만 전환 버튼 제공. 현재 선택한 미디어 표시 |
| PLAY 내부 스크롤 | 내부 패널 끝에 도달한 관성이 바로 다음 섹션으로 이동함 | 휠 제스처의 읽기 상태를 기억하고, 입력이 220ms 이상 멈춘 다음 새 입력부터 섹션 이동 허용. 터치·키보드 반복 입력도 분리 |
| 초기 미디어 | 숨겨진 프로젝트들의 이미지·영상까지 요청됨 | WORK 접근 시 현재·다음 PC 미리보기 우선 요청. 나머지는 선택 시 로드. 모바일 영상은 모바일 보기 선택 시 로드 |
| 전환 미디어 | 늦게 로드된 이미지가 전환 중 비어 보일 가능성 | 이동할 PC 이미지의 디코딩을 기다리고, 전환 완료까지 나가는 지면의 미디어 유지. 비활성 영상 일시정지 |
| UI 표시 | 기술 카드의 장식 화살표가 링크처럼 보이고 이동 화살표가 계속 깜빡임 | 장식 화살표 제거. 실제 프로젝트 링크 화살표는 유지. 이동 안내 애니메이션은 3회 후 정지 |

프로젝트 순서·실제 서비스 링크·개별 테마는 유지했습니다. `transition.js`의 지면 전환 시간 0.62초 및 기존 WORK 진입 이동 시간 0.78초도 변경하지 않았습니다. 신규 패키지는 추가하지 않았습니다. 기술 카드의 ‘작업에서 보기’ 링크도 해당 카드에서 설명한 대표 프로젝트에 연결합니다.

### 주요 변경 파일

- `src/components/SelectedWorkMagazine/workProjects.js`: 프로젝트 설명, 팀 구분, 역할별 `techGroups`.
- `src/components/SelectedWorkMagazine/SelectedWorkMagazine.jsx`: 표지, 담당 영역, 기술 그룹, 미리보기 전환, 필요한 미디어만 요청, 이동 이미지 준비.
- `src/components/SelectedWorkMagazine/ProjectMedia.jsx`: 미디어 활성화 조건, 영상 preload 및 비활성 영상 정지.
- `src/components/PortfolioChapters/PortfolioChapters.tsx`: 자기소개·기술 카드 콘텐츠, 내부 스크롤 제스처 처리.
- `src/components/PortfolioChapters/chapterData.ts`: CONTACT 메뉴, 기술 카드의 프로젝트별 구현 근거.
- `src/components/PortfolioChapters/chapterNavigation.ts`: 대표 프로젝트 직접 이동과 6개 프로젝트 별칭.
- `src/components/YoojinHero/YoojinHero.tsx`: 대표 작업 CTA와 PC 직무 표시.
- `src/components/PlayGallery/PlayGallery.jsx`: PLAY의 한글 의미와 사용 안내.
- `src/portfolio.content.css`: 기존 스타일을 바탕으로 한 정보 위계·가독성·반응형 보완. `App.tsx`에서 마지막에 불러옵니다.

## B. 콘텐츠 및 기술 검증

포트폴리오에 이미 연결된 여섯 GitHub 저장소의 소스를 임시 폴더로 내려받았습니다. 패키지 설치 목록뿐 아니라 실제 import, 호출, 컴포넌트·스타일 사용을 확인했습니다. 아래 링크는 점검 당시 커밋에 고정한 소스입니다.

| 번호 / 프로젝트 | BUILT WITH 정리 내용 | 실제 코드 근거 |
| --- | --- | --- |
| 01 달빛서점 | React / Vite → JavaScript·Router·Zustand → Firebase Auth / Firestore / Storage → SCSS Modules·canvas-confetti. 버전 번호·배포 도구 나열 제거 | [소스 `39f1330`](https://github.com/tichieeee1023/moon-light/tree/39f1330b19d34d661402e4c261a1113cf4c11814): `package.json`, `src/store/cartStore.js`, `src/firebase/storageService.js`, `src/pages/AdminProducts.jsx`, `src/pages/OrderComplete.jsx`, 실제 `.module.scss` 파일 |
| 02 데일리 하비스트 | React / Vite·JavaScript·Router → Chart.js / react-chartjs-2·localStorage → SCSS·GSAP → react-helmet-async | [소스 `9b7db06`](https://github.com/tichieeee1023/Daily_Harvest/tree/9b7db06465ae3ce75df95a1af413136839d0f53c): `src/pages/Home.jsx`의 차트, `src/pages/Settings.jsx`, `src/utils/uiPreferences.js`, `src/components/Sidebar.jsx`의 GSAP, 페이지별 Helmet import |
| 03 어린왕자 B612 | React / Vite·JavaScript·Router·Zustand → Firebase Auth / Firestore → Framer Motion·Canvas API·SCSS Modules | [소스 `60ad2cf`](https://github.com/tichieeee1023/TheLittlePrince-B612/tree/60ad2cf00187f421e11eb730449dcf06820879ea): `src/store/useGuestbookStore.js`의 getDocs/addDoc/startAfter/limit, `src/store/useAuthStore.js`, `src/components/CosmicMap.jsx`, `src/components/CosmicSnow.jsx`, `.module.scss` 파일 |
| 04 포로그 | JavaScript·HTML / CSS → JSON / Fetch API·localStorage → Swiper. 실제 사용이 확인된 슬라이더 보강 | [소스 `24ad95b`](https://github.com/TAE0419/forlog2/tree/24ad95b410453674a36398f6688e9ea4761ed676): `products/products_index.html`의 상품 fetch와 `new Swiper('.weekly-swiper')`, `new Swiper('.hero-swiper')`, `products/cart_test.html`의 브라우저 저장 상태 |
| 05 미드나잇 코드 | JavaScript·HTML / CSS → JSON·HTML Audio·localStorage → 공통 화면 연출 GSAP | [소스 `eadcfda`](https://github.com/TAE0419/midnightChord/tree/eadcfdad1820afdf5c787cd98e3229629ca6ea07): `common.html`의 audio 요소, `js/trackit-app.js`의 재생, `pages/podcasts/podcasts.js`의 콘텐츠·페이지 처리, `pages/playlist/playlist.js`의 저장, `pages/opening/opening.js`의 GSAP |
| 06 자작 | React / Vite·JavaScript·Router → Firebase Auth / Firestore·localStorage → 공통 UI/차트의 SCSS Modules·Chart.js / react-chartjs-2·GSAP → 팀 공통 서비스 Firebase Functions / OpenAI API | [소스 `4d4b6a4`](https://github.com/jiwoo1012/TeamProject2/tree/4d4b6a4fb3344aead0147babf4e7c6319c1c545a): `src/pages/CartOrder/Checkout.jsx`의 가격·재고·수량 검증 및 Firestore 트랜잭션, `src/utils/cartStorage.js`, `src/pages/Admin/AiLogManage.jsx`의 차트, `src/components/ui/EventCelebration/EventCelebration.jsx`의 GSAP, `src/services/recommendationApi.js`의 httpsCallable 및 `functions/src/recommendation.js`의 실제 OpenAI 호출 |

React 프로젝트에 실제로 쓰이지 않은 Swiper를 일괄 추가하지 않았습니다. React/Vite, Chart.js와 React 바인딩, Firebase 서비스는 관련 역할을 알아볼 수 있게 묶었습니다. Git/GitHub·Vercel 같은 협업·배포 도구는 구현 기술 그룹에서 제외했습니다. Firebase Storage는 실제 업로드 화면이 확인된 달빛서점에만 표시합니다.

자작의 추천 생성 요청은 `src/pages/AiCurator/AiResult.jsx`의 `httpsCallable(..., 'recommendJajak')`와 `functions/src/index.js`의 onCall 처리, `functions/src/recommendation.js`의 `openai.responses.create(...)`까지 연결해 확인했습니다.

### 팀 작업과 개인 작업 범위

- 01–03은 개인 프로젝트, 04–06은 팀 프로젝트로 한글 라벨을 항상 표시합니다.
- 04 시작에 같은 지면 안에서 팀 작업 구분을 추가했습니다.
- 모바일에서도 ‘담당한 부분 / MY CONTRIBUTION’과 기존 담당 내용이 보입니다.
- 팀 BUILT WITH 아래에는 전체 프로젝트 기술 목록이라는 설명을 둡니다. 팀의 GSAP 연출·차트 등을 본인의 단독 담당으로 표시하지 않습니다.
- 개인 담당 서술은 기존 포트폴리오 내용을 바탕으로 유지했습니다. 소스에서 해당 기능은 확인했지만, 코드의 존재만으로 작성자별 기여도를 확정하지는 않았습니다.

### 검증 범위와 보류 항목

- PLAY의 LAST ORDER, SUBWAY, NO SIGNAL 원본 저장소는 이번 작업에서 제공되거나 연결돼 있지 않았습니다. 기존 기술·구현 설명을 유지했고, 새 기술·성과를 추가하지 않았습니다.
- NEON BREAK는 `public/games/play-gallery/neon-break/main_Sound.js`에서 Canvas 2D, requestAnimationFrame, 키보드 입력, AudioContext 구현을 직접 확인했습니다.
- 자작의 AI 서비스는 README만으로 판단하지 않고 클라이언트의 Firebase Callable 호출과 서버의 OpenAI SDK 호출을 확인했습니다. ‘팀 공통 서비스’로 표시했으며, 본인이 API 서버를 담당했다는 서술은 추가하지 않았습니다. 과금되는 실제 API 실행이나 운영 서비스의 성공 여부까지 검증하지는 않았습니다.
- 어린왕자 B612의 기존 동료 평가 1위 표기는 코드로 증명할 수 없는 이력입니다. 이번 코드 검증의 확인 항목에는 포함하지 않습니다.

## C. 검증 결과

Chrome 154의 실제 렌더링을 CDP로 제어했습니다. 스크린샷과 DOM 치수 확인, 실제 브라우저 휠·터치·키보드 입력을 사용했습니다. 패키지 설치나 프로젝트 테스트 의존성 추가 없이 점검했습니다.

| 화면 | 결과 |
| --- | --- |
| 1440×900 | 가로 넘침 없음. WORK 표지·실제 프로젝트·3열 기술 카드·PLAY 패널 표시 확인. CONTACT 제목·이메일·GitHub가 화면 안에 함께 표시 |
| 1366×768 | 가로 넘침 없음. 프로젝트 기술 그룹은 본문 스크롤로 읽을 수 있고 CONTACT 주요 정보가 함께 표시 |
| 1024×768 | 가로 넘침 없음. PC 직무 안내가 단계 바와 겹치지 않음. 첫 프로젝트 직접 이동의 최종 위치가 내비 아래 66px에 정렬 |
| 820×1180 | 기술 카드 2열 확인. 팀 구분·기술 정보와 PC/모바일 미리보기 전환 표시 |
| 390×844 | 기술 카드 1열. 담당 영역·BUILT WITH 노출. 이미지 및 소개글 스와이프와 역방향 이동, 모바일 영상 전환 확인 |
| 320×780 및 320×900 | 목차 전 메뉴 노출. 한글 자기소개 제목 잘림 수정 확인. 프로젝트 번호 탐색·팀 구분·기술 정보 노출 |

공통 확인 결과:

- 여섯 프로젝트를 번호로 이동하고, 첫 프로젝트 직접 CTA 및 기존 WORK 표지 진입을 확인했습니다.
- 좌우 스와이프는 이미지와 소개글에서 동작하고, 세로 스크롤을 유지합니다. 전환 버튼은 프로젝트 스와이프 입력에서 제외됩니다.
- PLAY: 패널 끝에 도달한 연속 휠은 현재 섹션에 머무름. 멈췄다가 새 휠 입력 시 CONTACT 이동. 반대 방향은 내부 읽기를 이어감.
- 키보드: 방향키를 누르고 있는 동안 패널을 읽은 입력이 바로 다음 섹션으로 이어지지 않음. 키를 놓고 새로 누르면 다음 섹션 이동.
- 터치: 같은 드래그로 내부 패널을 읽은 뒤 끝에 도달해도 섹션 유지. 새 드래그부터 다음 섹션 이동.
- 이메일 복사는 브라우저 Clipboard API의 성공·거부 결과를 각각 주입해 이벤트 처리와 피드백을 확인했습니다. 거부 시 실제 이메일 주소를 선택해 복사하도록 안내합니다.
- 모션 감소 환경의 PC·모바일 프로젝트 이동, 정지된 이동 화살표, 영상 자동 재생 중지 확인.
- PC 성장 장면 01→05와 모바일 ‘유진 키우기 시작’ 후 다음 장면 진입 확인.
- 브라우저 JavaScript 예외와 프로젝트 미디어 HTTP 오류는 발생하지 않았습니다.
- `npm.cmd run build`: TypeScript 검사와 Vite 빌드 통과.
- `npm.cmd run lint`: 오류 없음. 기존 `useHeroAnimations.ts`의 의존성 경고 3개만 남음.
- `git diff --check`: 공백 오류 없음.

### 초기 미디어 요청 전후

같은 로컬 개발 서버, 캐시 비활성 Chrome, 처음 열린 화면에서 6초 후 비교했습니다. 이미지·미디어 응답의 `Network.loadingFinished.encodedDataLength` 합계를 사용했습니다. JS/CSS/폰트는 제외하며, 측정 시점에 완료되지 않은 영상 응답은 이 수치에 전부 포함되지 않습니다. 최종 배포 네트워크 전체 사용량이나 모든 영상의 파일 크기 합계와는 다른 측정입니다.

| 화면 | 변경 전 | 변경 후 | 감소 |
| --- | --- | --- | --- |
| 모바일 390px / 320px | 8,737,482 bytes, 약 8.74MB | 1,344,388 bytes, 약 1.34MB | 84.6% |
| PC 1440px / 태블릿 820px | 11,055,070 bytes, 약 11.06MB | 3,661,976 bytes, 약 3.66MB | 66.9% |

변경 후 첫 진입에서는 프로젝트 이미지·영상 요청이 0건입니다. WORK에 접근하면 현재와 다음 PC 미리보기를 준비하고, 다른 프로젝트는 선택 시 요청합니다. PC에서 보이는 현재 휴대폰 미리보기와 모바일에서 선택한 영상만 활성화하며, 비활성 영상은 정지합니다. 기존 성장 연출의 이미지 사전 준비는 유지했습니다.

## D. 추가 확인 사항 및 점검 자료

- 실제 팀원별 담당 범위의 최종 확인은 작성자의 설명 또는 기여 이력이 필요합니다. 이번 작업은 기존 담당 범위를 확대하지 않았습니다.
- PLAY 세 게임의 원본 소스를 제공하면 기존 React/TypeScript/useReducer/Canvas 설명도 구현과 대조할 수 있습니다.
- 반응형·입력 검증은 Chrome의 터치 에뮬레이션을 포함합니다. 실제 iPhone Safari/Android 기기의 손가락 감도·관성은 실기기 확인이 필요합니다.
- Lighthouse 점수나 운영 배포의 전송량으로 결과를 일반화하지 않았습니다.
- 기존 매거진 테마, 프로젝트 링크·순서, 성장 연출을 유지한 로컬 변경입니다.

스크린샷과 점검 로그는 임시 폴더 `C:/Users/Lee YJ/AppData/Local/Temp/portfolio-review-20261011/`에 보관했습니다. `baseline.json`, `verification.json`, `interactions.json`, `touch.json`에 측정과 입력 결과가 있고, `baseline-*`, `after-*`, `reduced-*` PNG에 화면이 있습니다.
