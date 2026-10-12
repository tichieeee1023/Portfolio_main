
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import "./DesktopOpening.css";
import { GROWTH } from "./growthData";

const WORD = "PORTFOLIO";
const STATEMENT = "화면이 반응하는 순간을 좋아합니다.";
const OFFSETS = [
  [-44, -60, -10], [26, 64, 8], [-18, -35, -6],
  [16, 76, 12], [-22, -70, -8], [32, 48, 7],
  [-14, -52, -5], [24, 72, 9], [42, -44, -7],
];

export default function DesktopOpening({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const completeRef = useRef(onComplete);

  useLayoutEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let finished = false;
    let exiting = false;
    let timeline: gsap.core.Timeline | undefined;
    let exitTween: gsap.core.Tween | undefined;
    let touchTimer: number | undefined;
    let litLetter: HTMLElement | null = null;
    let moveX: ((value: number) => void) | undefined;
    let moveY: ((value: number) => void) | undefined;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");

    const finish = () => {
      if (finished) return;
      finished = true;
      const restoreFocus = root.contains(document.activeElement);
      completeRef.current();
      if (restoreFocus) requestAnimationFrame(() => {
        const hero = document.getElementById("top");
        hero?.setAttribute("tabindex", "-1");
        hero?.focus({ preventScroll: true });
      });
    };
    if (preference.matches) {
      finish();
      return;
    }
    const skip = () => {
      if (finished || exiting) return;
      if (preference.matches) { finish(); return; }
      exiting = true;
      timeline?.kill();
      exitTween = gsap.to(root, {
        yPercent: -100, duration: .38, ease: "power2.out",
        overwrite: true, onComplete: finish,
      });
    };
    skipRef.current = skip;
    const underlying = Array.from(document.querySelectorAll<HTMLElement>(".yoojinHero, .mobileHeroIntro, .portfolioChapters"));
    const previousInert = underlying.map(element => element.inert);
    underlying.forEach(element => { element.inert = true; });
    let wheelIntent = 0;
    let lastWheel = 0;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (exiting || finished) return;
      const now = performance.now();
      if (now - lastWheel > 160) wheelIntent = 0;
      lastWheel = now;
      wheelIntent += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (Math.abs(wheelIntent) >= 28) skip();
    };
    let touchStartY: number | null = null;
    const onTouchStart = (event: TouchEvent) => {
      event.stopImmediatePropagation();
      touchStartY = event.touches.length === 1 ? event.touches[0].clientY : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (touchStartY !== null && event.touches.length === 1 && Math.abs(event.touches[0].clientY - touchStartY) >= 28) skip();
    };
    const onTouchEnd = (event: TouchEvent) => {
      event.stopImmediatePropagation();
      touchStartY = null;
    };
    const onKey = (event: KeyboardEvent) => {
      if (!["Escape", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      skip();
    };
    const clearLetter = () => {
      litLetter?.classList.remove("isLit");
      litLetter = null;
    };
    const letterAt = (target: EventTarget | null) =>
      target instanceof Element ? target.closest<HTMLElement>(".desktopOpeningReactiveLetter") : null;
    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || exiting) return;
      const letter = letterAt(event.target);
      if (letter === litLetter) return;
      clearLetter();
      if (letter?.textContent?.trim()) {
        litLetter = letter;
        letter.classList.add("isLit");
      }
    };
    const onPointerOut = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && litLetter && (!(event.relatedTarget instanceof Node) || !litLetter.contains(event.relatedTarget))) clearLetter();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || exiting) return;
      const letter = letterAt(event.target);
      if (!letter?.textContent?.trim()) return;
      window.clearTimeout(touchTimer);
      clearLetter();
      litLetter = letter;
      letter.classList.add("isLit");
      touchTimer = window.setTimeout(clearLetter, 700);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || exiting) return;
      moveX?.((event.clientX / innerWidth - .5) * 8);
      moveY?.((event.clientY / innerHeight - .5) * 6);
    };
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") clearLetter();
      moveX?.(0);
      moveY?.(0);
    };
    root.addEventListener("pointerover", onPointerOver);
    root.addEventListener("pointerout", onPointerOut);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave);
    const onPreference = () => { if (preference.matches) finish(); };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKey, true);
    preference.addEventListener("change", onPreference);
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true, capture: true });
    const ctx = gsap.context(() => {
      const center = root.querySelector(".desktopOpeningCenter");
      if (center) {
        moveX = gsap.quickTo(center, "x", { duration: .65, ease: "power3.out" });
        moveY = gsap.quickTo(center, "y", { duration: .65, ease: "power3.out" });
      }
      const letters = Array.from(root.querySelectorAll<HTMLElement>(".desktopOpeningLetter"));
      const spread = root.clientWidth <= 768 ? .45 : 1;
      gsap.set(letters, {
        x: index => OFFSETS[index][0] * spread,
        y: index => OFFSETS[index][1] * spread,
        rotation: index => OFFSETS[index][2],
        opacity: .16, color: "#ac9178",
      });
      timeline = gsap.timeline({ onComplete: finish });
      timeline.fromTo(".desktopOpeningFrame", { opacity: 0, scale: .98 }, { opacity: 1, scale: 1, duration: .7 }, 0);
      timeline.to(letters, { x: 0, y: 0, rotation: 0, opacity: 1, color: "#ad7346", duration: .58, stagger: .065, ease: "power3.out" }, .12);
      timeline.to(letters, { color: "#282019", duration: .24, stagger: .025 }, .92);
      timeline.fromTo(".desktopOpeningDivider", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: .6, ease: "power3.out" }, .85);
      timeline.fromTo(".desktopOpeningMotionText", { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .55, stagger: .15, ease: "power3.out" }, .98);
      timeline.fromTo(".desktopOpeningStepFill", { scaleX: 0 }, { scaleX: 1, duration: .5, stagger: .65, ease: "power2.inOut" }, .65);
      timeline.fromTo(".desktopOpeningStepName", { opacity: .45 }, { opacity: 1, duration: .3, stagger: .65 }, .8);
      timeline.to(root, { yPercent: -100, duration: .8, ease: "power3.inOut" }, 4.7);
    }, root);
    return () => {
      exitTween?.kill();
      window.clearTimeout(touchTimer);
      clearLetter();
      root.removeEventListener("pointerover", onPointerOver);
      root.removeEventListener("pointerout", onPointerOut);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      ctx.revert();
      skipRef.current = () => {};
      underlying.forEach((element, index) => { element.inert = previousInert[index]; });
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("keydown", onKey, true);
      preference.removeEventListener("change", onPreference);
      window.removeEventListener("touchstart", onTouchStart, true);
      window.removeEventListener("touchmove", onTouchMove, true);
      window.removeEventListener("touchend", onTouchEnd, true);
      window.removeEventListener("touchcancel", onTouchEnd, true);
    };
  }, []);

  return (
    <div ref={rootRef} className="desktopOpening" role="region" aria-label="이유진 포트폴리오 오프닝">
      <div className="desktopOpeningFrame" aria-hidden="true" />
      <header className="desktopOpeningHeader">
        <div className="desktopOpeningBrand">
          <img src="/brand/yj-monogram-dark.png" width="161" height="165" alt="YJ" />
          <span>LEE YOOJIN<span>THE GROWTH ISSUE / 01</span></span>
        </div>
        <button type="button" className="desktopOpeningSkip" onClick={() => skipRef.current()}>
          건너뛰기 <span aria-hidden="true">↗</span>
        </button>
      </header>
      <div className="desktopOpeningCenter">
        <p className="desktopOpeningKicker">A FRONTEND DEVELOPER’S STORY</p>
        <div className="desktopOpeningWord" role="img" aria-label="PORTFOLIO">
          {Array.from(WORD).map((letter, index) => (
            <span key={index} className="desktopOpeningLetter" aria-hidden="true"><span className="desktopOpeningLetterInk desktopOpeningReactiveLetter">{letter}</span></span>
          ))}
        </div>
        <div className="desktopOpeningDivider" aria-hidden="true" />
        <div className="desktopOpeningReveal desktopOpeningIdentityReveal">
          <p className="desktopOpeningIdentity desktopOpeningMotionText"><strong>이유진 키우기</strong><span className="desktopOpeningLoading">Loading<span className="desktopOpeningLoadingDots" aria-hidden="true">...</span></span></p>
        </div>
        <div className="desktopOpeningReveal desktopOpeningStatementReveal">
          <p className="desktopOpeningStatement desktopOpeningMotionText">
            {Array.from(STATEMENT).map((letter, index) => (
              <span key={index} className="desktopOpeningStatementLetter desktopOpeningReactiveLetter">{letter}</span>
            ))}
          </p>
        </div>
        <div className="desktopOpeningReveal desktopOpeningHintReveal">
          <p className="desktopOpeningHint desktopOpeningMotionText">스크롤할 때마다 한 단계씩 성장합니다 <span aria-hidden="true">↓</span></p>
        </div>
      </div>
      <footer className="desktopOpeningFooter">
        <ol className="desktopOpeningSteps" aria-label="이유진의 다섯 성장 단계 미리보기">
          {GROWTH.map((step, index) => (
            <li key={step.name} className="desktopOpeningStep">
              <div className="desktopOpeningStepBar" aria-hidden="true"><span className="desktopOpeningStepFill" /></div>
              <span className="desktopOpeningStepIndex">{String(index + 1).padStart(2, "0")}</span>
              <span className="desktopOpeningStepName">{step.name}</span>
            </li>
          ))}
        </ol>
      </footer>
    </div>
  );
}
