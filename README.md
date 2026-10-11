# YOOJIN — Frontend Developer Portfolio

> **성장 과정은 게임처럼, 프로젝트는 매거진처럼.**  
> 프론트엔드 개발자 이유진의 경험과 작업을 소개하는 인터랙티브 포트폴리오입니다.

개발자가 되기까지의 성장 기록을 **5단계 레벨업 인트로**로 표현하고, 직접 선정한 **6개 프로젝트를 6가지 개발 역량**에 연결했습니다. 화면 구성과 사용 기술뿐 아니라 각 프로젝트에서 무엇을 구현했는지, 팀 프로젝트에서는 어떤 부분을 맡았는지 전달하는 데 초점을 맞췄습니다.

이 저장소는 **포트폴리오 웹사이트 자체의 소스코드**입니다. WORK와 PLAY에 소개된 개별 프로젝트의 코드는 각 프로젝트의 GitHub 링크를 참고해 주세요.

## 목차

1. [사이트 구성](#사이트-구성)
2. [대표 프로젝트 — WORK](#대표-프로젝트--work)
3. [인터랙티브 실험 — PLAY](#인터랙티브-실험--play)
4. [포트폴리오 구현 기술](#포트폴리오-구현-기술)
5. [실행 방법](#실행-방법)
6. [프로젝트 구조](#프로젝트-구조)
7. [개발 및 AI 협업 과정](#개발-및-ai-협업-과정)
8. [유지·보수와 검증](#유지보수와-검증)

## 사이트 구성

| 섹션 | 내용 | 주요 특징 |
| --- | --- | --- |
| **INTRO** | 개발자로 성장한 과정 | R → R+ → SR → SR+ → SSR, 5개 진화 장면, 최종 단계 건너뛰기 |
| **ABOUT** | 개발자로 이어진 경험과 작업 방식 | 자기소개, Transcreation, 배경 및 경험, 장면 이동 |
| **WORK** | 프로젝트 6개 | 매거진 표지 `MY WORK.`, 프로젝트별 지면, 구현 기능·사용 기술·담당 역할 |
| **TOOLKIT** | 프로젝트에 적용한 기술 | React 화면·설정, Firebase 데이터·주문, Canvas·인터랙션 |
| **PLAY** | 게임·개발 실험 4개 | 작품 선택형 갤러리, 구현 설명, 외부 플레이 링크 |
| **CONTACT** | 연락처 | 이메일, GitHub 등 연락 수단 |

### 인터랙션과 정보 설계

- **성장 인트로:** PC에서 5단계 연출을 순서대로 볼 수 있으며, `최종 단계로`를 선택하면 중간 단계를 건너뛰고 **LV.05 / SSR**로 이동합니다. 이는 WORK로 바로 가는 버튼과 다릅니다.
- **WORK 진입:** 인트로의 `VIEW WORK`는 **WORK 표지**를 먼저 보여줍니다. 표지의 `첫 프로젝트 보기`나 스크롤을 통해 01번 작품으로 들어갈 수 있습니다.
- **WORK INDEX:** 여섯 영문 카테고리는 단순한 프로젝트명이 아닌 **프로젝트 선정 관점**입니다. PC에서는 마우스 오버 및 키보드 포커스 시 한글 설명이 나타나며 모바일에서는 해당 보조 라벨이 표시되지 않습니다.
- **WORK 상세:** PC에서 프로젝트 비주얼과 설명을 병렬로 읽는 매거진 구성, 프로젝트별 테마 색상, 홈페이지·GitHub 링크를 사용합니다.
- **모바일:** 모바일 전용 인트로를 통해 최종 개발자 모습과 주요 작업으로의 진입 동선을 먼저 제공합니다.
- **로고:** `YJ / YOOJIN` 원본 시안에서 추출한 투명 PNG를 사용하며, 밝은 헤더와 갈색 WORK 헤더에 각각 대응하는 색상 버전을 표시합니다.

## 대표 프로젝트 — WORK

**개인 프로젝트 01–03 / 팀 프로젝트 04–06**으로 구분했습니다. 아래의 영문 분류는 프로젝트의 성격과 선정 이유를 보여주는 기준이므로, 실제 프로젝트명을 대신하는 일반 메뉴로 변경하지 않습니다.

| 번호 | 선정 카테고리 | 프로젝트 | 구분 | 주요 구현·참여 내용 |
| --- | --- | --- | --- | --- |
| **01** | COMMERCE EXPERIENCE | **달빛서점** (Moonlight Bookstore) | 개인 | 도서 탐색, 장바구니·찜 상태 공유, 인증·주문 및 관리자 상품 관리 |
| **02** | UI SYSTEM | **데일리 하비스트** (Daily Harvest) | 개인 | 테마·화면 밀도·글자 크기·모션 설정, 차트와 사용자 설정 보존 |
| **03** | INTERACTION | **어린왕자 B612** (The Little Prince B612) | 개인 | 세계관 탐색, Firebase 방명록, Canvas 입자 효과와 화면 전환 |
| **04** | DATA LOGIC | **포로그** (Forlog) | 팀 | 상품 필터·취향 테스트·장바구니 상태 및 데이터 처리 |
| **05** | MEDIA CONTENT | **미드나잇 코드** (Midnight Chord) | 팀 | 팟캐스트 탐색·재생 UI, 대본·TTS·BGM 콘텐츠 제작 |
| **06** | SERVICE INTEGRATION | **자작** (JAJAK) | 팀 | 장바구니 데이터를 최신 Firestore 상품과 대조해 주문·마이페이지·관리자 흐름 연동 |

각 지면에서는 `구현한 기능 / MY FOCUS` 또는 `담당한 부분 / MY CONTRIBUTION`과 `BUILT WITH`를 구분했습니다. **팀 프로젝트의 기술 목록은 팀 프로젝트 전체에 사용된 기술을 포함할 수 있으므로, 개인의 작업 범위는 `MY CONTRIBUTION`을 기준으로 확인해 주세요.**

실행 화면과 소스코드 링크는 각 프로젝트 지면의 **홈페이지 / GitHub**에서 확인할 수 있습니다.

### WORK에 표시하는 기술 예시

- **React 중심 화면 개발:** React / Vite, React Router, Zustand, JavaScript, SCSS / SCSS Modules
- **데이터·서비스:** Firebase Authentication / Firestore / Storage, localStorage, Fetch API
- **차트·인터랙션:** Chart.js / react-chartjs-2, GSAP, Framer Motion, Canvas API, Swiper
- **팀 협업 결과물:** 프로젝트에 따라 HTML / CSS / JavaScript, 오디오 재생 UI, Firebase Functions / OpenAI API 등 사용

> 위 기술은 **WORK에 소개한 개별 프로젝트들의 기술**을 합친 목록입니다. 이 포트폴리오 사이트 자체의 의존성과는 구분됩니다.

## 인터랙티브 실험 — PLAY

포트폴리오 본편과 별도로, 직접 기획·제작한 게임과 인터랙션 실험을 한 페이지에서 탐색할 수 있도록 구성했습니다.

| 작품 | 형식 | 구현 관점 |
| --- | --- | --- |
| **LAST ORDER** | 포인트 앤 클릭 방탈출 | React / TypeScript, 아이템·진행 조건·인벤토리 상태 |
| **SUBWAY** | 분기형 생존 TRPG | React, `useReducer`, D20 판정과 상태 분기 |
| **NO SIGNAL** | 서사형 탐사 데모 | React / TypeScript, D100 판정, 시나리오 데이터와 Canvas 효과 |
| **NEON BREAK** | 레트로 벽돌깨기 | Vanilla JavaScript, Canvas 충돌 처리, Web Audio API |

작품 카드를 선택하면 게임 설명과 주요 구현 내용이 표시되며, `게임 플레이하기`를 통해 외부 배포 사이트로 이동합니다. **게임 전체 소스가 모두 이 저장소에 포함된 것은 아닙니다.**

## 포트폴리오 구현 기술

이 사이트의 `package.json` 및 실제 컴포넌트를 기준으로 작성했습니다.

| 구분 | 기술 | 사용 용도 |
| --- | --- | --- |
| UI | React, TypeScript | 포트폴리오 섹션, 장면·상태 관리, 컴포넌트 작성 |
| 개발 환경 | Vite | 개발 서버, 소스 번들링 |
| 모션 | GSAP, ScrollTrigger, ScrollToPlugin | 진화 장면, 스크롤 이동, WORK 지면 전환 및 화면 모션 |
| 스타일 | CSS, 반응형 미디어 쿼리 | 매거진 레이아웃, 프로젝트별 테마, 모바일 화면 |
| 품질 확인 | TypeScript, Oxlint | 타입 검사, 린트 명령 |
| 이미지 | WebP, PNG, SVG | 캐릭터·프로젝트 비주얼, YJ 로고·파비콘 |

사용자 모션 감소 환경인 `prefers-reduced-motion`을 고려하는 부분이 있으며, 일부 미디어는 현재 프로젝트와 인접한 프로젝트 중심으로 요청하도록 제어합니다. 다만 실제 기기별 체감 성능이나 네트워크 전송량은 별도 측정이 필요합니다.

## 실행 방법

```bash
npm ci
npm run dev
```

개발 서버 실행 후 터미널에 표시되는 로컬 주소로 접속합니다. `package-lock.json`이 포함되어 있으므로 의존성 설치에는 `npm ci`를 권장합니다.

```bash
npm run build    # TypeScript 검사 후 Vite 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # Oxlint 실행
```

실행·배포 전에는 설치된 Node.js 및 npm 환경이 프로젝트의 Vite 요구사항을 충족하는지 확인해 주세요. 배포 시에는 **새로 생성한 `dist/`**를 사용해야 하며, 과거 버전의 빌드 폴더를 재사용하지 않습니다.

## 프로젝트 구조

```text
.
├── public/
│   ├── assets/                 # 인트로 캐릭터·PLAY 이미지
│   ├── brand/                  # YJ/YOOJIN 투명 PNG 로고
│   ├── selected-work/media/    # WORK 이미지·영상
│   └── games/                  # 일부 정적 게임 리소스
├── src/
│   ├── App.tsx                 # 인트로와 챕터 조합
│   ├── brand-png.css          # PNG 로고 표시 스타일
│   ├── components/
│   │   ├── YoojinHero/        # 5단계 성장 인트로·모바일 인트로
│   │   ├── PortfolioChapters/ # ABOUT·TOOLKIT·CONTACT 및 챕터 내비
│   │   ├── SelectedWorkMagazine/
│   │   │   ├── workProjects.js # WORK 6개 프로젝트 데이터·링크
│   │   │   ├── WorkIndex.jsx   # 영문 역량 분류·PC 한글 툴팁
│   │   │   └── ...             # WORK 표지·지면·미리보기
│   │   └── PlayGallery/       # PLAY 4개 작품 데이터·갤러리
│   └── portfolio.content.css  # 섹션 보완 스타일
├── CHANGELOG.md               # 수정 내역·설계 결정 기록
├── README.md                   # 이 문서
└── package.json
```

유지·보수 시에는 다음 파일을 우선 확인하면 됩니다.

- WORK 내용과 링크: `src/components/SelectedWorkMagazine/workProjects.js`
- WORK 영문 카테고리의 한글 설명: `src/components/SelectedWorkMagazine/WorkIndex.jsx`
- INTRO 단계 정보: `src/components/YoojinHero/growthData.ts`, `heroScenes.ts`
- PLAY 콘텐츠: `src/components/PlayGallery/PlayGallery.jsx`
- 챕터 이름·TOOLKIT 설명: `src/components/PortfolioChapters/chapterData.ts`
- 로고 이미지: `public/brand/`, 크기: `src/brand-png.css`

> `chapterData.ts`에도 이전 단계의 `works` 배열이 남아 있습니다. **현재 WORK 매거진에 표시되는 여섯 프로젝트의 기준 데이터는 `workProjects.js`**이므로 수정할 때 혼동하지 않도록 주의해 주세요.

## 개발 및 AI 협업 과정

AI 도구를 **기획과 구현을 보조하는 협업 수단**으로 활용했습니다. 특히 디자인 시안과 코드 수정안을 검토하고, 실제 화면에서 발생한 문제를 확인한 후 요구사항을 다시 정의하는 과정을 반복했습니다.

- **기획:** 성장형 인트로, 6개 역량 중심의 WORK INDEX, 매거진형 상세 지면 등 표현 의도와 정보 우선순위 설정
- **구현 검토:** React 컴포넌트, GSAP 스크롤·전환 로직, 반응형 레이아웃 등의 구현·수정 방향 검토
- **시각 제작:** 캐릭터 일러스트와 브랜드 로고 등의 AI 생성 이미지 활용 및 웹 에셋 적용
- **검수·수정:** 실제 브라우저 화면에서 겹침·글자 잘림·정보 중복·이동 동선을 확인하고 반복 수정

**AI를 활용했다는 사실과 실제 수행한 작업을 구분해 설명하는 것**을 원칙으로 합니다. 이 저장소의 WORK·PLAY에 소개된 개별 프로젝트까지 모두 동일한 기술이나 개발 과정을 사용한 것은 아닙니다.

## 유지·보수와 검증

현재 문서는 **v9 소스 기준**입니다. 프로젝트 기능과 디자인의 변경 과정은 [CHANGELOG.md](./CHANGELOG.md)에 정리했습니다.

- 섹션별 UI·스크롤과 주요 동선은 실제 브라우저에서 최종 확인이 필요합니다.
- 권장 확인 폭: PC **1440 / 1366 / 1024px**, 태블릿 **820px**, 모바일 **390 / 320px**.
- 주의 깊게 볼 항목: 낮은 화면 높이에서 WORK 설명과 링크, 모바일 헤더, CONTACT 가독성, PLAY 상세 내부 스크롤, 미디어 초기 로딩.
- 최신 소스의 **전체 빌드·린트·배포 사이트 검증을 완료했다는 기록은 없습니다.** 실행 전에 `npm run build`와 `npm run lint`, 브라우저 확인을 진행해 주세요.

### 참고

이 포트폴리오는 시각적 연출과 정보 전달의 균형을 개선하며 작업 중인 프로젝트입니다. 변경 이력 문서에는 **현재 반영된 사항과 실험 후 롤백한 사항을 분리**해 두었습니다.
