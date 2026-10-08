/** 섹션 데이터. 문구/링크만 바꿀 때는 이 파일만 열면 된다. */

export const chapters = [
  { id: 'about', label: 'ABOUT', ko: '소개' },
  { id: 'projects', label: 'WORK', ko: '대표 작업' },
  { id: 'skills', label: 'TOOLKIT', ko: '기술' },
  { id: 'experiments', label: 'PLAY', ko: '실험' },
  { id: 'contact', label: 'HELLO', ko: '연락' },
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
    title: '읽기 쉬운 화면과 사용자 설정',
    english: 'INTERFACE & UI SYSTEM',
    description: '차트와 정보를 한눈에 읽고, 테마·글자 크기·화면 밀도 설정이 서비스 전반에 이어지도록 구성합니다.',
    tools: ['React 19', 'Chart.js', 'react-chartjs-2', 'Sass / SCSS', 'localStorage', 'react-helmet-async'],
    evidence: 'Daily Harvest · JAJAK',
    href: '#work-harvest',
  },
  {
    number: '02',
    title: '상품에서 주문까지 데이터 연결',
    english: 'DATA & SERVICE INTEGRATION',
    description: '상품 탐색과 장바구니를 주문으로 잇고, 최신 가격·재고를 확인해 주문 내역과 관리 화면에 반영합니다.',
    tools: ['JavaScript ES6', 'React Router', 'Zustand', 'Firebase Authentication', 'Cloud Firestore', 'localStorage', 'JSON'],
    evidence: 'Moonlight Bookstore · Forlog · JAJAK',
    href: '#work-moonlight',
  },
  {
    number: '03',
    title: '행동에 반응하는 인터랙션과 미디어',
    english: 'INTERACTION & MEDIA',
    description: '방명록의 별가루와 화면 전환, 대시보드 모션, 팟캐스트 탐색·재생 UI를 각 콘텐츠에 맞게 구현합니다.',
    tools: ['Framer Motion', 'GSAP', 'Canvas API', 'HTML5', 'CSS3', 'JavaScript', 'Vite', 'Git / GitHub'],
    evidence: 'The Little Prince B612 · Daily Harvest · Midnight Chord',
    href: '#work-b612',
  },
];

export const aboutPagerLabels = ['INTRO', 'PROFILE', 'TRANSCREATION', 'BACKGROUND'];

/** 1 → '01' */
export const pad = (n: number) => String(n).padStart(2, '0');

export const TOTAL = pad(chapters.length);
export const WORK_TOTAL = pad(works.length);
export const SKILL_TOTAL = pad(skillGroups.length);
