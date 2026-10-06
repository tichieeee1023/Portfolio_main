export function navigateToChapter(id: string, animate = true) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: animate && !reduced ? 'smooth' : 'instant', block: 'start' });
  history.replaceState(null, '', '#' + id);

  // scrollIntoView는 키보드/스크린리더 포커스를 옮기지 않으므로 대상 섹션으로 직접 옮긴다.
  // (스크롤은 위에서 이미 했으니 preventScroll)
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}
