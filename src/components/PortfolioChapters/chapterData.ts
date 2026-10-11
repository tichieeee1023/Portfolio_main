/** 섹션 데이터. 문구/링크만 바꿀 때는 이 파일만 열면 된다. */

export const chapters = [
  { id: 'about', label: 'ABOUT', ko: '소개' },
  { id: 'projects', label: 'WORK', ko: '대표 작업' },
  { id: 'skills', label: 'TOOLKIT', ko: '기술' },
  { id: 'experiments', label: 'PLAY', ko: '실험' },
  { id: 'contact', label: 'CONTACT', ko: '연락' },
];

export const works = [
  {
    id: 'moonlight',
    title: 'Moonlight Bookstore',
    ko: '달빛서점',
    category: 'COMMERCE / REACT',
    image: '/projects/moonlight-desktop.jpg',
    alt: '달빛서점 데스크톱 첫 화면',
    summary: '책 탐색에서 장바구니, 데모 주문과 관리자 화면까지 이어지는 온라인 서점.',
    point: '주문 생성과 재고 차감을 하나의 흐름으로 연결했습니다.',
    tags: ['React', 'Zustand', 'Firebase'],
    live: 'https://tichieeee1023.github.io/moonlight/',
    github: 'https://github.com/tichieeee1023/moon-light',
  },
  {
    id: 'harvest',
    title: 'Daily Harvest',
    ko: '데일리 하베스트',
    category: 'DASHBOARD / DATA',
    image: '/projects/harvest-desktop.jpg',
    alt: 'Daily Harvest 데스크톱 대시보드 화면',
    summary: '샘플 통계와 게시물, 화면 설정을 하나의 관리 화면으로 구성한 대시보드.',
    point: '설정을 저장하고 차트와 화면에 일관되게 반영했습니다.',
    tags: ['React', 'Chart.js', 'localStorage'],
    github: 'https://github.com/tichieeee1023/Daily_Harvest',
  },
  {
    id: 'postage',
    title: 'Postage Archive',
    ko: '풍경을 수집하는 우표 아카이브',
    category: 'INTERACTION / ARCHIVE',
    image: '/projects/postage-scene.png',
    alt: 'Postage Archive의 파리 풍경 화면',
    summary: '풍경의 한 부분을 우표로 모으고 엽서에 소인을 찍어 PNG로 남기는 웹.',
    point: '클릭한 위치의 풍경이 화면 크기가 바뀌어도 유지되도록 계산했습니다.',
    tags: ['React', '이미지 크롭', 'PNG 저장'],
    live: 'https://tichieeee1023.github.io/StampArchive/',
    github: 'https://github.com/tichieeee1023/StampArchive',
  },
  {
    id: 'b612',
    title: 'The Little Prince B612',
    ko: '어린왕자 방명록',
    category: 'STORY / GUESTBOOK',
    image: '/projects/b612-desktop.jpg',
    alt: '어린왕자 B612 데스크톱 첫 화면',
    summary: '이야기 지도를 탐색하고 캐릭터를 골라 글을 남기는 방명록.',
    point: '인증과 글 목록의 더보기를 이야기 경험 안에 연결했습니다.',
    tags: ['React', 'Zustand', 'Firebase'],
    live: 'https://the-little-prince-b612.vercel.app/',
    github: 'https://github.com/tichieeee1023/TheLittlePrince-B612',
  },
];

export const skillGroups = [
  {
    number: '01',
    title: 'React 화면과 사용자 설정',
    english: 'INTERFACE & UI SYSTEM',
    description: '컴포넌트와 상태를 연결해 사용자의 설정이 화면 전체에 반영되도록 구현했습니다.',
    applications: [
      { project: '데일리 하비스트', detail: '테마·글자 크기·화면 밀도를 설정하고 localStorage에 저장합니다. Chart.js 차트로 통계를 보여줍니다.' },
      { project: '달빛서점', detail: 'React Router로 화면을 나누고, Zustand로 장바구니와 찜 상태를 공유합니다.' },
    ],
    tools: ['React / Vite', 'React Router', 'Zustand', 'SCSS', 'Chart.js'],
    evidence: '데일리 하비스트 · 달빛서점',
    href: '#work-harvest',
  },
  {
    number: '02',
    title: 'Firebase 데이터와 주문 처리',
    english: 'DATA & SERVICE INTEGRATION',
    description: '브라우저에 저장한 상태와 서버의 최신 데이터를 연결하고, 인증·조회·저장 흐름을 다뤘습니다.',
    applications: [
      { project: '자작 · 담당 영역', detail: '장바구니의 상품 ID·수량을 최신 Firestore 상품과 결합하고, 가격·재고·판매 상태를 확인해 주문을 저장합니다.' },
      { project: '어린왕자 B612', detail: 'Firebase 인증과 방명록 저장을 연결하고, Firestore 커서로 글 목록의 더보기를 구현합니다.' },
    ],
    tools: ['JavaScript', 'Firebase: Auth / Firestore', 'localStorage', 'Fetch API'],
    evidence: '자작 · 어린왕자 B612',
    href: '#work-jajak',
  },
  {
    number: '03',
    title: 'Canvas와 화면 인터랙션',
    english: 'INTERACTION & MEDIA',
    description: '입력과 상태 변화에 맞춰 화면이 반응하도록 만들고, 모션 감소 설정과 작은 화면에서도 사용할 수 있게 조정합니다.',
    applications: [
      { project: '어린왕자 B612', detail: 'Framer Motion으로 화면 전환을 구성하고, Canvas로 별가루를 그립니다.' },
      { project: '이 포트폴리오 · 벽돌깨기', detail: 'GSAP으로 성장 장면과 지면을 전환합니다. 벽돌깨기는 Canvas 충돌 판정과 Web Audio 효과음을 구현한 실습입니다.' },
    ],
    tools: ['Framer Motion', 'GSAP', 'Canvas API', 'Web Audio API'],
    evidence: '어린왕자 B612',
    href: '#work-b612',
  },
];

export const aboutPagerLabels = ['INTRO', 'PROFILE', 'TRANSCREATION', 'BACKGROUND'];

/** 1 → '01' */
export const pad = (n: number) => String(n).padStart(2, '0');

export const TOTAL = pad(chapters.length);
export const WORK_TOTAL = pad(works.length);
export const SKILL_TOTAL = pad(skillGroups.length);
