export const WORK_PROJECT_INDEX: Record<string, number> = {
  'work-moonlight': 0, 'work-harvest': 1, 'work-b612': 2,
  'work-forlog': 3, 'work-midnight': 4, 'work-jajak': 5,
};

export function navigateToChapter(id: string, animate = true) {
  const workIndex = WORK_PROJECT_INDEX[id];
  const target = document.getElementById(workIndex === undefined ? id : 'work-pages');
  if (!target) return;
  // WORK 표지로 이동할 때는 이전에 펼쳐둔 프로젝트 페이지도 표지로 되돌린다.
  // 개별 프로젝트 앵커(work-*)는 기존처럼 해당 프로젝트를 직접 연다.
  if (id === 'projects') window.dispatchEvent(new Event('selected-work:show-cover'));
  if (workIndex !== undefined) window.dispatchEvent(new CustomEvent('selected-work:navigate', { detail: workIndex }));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: animate && !reduced ? 'smooth' : 'instant', block: 'start' });
  history.replaceState(null, '', '#' + id);

  // scrollIntoView는 키보드/스크린리더 포커스를 옮기지 않으므로 대상 섹션으로 직접 옮긴다.
  // (스크롤은 위에서 이미 했으니 preventScroll)
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}
