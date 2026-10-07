// Add files at these paths and restart Vite/build; absent assets never request broken URLs.
const assets = import.meta.glob('/public/selected-work/{work,media,audio}/*', { eager: true, query: '?url', import: 'default' });
const asset = (path) => assets[`/public/selected-work${path}`] || null;
const media = (slug, kind, extensions) => extensions.flatMap(extension =>
  ['work', 'media'].map(folder => asset(`/${folder}/${slug}-${kind}.${extension}`))
).find(Boolean) || null;
const entries = [
  {
    slug: 'moonlight', group: 'personal', category: 'COMMERCE EXPERIENCE',
    title: ['Moonlight', 'Bookstore'], koTitle: '달빛서점', theme: 'moonlight',
    description: '책을 발견하고, 주문하기까지.',
    mobileDescription: '도서 탐색부터 주문까지 이어지는 온라인 서점입니다.',
    focus: '상품 탐색부터 장바구니·주문까지 이어지는 북스토어를 구현했습니다.',
    tech: ['React 19', 'JavaScript', 'Vite 8', 'React Router', 'Zustand', 'Firebase Authentication', 'Cloud Firestore', 'Firebase Storage', 'SCSS Modules', 'Vercel'],
    tags: ['Product', 'Search', 'Cart', 'Order', 'Admin'],
    existingPc: '/media/moonlight-pc.webp',
  },
  {
    slug: 'daily', group: 'personal', category: 'UI SYSTEM',
    title: ['Daily', 'Harvest'], koTitle: '데일리 하비스트', theme: 'harvest',
    description: '내 방식으로 읽는 대시보드.',
    mobileDescription: '사용자가 보기 방식을 설정하는 대시보드입니다.',
    focus: '테마·밀도·글자 크기·모션 설정을 화면 전체에 일관되게 연결했습니다.',
    tech: ['React 19', 'JavaScript', 'Vite 8', 'React Router', 'Chart.js', 'react-chartjs-2', 'GSAP', 'Sass / SCSS', 'localStorage', 'react-helmet-async'],
    tags: ['Dark Mode', 'Compact', 'Font Scale', 'Reduce Motion', 'Responsive'],
    existingPc: '/media/harvest-pc.webp',
  },
  {
    slug: 'b612', group: 'personal', category: 'INTERACTION',
    title: ['The Little', 'Prince B612'], koTitle: '어린왕자 B612', theme: 'b612',
    description: '방명록을 하나의 작은 우주로.',
    mobileDescription: '어린왕자 세계관을 담은 탐험형 방명록입니다.',
    focus: 'Firebase 방명록에 Canvas 별가루와 탐험형 인터랙션을 더했습니다.',
    tech: ['React 19', 'JavaScript', 'Vite', 'React Router', 'Zustand', 'Firebase Authentication', 'Cloud Firestore', 'Framer Motion', 'Canvas API', 'SCSS Modules', 'Vercel'],
    tags: ['Auth', 'Guestbook', 'Firestore Pagination', 'Canvas Particles', 'Motion UI'],
    meta: 'CLASS PROJECT · PEER VOTE 1ST', existingPc: '/media/b612-pc.webp',
  },
  {
    slug: 'forlog', group: 'team', category: 'DATA LOGIC',
    title: ['Forlog'], koTitle: '포로그', theme: 'forlog',
    description: '취향에서 구매로 이어지는 흐름.',
    mobileDescription: '취향에 맞는 상품을 찾고 구매하는 쇼핑몰입니다.',
    focus: '상품 필터·취향 테스트·장바구니를 구현하고 LocalStorage로 상태를 연결했습니다.',
    tech: ['HTML5', 'CSS3', 'JavaScript ES6', 'JSON', 'LocalStorage API', 'Git / GitHub'],
    tags: ['Filtering', 'Preference Matching', 'Cart CRUD', 'Order Simulation'],
    meta: 'BEFORE REACT', chapter: 'CHAPTER 02 · TEAM PROJECTS',
  },
  {
    slug: 'midnight', group: 'team', category: 'MEDIA CONTENT',
    title: ['Midnight', 'Chord'], koTitle: '미드나잇 코드', theme: 'midnight',
    description: '듣는 경험, 콘텐츠까지 직접.',
    mobileDescription: '팟캐스트를 탐색하고 듣는 콘텐츠 서비스입니다.',
    focus: '팟캐스트 탐색·재생 UI를 구현하고, 대본·TTS·BGM을 제작했습니다.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'JSON', 'Git / GitHub'],
    tags: ['Content Structure', 'Pagination', 'Playback UI', 'TTS', 'BGM'],
    meta: 'SHORT SPRINT',
    special: { type: 'audio-turntable', audioSrc: asset('/audio/midnight-sample.mp3') },
  },
  {
    slug: 'jajak', group: 'team', category: 'SERVICE INTEGRATION',
    title: ['JAJAK'], koTitle: '자작', theme: 'jajak',
    description: '장바구니에서 주문·관리까지.',
    mobileDescription: '주문과 관리를 연결한 온라인 쇼핑 서비스입니다.',
    mobileFocus: '최신 가격·재고를 검증하고 주문을 마이페이지·관리자 화면에 연결했습니다.',
    focus: 'Firestore 최신 상품의 가격·재고·판매 상태를 검증하고, 주문을 MyPage·Admin에 연결했습니다.',
    tech: ['React 19', 'JavaScript', 'Vite 8', 'React Router', 'SCSS Modules', 'Firebase Authentication', 'Cloud Firestore', 'localStorage', 'Chart.js', 'react-chartjs-2', 'Git / GitHub'],
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
  focusLabel: project.group === 'team' ? 'MY CONTRIBUTION' : 'MY FOCUS',
  layout: index % 2 === 0 ? 'visual-left' : 'visual-right',
  pcSrc: media(project.slug, 'pc', ['webp', 'png', 'jpg', 'jpeg']) || asset(project.existingPc) || null,
  mobileSrc: media(project.slug, 'mobile', ['webm', 'mp4', 'gif', 'webp', 'png', 'jpg']),
  live: null,
  github: null,
}));
