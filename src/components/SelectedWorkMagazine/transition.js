/** Selected Work: short, reversible page slides at the resting layout size. */

export const REST_VISUAL = 60; // 정지 상태에서 비주얼이 차지하는 폭(%) — 나머지 40%가 잡지 지면 (CSS --visual-w와 같은 값)
export const DURATION = 0.62; // 초 (전체 전환)
export const CHROME_SWITCH_AT = 0.5; // 헤더/푸터/테마가 다음 프로젝트로 바뀌는 시점

/* ---------- 작은 수학 도구 ---------- */
const clamp01 = (v) => Math.min(1, Math.max(0, v));
/** p가 a~b 구간에서 0~1로 진행되는 값 */
export const seg = (p, a, b) => clamp01((p - a) / (b - a));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

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
  const slide = easeInOutCubic(clamp01(p));
  A.layer.style.visibility = p >= 1 ? 'hidden' : 'visible';
  B.layer.style.visibility = p <= 0 ? 'hidden' : 'visible';
  A.layer.style.transform = `translate3d(${-100 * slide}%,0,0)`;
  B.layer.style.transform = `translate3d(${100 * (1 - slide)}%,0,0)`;
  // The image, phone and editorial move together without changing their size.
  A.visual.style.width = `${REST_VISUAL}%`;
  B.visual.style.width = `${REST_VISUAL}%`;
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
