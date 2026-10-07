import { gsap } from "gsap";

export type TransitionKind = "cut" | "blinds" | "shards" | "awakening";

type Options = {
  stage: HTMLElement;
  host: HTMLElement;
  layers: HTMLElement[];
  images: string[];
  /** transitions[i] = i번 장면으로 들어올 때의 연출 */
  transitions: TransitionKind[];
  onStart: () => void;
  onReveal: (index: number) => void;
  onFinish: (index: number) => void;
};

const triangles = [
  "polygon(0 0, 100% 0, 50% 50%)",
  "polygon(100% 0, 100% 100%, 50% 50%)",
  "polygon(100% 100%, 0 100%, 50% 50%)",
  "polygon(0 100%, 0 0, 50% 50%)",
];

// Time-based action sequences: scrolling chooses a scene, never slows its impact.
export function createHeroMotion(options: Options) {
  const { stage, host, layers, images, transitions, onStart, onReveal, onFinish } = options;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;
  let desired = 0;
  let active = false;
  let disposed = false;
  let timeline: gsap.core.Timeline | undefined;

  const make = (className: string, imageIndex?: number) => {
    const element = document.createElement("div");
    element.className = className;
    if (imageIndex !== undefined) element.style.backgroundImage = `url("${images[imageIndex]}")`;
    host.append(element);
    return element;
  };

  const show = (index: number) => {
    gsap.set(layers, { autoAlpha: 0, scale: 1, x: 0, y: 0, clipPath: "none" });
    gsap.set(layers[index], { autoAlpha: 1 });
    current = index;
    stage.dataset.scene = String(index);
    stage.dataset.revealed = "true";
    onReveal(index);
  };

  const request = (index: number) => {
    desired = Math.max(0, Math.min(images.length - 1, index));
    if (disposed || active || desired === current) return;

    const next = desired;
    const previous = current;
    const direction = next > previous ? 1 : -1;
    const kind = transitions[next];
    active = true;
    onStart();
    host.replaceChildren();
    stage.dataset.motion = kind;
    stage.dataset.transitioning = "true";
    stage.dataset.revealed = "false";
    gsap.set(host, { autoAlpha: 1 });

    const finish = () => {
      host.replaceChildren();
      gsap.set(host, { autoAlpha: 0 });
      gsap.set(layers, { scale: 1, x: 0, y: 0 });
      stage.dataset.transitioning = "false";
      active = false;
      onFinish(next);
      if (!disposed && desired !== current) request(desired);
    };

    timeline = gsap.timeline({ onComplete: finish });
    const tl = timeline;
    if (preference.matches) {
      tl.to(layers[previous], { opacity: 0, duration: 0.12 })
        .call(() => show(next));
      return;
    }

    if (kind === "cut") {
      const panels = [
        make("motionPanel motionPanelTop"),
        make("motionPanel motionPanelBottom"),
      ];
      const slash = make("motionSlash");
      gsap.set(panels[0], { xPercent: -110, yPercent: -25 });
      gsap.set(panels[1], { xPercent: 110, yPercent: 25 });
      gsap.set(slash, { scaleY: 0, opacity: 0 });
      tl.to(layers[previous], { scale: 1.055, duration: 0.18, ease: "power2.in" }, 0)
        .to(panels, { xPercent: 0, yPercent: 0, duration: 0.24, ease: "power4.in" }, 0)
        .call(() => show(next), [], 0.24)
        .fromTo(layers[next], { scale: 1.13 }, { scale: 1, duration: 0.5, ease: "expo.out" }, 0.24)
        .to(slash, { scaleY: 1.5, opacity: 1, duration: 0.09 }, 0.21)
        .to(panels[0], { xPercent: 110 * direction, yPercent: -45, duration: 0.36, ease: "expo.inOut" }, 0.29)
        .to(panels[1], { xPercent: -110 * direction, yPercent: 45, duration: 0.36, ease: "expo.inOut" }, 0.32)
        .to(slash, { opacity: 0, scaleX: 8, duration: 0.2 }, 0.35);
    } else if (kind === "blinds") {
      // Full-viewport layers are the main cost: use fewer, wider blinds on small screens.
      const count = window.matchMedia("(max-width: 768px)").matches ? 6 : 12;
      const stagger = 0.018 * (12 / count); // keep the total sweep time the same
      const strips = Array.from({ length: count }, (_, i) => {
        const strip = make("motionPiece motionBlind", previous);
        strip.style.clipPath = `inset(${i * 100 / count}% 0 ${(count - 1 - i) * 100 / count}% 0)`;
        strip.style.transformOrigin = `50% ${(i + 0.5) * 100 / count}%`;
        return strip;
      });
      const shade = make("motionShade");
      gsap.set(shade, { opacity: 0 });
      // Each strip uses the same full-size cover crop, so the image rejoins seamlessly.
      strips.forEach((strip, i) => {
        const sign = (i % 2 === 0 ? 1 : -1) * direction;
        const start = i * stagger;
        tl.to(strip, { rotationX: sign * 90, z: sign * 65, duration: 0.21, ease: "power3.in" }, start)
          .set(strip, { backgroundImage: `url("${images[next]}")`, rotationX: -sign * 90 }, start + 0.21)
          .to(strip, { rotationX: 0, z: 0, duration: 0.33, ease: "expo.out" }, start + 0.22);
      });
      tl.to(shade, { opacity: 0.18, duration: 0.18 }, 0)
        .call(() => show(next), [], 0.24)
        .to(shade, { opacity: 0, duration: 0.3 }, 0.28);
    } else if (kind === "shards") {
      const vectors = [[0, -105], [105, 0], [0, 105], [-105, 0]];
      const incoming = triangles.map((clip) => {
        const piece = make("motionPiece motionShard", next);
        piece.style.clipPath = clip;
        return piece;
      });
      const outgoing = triangles.map((clip) => {
        const piece = make("motionPiece motionShard", previous);
        piece.style.clipPath = clip;
        return piece;
      });
      incoming.forEach((piece, i) => {
        const [x, y] = vectors[i];
        gsap.set(piece, { xPercent: -x * direction, yPercent: -y * direction, scale: 1.12 });
        tl.to(outgoing[i], {
          xPercent: x * direction, yPercent: y * direction, scale: 1.12,
          duration: 0.36, ease: "power4.in",
        }, i * 0.025)
          .to(piece, { xPercent: 0, yPercent: 0, scale: 1, duration: 0.4, ease: "expo.out" }, 0.2 + i * 0.025);
      });
      tl.call(() => show(next), [], 0.4);
    } else {
      const dark = make("motionDark");
      const portrait = make("motionPiece motionAwakeningImage", next);
      const panels = [make("motionPanel motionPanelTop"), make("motionPanel motionPanelBottom")];
      const slash = make("motionSlash motionSlashGold");
      const title = make("motionAwakeningTitle");
      title.innerHTML = `<span>FINAL EVOLUTION / ${String(images.length).padStart(2, "0")}</span><strong>AWAKEN.</strong>`;
      const burst = make("motionBurst");
      gsap.set(dark, { opacity: 0 });
      gsap.set(portrait, {
        opacity: 0, scale: 1.2, filter: "brightness(0.12) saturate(0)",
        clipPath: "polygon(37% 0, 75% 0, 63% 100%, 25% 100%)",
      });
      gsap.set(panels[0], { xPercent: -115, yPercent: -20 });
      gsap.set(panels[1], { xPercent: 115, yPercent: 20 });
      gsap.set([title, burst, slash], { opacity: 0 });
      tl.to(dark, { opacity: 1, duration: 0.2 }, 0)
        .to(panels, { xPercent: 0, yPercent: 0, duration: 0.26, ease: "power4.in" }, 0)
        .to(panels[0], { xPercent: -17, duration: 0.25, ease: "expo.out" }, 0.28)
        .to(panels[1], { xPercent: 17, duration: 0.25, ease: "expo.out" }, 0.28)
        .to(portrait, { opacity: 1, duration: 0.12 }, 0.28)
        .fromTo(title, { y: 60, skewX: -9 }, { y: 0, skewX: 0, opacity: 1, duration: 0.3, ease: "expo.out" }, 0.4)
        .to(slash, { opacity: 1, scaleY: 1.4, duration: 0.14 }, 0.6)
        .to(portrait, { filter: "brightness(0.55) saturate(0.25)", scale: 1.08, duration: 0.5 }, 0.55)
        .to(title, { xPercent: 35, opacity: 0, duration: 0.18, ease: "power3.in" }, 1.05)
        .to(burst, { opacity: 0.85, duration: 0.09 }, 1.15)
        .call(() => show(next), [], 1.24)
        .set([portrait, dark], { opacity: 0 }, 1.24)
        .fromTo(layers[next], { scale: 1.12 }, { scale: 1, duration: 0.65, ease: "expo.out" }, 1.24)
        .to(panels[0], { xPercent: -120, yPercent: -30, duration: 0.36, ease: "expo.inOut" }, 1.2)
        .to(panels[1], { xPercent: 120, yPercent: 30, duration: 0.36, ease: "expo.inOut" }, 1.2)
        .to(burst, { opacity: 0, scale: 1.4, duration: 0.45 }, 1.25)
        .to(slash, { opacity: 0, scaleX: 12, duration: 0.25 }, 1.25)
        .to(layers[next], { x: 3, duration: 0.045, repeat: 3, yoyo: true }, 1.3)
        .set(layers[next], { x: 0 }, 1.49)
        // Preserve the existing 2.8-second completion gate for the final scene.
        .set({}, {}, 2.8);
    }
  };

  gsap.set(layers, { autoAlpha: 0 });
  gsap.set(layers[0], { autoAlpha: 1 });
  gsap.set(host, { autoAlpha: 0 });
  stage.dataset.scene = "0";
  stage.dataset.revealed = "true";
  stage.dataset.transitioning = "false";

  const handlePreference = () => {
    if (preference.matches && timeline?.isActive()) timeline.progress(1);
  };
  preference.addEventListener("change", handlePreference);
  return {
    request,
    destroy() {
      disposed = true;
      timeline?.kill();
      preference.removeEventListener("change", handlePreference);
      host.replaceChildren();
      delete stage.dataset.motion;
      delete stage.dataset.transitioning;
      delete stage.dataset.revealed;
      delete stage.dataset.scene;
    },
  };
}
