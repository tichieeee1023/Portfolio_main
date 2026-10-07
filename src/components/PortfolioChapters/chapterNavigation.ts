export function navigateToChapter(id: string, animate = true) {
  const workIndex = ({ 'work-moonlight': 0, 'work-harvest': 1, 'work-b612': 2 } as Record<string, number>)[id];
  const target = document.getElementById(workIndex === undefined ? id : 'projects');
  if (!target) return;
  if (workIndex !== undefined) window.dispatchEvent(new CustomEvent('selected-work:navigate', { detail: workIndex }));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: animate && !reduced ? 'smooth' : 'instant', block: 'start' });
  history.replaceState(null, '', '#' + id);

  // scrollIntoView는 키보드/스크린리더 포커스를 옮기지 않으므로 대상 섹션으로 직접 옮긴다.
  // (스크롤은 위에서 이미 했으니 preventScroll)
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}
