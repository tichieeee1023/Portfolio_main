// Static URLs map to files in public/selected-work/media; public assets are served from the site root.
const asset = (path) => path ? `/selected-work${path}` : null;
const MEDIA = {
  moonlight: { pc: '/media/moonlight-pc.webp', mobile: '/media/moonlight-mobile.webm' },
  daily: { pc: '/media/harvest-pc.webp', mobile: '/media/daily-mobile.mp4' },
  b612: { pc: '/media/b612-pc.webp', mobile: '/media/b612-mobile.webm' },
  forlog: { pc: '/media/forlog-pc.webp', mobile: '/media/forlog-mobile.webm' },
  midnight: { pc: '/media/midnight-pc.webp', mobile: '/media/midnight-mobile.webm' },
  jajak: { pc: '/media/jajak-pc.webp', mobile: '/media/jajak-mobile.webm' },
};
const media = (slug, kind) => asset(MEDIA[slug]?.[kind] || null);
const LINKS = {
  "moonlight": {
    "live": "https://moon-light-three.vercel.app/",
    "github": "https://github.com/tichieeee1023/moon-light"
  },
  "daily": {
    "live": "https://daily-harvest-psi.vercel.app/",
    "github": "https://github.com/tichieeee1023/Daily_Harvest"
  },
  "b612": {
    "live": "https://the-little-prince-b612.vercel.app/",
    "github": "https://github.com/tichieeee1023/TheLittlePrince-B612"
  },
  "forlog": {
    "live": "https://tae0419.github.io/forlog2/Home/index.html",
    "github": "https://github.com/TAE0419/forlog2"
  },
  "midnight": {
    "live": "https://tae0419.github.io/midnightChord/pages/opening/",
    "github": "https://github.com/TAE0419/midnightChord"
  },
  "jajak": {
    "live": "https://jajak-ten.vercel.app/cart",
    "github": "https://github.com/jiwoo1012/TeamProject2"
  }
};
const entries = [
  {
    slug: 'moonlight', group: 'personal', category: 'COMMERCE EXPERIENCE',
    title: ['Moonlight', 'Bookstore'], koTitle: '달빛서점', theme: 'moonlight',
    description: '도서 탐색부터 주문까지 이어지는 온라인 서점입니다.',
    mobileDescription: '도서 탐색부터 주문까지 이어지는 온라인 서점입니다.',
    focus: '상품 탐색부터 장바구니·주문까지 이어지는 북스토어를 구현했습니다.',
    techGroups: [
      { label: '화면 · 상태', items: ['React / Vite', 'JavaScript', 'React Router', 'Zustand'] },
      { label: '인증 · 데이터', items: ['Firebase: Auth / Firestore / Storage'] },
      { label: '스타일 · 효과', items: ['SCSS Modules', 'canvas-confetti'] },
    ],
    tags: ['Product', 'Search', 'Cart', 'Order', 'Admin'],
    existingPc: '/media/moonlight-pc.webp',
  },
  {
    slug: 'daily', group: 'personal', category: 'UI SYSTEM',
    title: ['Daily', 'Harvest'], koTitle: '데일리 하비스트', theme: 'harvest',
    description: '차트와 화면 설정을 한곳에 모은 대시보드입니다.',
    mobileDescription: '사용자가 보기 방식을 설정하는 대시보드입니다.',
    focus: '테마·밀도·글자 크기·모션 설정을 화면 전체에 일관되게 연결했습니다.',
    techGroups: [
      { label: '화면 · 구조', items: ['React / Vite', 'JavaScript', 'React Router'] },
      { label: '차트 · 설정', items: ['Chart.js / react-chartjs-2', 'localStorage'] },
      { label: '스타일 · 효과', items: ['SCSS', 'GSAP'] },
      { label: '문서 정보', items: ['react-helmet-async'] },
    ],
    tags: ['Dark Mode', 'Compact', 'Font Scale', 'Reduce Motion', 'Responsive'],
    existingPc: '/media/harvest-pc.webp',
  },
  {
    slug: 'b612', group: 'personal', category: 'INTERACTION',
    title: ['The Little', 'Prince B612'], koTitle: '어린왕자 B612', theme: 'b612',
    description: '이야기 지도를 탐색하고 글을 남기는 방명록입니다.',
    mobileDescription: '어린왕자 세계관을 담은 탐험형 방명록입니다.',
    focus: 'Firebase 방명록에 Canvas 별가루와 탐험형 인터랙션을 더했습니다.',
    techGroups: [
      { label: '화면 · 상태', items: ['React / Vite', 'JavaScript', 'React Router', 'Zustand'] },
      { label: '인증 · 방명록', items: ['Firebase: Auth / Firestore'] },
      { label: '인터랙션', items: ['Framer Motion', 'Canvas API', 'SCSS Modules'] },
    ],
    tags: ['Auth', 'Guestbook', 'Firestore Pagination', 'Canvas Particles', 'Motion UI'],
    meta: 'CLASS PROJECT · PEER VOTE 1ST', existingPc: '/media/b612-pc.webp',
  },
  {
    slug: 'forlog', group: 'team', category: 'DATA LOGIC',
    title: ['Forlog'], koTitle: '포로그', theme: 'forlog',
    description: '취향에 맞는 상품을 탐색하는 팀 쇼핑몰 프로젝트입니다.',
    mobileDescription: '취향에 맞는 상품을 찾고 구매하는 쇼핑몰입니다.',
    focus: '상품 필터·취향 테스트·장바구니를 구현하고 LocalStorage로 상태를 연결했습니다.',
    techGroups: [
      { label: '화면 · 로직', items: ['JavaScript', 'HTML / CSS'] },
      { label: '상품 · 저장', items: ['JSON / Fetch API', 'localStorage'] },
      { label: '슬라이더', items: ['Swiper'] },
    ],
    tags: ['Filtering', 'Preference Matching', 'Cart CRUD', 'Order Simulation'],
    meta: 'JavaScript 기반 팀 프로젝트', chapter: '04—06 / 팀 프로젝트',
  },
  {
    slug: 'midnight', group: 'team', category: 'MEDIA CONTENT',
    title: ['Midnight', 'Chord'], koTitle: '미드나잇 코드', theme: 'midnight',
    description: '팟캐스트 탐색과 재생을 연결한 팀 콘텐츠 서비스입니다.',
    mobileDescription: '팟캐스트를 탐색하고 듣는 콘텐츠 서비스입니다.',
    focus: '팟캐스트 탐색·재생 UI를 구현하고, 대본·TTS·BGM을 제작했습니다.',
    techGroups: [
      { label: '화면 · 로직', items: ['JavaScript', 'HTML / CSS'] },
      { label: '콘텐츠 · 재생', items: ['JSON', 'HTML Audio', 'localStorage'] },
      { label: '공통 화면 연출', items: ['GSAP'] },
    ],
    tags: ['Content Structure', 'Pagination', 'Playback UI', 'TTS', 'BGM'],
    meta: '단기 협업 · 팟캐스트 UI와 콘텐츠 제작',
    special: { type: 'turntable-visualizer' },
  },
  {
    slug: 'jajak', group: 'team', category: 'SERVICE INTEGRATION',
    title: ['JAJAK'], koTitle: '자작', theme: 'jajak',
    description: '전통주 추천부터 주문·관리까지 연결한 팀 쇼핑몰입니다.',
    mobileDescription: '주문과 관리를 연결한 온라인 쇼핑 서비스입니다.',
    mobileFocus: '최신 가격·재고를 검증하고 주문을 마이페이지·관리자 화면에 연결했습니다.',
    focus: 'Firestore 최신 상품의 가격·재고·판매 상태를 검증하고, 주문을 MyPage·Admin에 연결했습니다.',
    techGroups: [
      { label: '화면 · 구조', items: ['React / Vite', 'JavaScript', 'React Router'] },
      { label: '인증 · 주문', items: ['Firebase: Auth / Firestore', 'localStorage'] },
      { label: '공통 UI · 차트', items: ['SCSS Modules', 'Chart.js / react-chartjs-2', 'GSAP'] },
      { label: '팀 공통 서비스', items: ['Firebase Functions / OpenAI API'] },
    ],
    tags: ['Cart Data', 'Checkout', 'Order', 'Live Data Integration', 'MyPage', 'Admin', 'Responsive UI'],
    meta: 'Mock Data → Live Data Integration',
    dataFlow: 'localStorage Cart → Firestore 최신 상품 → 가격·재고·판매 상태 검증 → Checkout → Order 저장 → MyPage / Admin',
    dataNote: 'Cart는 { productId, quantity }만 저장하고 최신 상품 데이터와 결합합니다.',
  },
];

export const PROJECTS = entries.map((project, index) => ({
  ...project,
  id: String(index + 1).padStart(2, '0'),
  indexLabel: project.category,
  focusLabel: project.group === 'team' ? '담당한 부분 / MY CONTRIBUTION' : '구현한 기능 / MY FOCUS',
  tech: project.techGroups.flatMap(group => group.items),
  layout: index % 2 === 0 ? 'visual-left' : 'visual-right',
  pcSrc: media(project.slug, 'pc', ['webp', 'png', 'jpg', 'jpeg']) || asset(project.existingPc) || null,
  mobileSrc: media(project.slug, 'mobile', ['webm', 'mp4', 'gif', 'webp', 'png', 'jpg']),
  live: LINKS[project.slug]?.live || null,
  github: LINKS[project.slug]?.github || null,
}));
