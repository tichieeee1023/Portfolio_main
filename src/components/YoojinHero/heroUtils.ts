export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const pad2 = (n: number) => String(n).padStart(2, "0");
