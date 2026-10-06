import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { LAST_SCENE } from "./heroScenes";
import { prefersReducedMotion } from "./heroUtils";

type ElRef = RefObject<HTMLElement | null>;

/** 장면이 바뀔 때마다 키워드/아웃라인/문구/HUD 숫자를 다시 등장시킨다. */
export function useKineticTypography(
  sceneIndex: number,
  {
    sectionRef,
    keywordRef,
    keywordEchoRef,
    outlineRef,
    phraseRef,
    accentRef,
    numberRef,
  }: Record<
    | "sectionRef"
    | "keywordRef"
    | "keywordEchoRef"
    | "outlineRef"
    | "phraseRef"
    | "accentRef"
    | "numberRef",
    ElRef
  >
) {
  useEffect(() => {
    if (
      !keywordRef.current ||
      !outlineRef.current ||
      !phraseRef.current ||
      !numberRef.current
    ) {
      return;
    }

    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      if (reduced) {
        gsap.set([keywordRef.current, outlineRef.current, phraseRef.current], {
          opacity: 1, xPercent: 0, yPercent: 0, y: 0, skewX: 0,
        });
        gsap.set(numberRef.current, { opacity: sceneIndex === LAST_SCENE ? 0 : 0.12, y: 0 });
        return;
      }

      tl.fromTo(
        keywordRef.current,
        {
          yPercent: 110,
          skewX: sceneIndex % 2 === 0 ? -8 : 8,
          opacity: 0,
        },
        {
          yPercent: 0,
          skewX: 0,
          opacity: 1,

          duration: 0.68,

          ease: "power4.out",
        }
      );

      tl.fromTo(
        outlineRef.current,
        {
          xPercent: sceneIndex % 2 === 0 ? 15 : -15,
          opacity: 0,
        },
        {
          xPercent: 0,
          opacity: 1,

          duration: 0.7,

          ease: "power4.out",
        },
        "<0.04"
      );

      tl.fromTo(
        numberRef.current,
        {
          y: 70,
          opacity: 0,
        },
        {
          y: 0,
          opacity: sceneIndex === LAST_SCENE ? 0 : 0.12,

          duration: 0.5,

          ease: "power3.out",
        },
        "<"
      );

      tl.fromTo(
        phraseRef.current,
        {
          y: 18,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,

          duration: 0.4,

          ease: "power2.out",
        },
        "-=0.3"
      );

      if (accentRef.current) {
        gsap.fromTo(accentRef.current,
          { scaleX: 0, opacity: 0, x: -24 },
          { scaleX: 1, opacity: 1, x: 0, duration: 0.55, ease: "expo.out", delay: 0.2 }
        );
      }

      gsap.fromTo(
        keywordRef.current?.querySelectorAll(".keywordLetter") ?? [],
        { yPercent: 85, rotate: sceneIndex % 2 === 0 ? -7 : 7, opacity: 0 },
        {
          yPercent: 0, rotate: 0, opacity: 1,
          duration: 0.48, ease: "back.out(1.5)", stagger: 0.035,
          delay: 0.08,
        }
      );

      if (keywordEchoRef.current) {
        gsap.fromTo(keywordEchoRef.current,
          { xPercent: sceneIndex % 2 === 0 ? -9 : 9, opacity: 0 },
          { xPercent: 0, opacity: 0.38, duration: 0.8, ease: "expo.out" }
        );
      }

      gsap.fromTo(
        ".footerInfoItem strong, .levelNumber strong",
        {
          y: 10,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,

          stagger: 0.04,

          duration: 0.42,

          ease: "power3.out",
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, [sceneIndex]);
}

/** 떠다니는 장식 요소 + 포인터에 반응하는 패럴랙스. */
export function useAmbientMotion(stageRef: ElRef, ambientRef: ElRef) {
  useEffect(() => {
    const stage = stageRef.current;
    const ambient = ambientRef.current;
    if (!stage || !ambient || prefersReducedMotion()) return;

    const items = ambient.querySelectorAll<HTMLElement>(".ambientItem");
    const ctx = gsap.context(() => {
      items.forEach((item, index) => {
        gsap.fromTo(item,
          { y: index % 2 === 0 ? -8 : 8, rotate: index % 2 === 0 ? -5 : 5 },
          {
            y: index % 2 === 0 ? 10 : -10,
            rotate: index % 2 === 0 ? 5 : -5,
            duration: 2.6 + index * 0.47,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }
        );
      });
    }, ambient);

    const moveX = gsap.quickTo(ambient, "x", { duration: 0.8, ease: "power3.out" });
    const moveY = gsap.quickTo(ambient, "y", { duration: 0.8, ease: "power3.out" });
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = stage.getBoundingClientRect();
      moveX(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
      moveY(((event.clientY - bounds.top) / bounds.height - 0.5) * 14);
    };
    const onPointerLeave = () => {
      moveX(0);
      moveY(0);
    };

    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerleave", onPointerLeave);
    return () => {
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      moveX.tween.kill();
      moveY.tween.kill();
      ctx.revert();
    };
  }, []);
}

/** 대사 박스 등장/전환 연출. */
export function useDialogueMotion(
  dialogueOpen: boolean,
  dialogueIndex: number,
  dialogueRef: ElRef,
  dialogueTextRef: ElRef
) {
  useEffect(() => {
    if (!dialogueOpen || !dialogueRef.current || !dialogueTextRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (dialogueIndex === 0) {
        gsap.fromTo(dialogueRef.current,
          { y: 26, rotate: -2, scale: 0.93, autoAlpha: 0, filter: "blur(10px)" },
          {
            y: 0, rotate: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)",
            duration: 0.58, ease: "back.out(1.6)",
          }
        );
        gsap.fromTo(".dialogueSpark",
          { scale: 0, rotation: -90, opacity: 0 },
          {
            scale: 1, rotation: 0, opacity: 1,
            duration: 0.46, ease: "back.out(2)", stagger: 0.07, delay: 0.15,
          }
        );
      }
      gsap.fromTo(dialogueTextRef.current,
        { y: 14, opacity: 0, skewX: -5 },
        { y: 0, opacity: 1, skewX: 0, duration: 0.36, ease: "power3.out" }
      );
    }, dialogueRef);
    return () => ctx.revert();
  }, [dialogueOpen, dialogueIndex]);
}
