# 모바일 인트로 v10 수정 내역

## 수정 범위
- 첫 모바일 진입 화면 전용 디자인 (`MobileHeroIntro.tsx`, `MobileHeroIntro.css`)
- 모바일 공통 메뉴 (`MobileMenu.tsx`, `MobileMenu.css`)
- 성장 화면과 본문 헤더의 모바일 메뉴 연결 (`YoojinHero.tsx`, `PortfolioChapters.tsx`, `YoojinHero.mobile.css`, `brand-png.css`)

## 핵심 설계
1. 인트로 이미지는 기존 최종 캐릭터 그림을 그대로 사용합니다.
2. 한글 직무/이름을 대표 타이포로 배치하며 외곽선 타이포는 사용하지 않습니다.
3. 하단 콘텐츠는 이미지 위의 그라데이션 영역에 통합해 UI가 차지하는 높이를 줄입니다.
4. 두 버튼의 동작은 유지합니다: 대표 작업 보기→WORK **표지**, 5단계 성장 보기→원래 성장 과정 LV.01.
5. 모바일 햄버거 메뉴에서 ABOUT, WORK, TOOLKIT, PLAY, CONTACT로 이동합니다.
6. PC의 타이포그래피·헤더·WORK 매거진 구조는 변경하지 않습니다.

## 검증
- 모바일 정적 화면 390×844, 360×640, 320×700 레이아웃 확인
- TypeScript 문법 검사 및 CSS 파싱 검사
- **미검증:** 실제 React 개발 서버에서 햄버거 메뉴 조작 및 전체 빌드 (npm 설치 오류)

## 실행
프로젝트 루트에서 `npm ci` → `npm run dev`
