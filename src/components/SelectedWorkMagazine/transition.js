/**
 * Selected Work 전환 엔진 (Eminente 레이아웃 × Akaru 전환)
 *
 * 전환 전체를 "진행도 p (0 → 1)의 순수 함수"로 그린다.
 *  - GSAP은 숫자 p만 트윈한다. 실제 DOM 값은 모두 paintTransition(p)이 계산한다.
 *  - 그래서 "이전 프로젝트로" 돌아가기는 p를 1 → 0 으로 돌리면 정확히 역재생된다.
 *  - 나중에 휠 스크럽(휠 양 = p)으로 바꾸고 싶으면 paintTransition만 그대로 쓰면 된다.
 *
 * A = 떠나는 쪽(먼저 보이는 프로젝트), B = 들어오는 쪽(다음 프로젝트)
 *
 *   p 0 ─────────── 0.44 ── 0.52 ──────────────── 1
 *     [ 확장 ]        [홀드]    [ 슬라이드 + 다음 등장 ]
 *
 *  확장   : A 비주얼이 60% → 100%로 가로 확장(object-fit: cover 라서 이미지가 같이 커진다).
 *           에디토리얼은 밀려나며 fade, 모바일은 scale + y.
 *  홀드   : 거의 100vw 풀블리드 한 박자.
 *  슬라이드: A 비주얼이 왼쪽으로 빠지고, B(반대 방향 레이아웃)가 오른쪽에서 이어서 들어온다.
 *           B의 이미지는 살짝 확대돼 있다가 안착, 제목/문장/모바일은 뒤따라 등장.
 */

export const REST_VISUAL = 60; // 정지 상태에서 비주얼이 차지하는 폭(%) — 나머지 40%가 잡지 지면 (CSS --visual-w와 같은 값)
export const TIMING = { expandEnd: 0.44, slideStart: 0.52 };
export const DURATION = 1.95; // 초 (전체 전환)
export const CHROME_SWITCH_AT = 0.56; // 헤더/푸터/테마가 다음 프로젝트로 바뀌는 시점

/* ---------- 작은 수학 도구 ---------- */
const clamp01 = (v) => Math.min(1, Math.max(0, v));
/** p가 a~b 구간에서 0~1로 진행되는 값 */
export const seg = (p, a, b) => clamp01((p - a) / (b - a));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* ---------- DOM 부품 ---------- */
export function getParts(layer) {
  return {
    layer,
    index: Number(layer.dataset.index),
    theme: layer.dataset.theme,
    // 비주얼이 왼쪽에 붙어 있는가, 오른쪽에 붙어 있는가
    side: layer.classList.contains('layout-visual-right') ? 'right' : 'left',
    visual: layer.querySelector('.js-visual'),
    media: layer.querySelector('.js-media'),
    phone: layer.querySelector('.js-phone'),
    editorial: layer.querySelector('.js-editorial'),
    titleLines: Array.from(layer.querySelectorAll('.js-title-line')),
    reveals: Array.from(layer.querySelectorAll('.js-reveal')),
  };
}

/** 전환 중에 건드린 inline style을 전부 걷어내 CSS 기본(정지) 상태로 되돌린다. */
export function resetParts(parts) {
  [parts.layer, parts.visual, parts.media, parts.phone, parts.editorial, ...parts.titleLines, ...parts.reveals]
    .forEach((el) => { if (el) el.style.cssText = ''; });
}

/**
 * 진행도 p에 맞춰 A, B 두 레이어를 그린다.
 * p = 0 → A가 정지 상태, B는 화면 오른쪽 밖
 * p = 1 → B가 정지 상태, A는 화면 왼쪽 밖
 */
export function paintTransition(A, B, p) {
  const e = easeInOutCubic(seg(p, 0, TIMING.expandEnd)); // 확장 진행
  const s = easeInOutCubic(seg(p, TIMING.slideStart, 1)); // 슬라이드 진행
  const sB = seg(p, TIMING.slideStart, 1); // B 내부 요소용 (선형 진행 → 각자 easeOut)
  const push = A.side === 'left' ? 1 : -1; // 비주얼이 넓어질 때 에디토리얼이 밀려나는 방향

  /* ---- A : 확장 → 왼쪽으로 퇴장 ---- */
  A.layer.style.visibility = p >= 1 ? 'hidden' : 'visible';
  A.visual.style.width = `${lerp(REST_VISUAL, 100, e)}%`;
  A.visual.style.transform = `translate3d(${-100 * s}%,0,0)`;
  A.editorial.style.opacity = String(1 - seg(e, 0, 0.6));
  A.editorial.style.transform = `translate3d(${push * 64 * e}px,0,0)`;
  if (A.phone) {
    A.phone.style.transform = `translate3d(0,${-6 * e}%,0) scale(${1 + 0.34 * e})`;
    A.phone.style.opacity = String(1 - seg(s, 0, 0.5));
  }

  /* ---- B : 오른쪽에서 이어서 입장 ---- */
  B.layer.style.visibility = p <= 0 ? 'hidden' : 'visible';
  B.layer.style.transform = `translate3d(${100 * (1 - s)}%,0,0)`;
  if (B.media) B.media.style.transform = `scale(${lerp(1.18, 1, easeOutCubic(sB))})`;
  if (B.phone) {
    const t = easeOutCubic(seg(sB, 0.5, 1));
    B.phone.style.opacity = String(t);
    B.phone.style.transform = `translate3d(0,${(1 - t) * 44}px,0) scale(${0.9 + 0.1 * t})`;
  }
  B.titleLines.forEach((el, i) => {
    const t = easeOutCubic(seg(sB, 0.3 + 0.07 * i, 0.8 + 0.07 * i));
    el.style.transform = `translate3d(0,${(1 - t) * 115}%,0)`;
  });
  B.reveals.forEach((el, i) => {
    const t = easeOutCubic(seg(sB, 0.4 + 0.06 * i, 0.85 + 0.06 * i));
    el.style.opacity = String(t);
    el.style.transform = `translate3d(0,${(1 - t) * 18}px,0)`;
  });
}

/* ---------- 표지(intro) 페이지 넘김: p 0 = 표지 / p 1 = 표지가 왼쪽으로 걷힘 ---------- */
export function paintIntro(intro, p) {
  const fold = intro.querySelector('.intro-fold');
  const shadow = intro.querySelector('.intro-shadow');
  const e = easeInOutQuad(p);
  const w = 1 - e; // 표지가 아직 보이는 폭 비율
  const fade = seg(p, 0, 0.1) * (1 - seg(p, 0.86, 1)); // 접히는 모서리는 시작/끝에서만 옅게 보인다

  intro.style.visibility = p >= 1 ? 'hidden' : 'visible';
  intro.style.clipPath = p <= 0 ? 'inset(0% 0% 0% 0%)' : `inset(0% ${(1 - w) * 100}% 0% 0%)`;
  fold.style.left = `${w * 103 - 3}%`;
  fold.style.transform = `translateX(-50%) skewX(-2deg) scaleX(${lerp(1, 0.76, e)})`;
  fold.style.opacity = String(fade);
  shadow.style.left = `${w * 101 - 1}%`;
  shadow.style.opacity = String(0.24 * fade);
}
