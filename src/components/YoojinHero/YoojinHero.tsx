import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import "./YoojinHero.css";
import "./heroControls.css";
import { GrowthJourney, GrowthIdentity, AcquisitionFireworks } from "./GrowthJourney";
import { GROWTH } from "./growthData";
import { createHeroMotion } from "./heroMotion";
import { LAST_SCENE, SCENES, SCENE_POINTS, SCROLL_END } from "./heroScenes";
import { pad2, prefersReducedMotion } from "./heroUtils";
import { useAmbientMotion, useDialogueMotion, useKineticTypography } from "./useHeroAnimations";
import { navigateToChapter } from "../PortfolioChapters/chapterNavigation";
import MobileHeroIntro from "./MobileHeroIntro";
import { MOBILE_SCENES } from "./mobileScenes";
import { useMobileLevelUpFeedback } from "./useMobileLevelUpFeedback";
import "./MobileLevelUpFeedback.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/*
  스크롤 → 장면 결정.
  - INTENT(약 40px) 이상 움직여야 "장면을 넘기려는 의도"로 본다. 미세한 흔들림은 무시.
  - 의도가 확인되면 진행 방향의 다음 장면으로 간다(휠 한 칸 = 한 장면).
  - SNAP_EPS는 장면 지점에 도착한 뒤 남는 몇 px 오차를 흡수한다.
*/
const INTENT = 0.01;
const SNAP_EPS = 0.004;
const pickSceneIndex = (progress: number, direction: number, current: number) => {
  const delta = progress - SCENE_POINTS[current];
  if (Math.abs(delta) < INTENT) return current;
  const dir = direction !== 0 ? direction : delta > 0 ? 1 : -1;
  if (dir > 0) {
    const i = SCENE_POINTS.findIndex((p) => p >= progress - SNAP_EPS);
    return i === -1 ? LAST_SCENE : i;
  }
  let i = 0;
  SCENE_POINTS.forEach((p, k) => {
    if (p <= progress + SNAP_EPS) i = k;
  });
  return i;
};

export default function YoojinHero() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 768px)").matches);
  const [journeyStarted, setJourneyStarted] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const startMobileJourney = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setJourneyStarted(true);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const hero = document.getElementById("top");
      hero?.setAttribute("tabindex", "-1");
      hero?.focus({ preventScroll: true });
    });
  };

  return (
    <div className="heroEntry">
      {isMobile && !journeyStarted
        ? <MobileHeroIntro onStartJourney={startMobileJourney} onViewProjects={() => navigateToChapter("projects")} />
        : <HeroJourney key={isMobile ? "mobile" : "desktop"} mobileMode={isMobile} />}
    </div>
  );
}

function HeroJourney({ mobileMode }: { mobileMode: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const keywordRef = useRef<HTMLDivElement>(null);
  const keywordEchoRef = useRef<HTMLSpanElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const dialogueRef = useRef<HTMLButtonElement>(null);
  const dialogueTextRef = useRef<HTMLSpanElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLParagraphElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  const marqueeTopRef = useRef<HTMLDivElement>(null);
  const marqueeBottomRef = useRef<HTMLDivElement>(null);

  const triggerRef = useRef<ScrollTrigger | null>(null);

  // 이미지 디코딩이 끝나기 전에는 장면 전환을 시작하지 않는다(첫 전환 깜빡임 방지).
  const motionApiRef = useRef<ReturnType<typeof createHeroMotion> | null>(null);
  const assetsReadyRef = useRef(false);
  const desiredSceneRef = useRef(0);
  // 전환이 이미 시작된 제스처(또는 버튼 이동)가 장면 지점에 안착할 때까지 새 의도 판정을 잠근다.
  const gestureLockRef = useRef(false);
  // 마지막 장면의 각성 연출이 끝나기 전에는 핀 구간 밖으로 스크롤되지 않게 막는다.
  const lockExitRef = useRef(false);
  // SSR 완료 후 ABOUT으로 넘어갈 때 연속 휠 입력이 겹치지 않게 잠근다.
  const chapterPagingRef = useRef(false);

  const [sceneIndex, setSceneIndex] = useState(0);

  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [revolutionDone, setRevolutionDone] = useState(false);
  const [acquisitionVisible, setAcquisitionVisible] = useState(false);

  const scenes = mobileMode ? MOBILE_SCENES : SCENES;
  const currentScene = scenes[sceneIndex];
  const levelFeedback = useMobileLevelUpFeedback();

  useKineticTypography(sceneIndex, {
    sectionRef,
    keywordRef,
    keywordEchoRef,
    outlineRef,
    phraseRef,
    accentRef,
    numberRef,
  });
  useAmbientMotion(stageRef, ambientRef);
  useDialogueMotion(dialogueOpen, dialogueIndex, dialogueRef, dialogueTextRef);

  /* ========================================
     PRELOAD
  ======================================== */

  useEffect(() => {
    let cancelled = false;

    const decodeAll = Promise.all(
      scenes.map(async (scene) => {
        const image = new Image();
        image.src = scene.image;
        try {
          await image.decode();
        } catch {
          /* 디코딩 실패해도 전환 자체는 막지 않는다 */
        }
      })
    );
    // 네트워크가 느려도 3초 뒤에는 어떤 경우든 열어준다.
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 3000));

    Promise.race([decodeAll, timeout]).then(() => {
      if (cancelled) return;
      assetsReadyRef.current = true;
      // 준비 전에 스크롤된 위치가 있다면 지금 반영
      motionApiRef.current?.request(desiredSceneRef.current);
    });

    return () => {
      cancelled = true;
    };
  }, [scenes]);

  /* ========================================
     MAIN SCROLL
  ======================================== */

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const host = motionRef.current;
    if (!section || !stage || !host) return;

    let motion: ReturnType<typeof createHeroMotion> | undefined;
    const ctx = gsap.context(() => {
      motion = createHeroMotion({
        stage,
        host,
        layers: imageRefs.current.filter((layer): layer is HTMLDivElement => layer !== null),
        images: scenes.map((scene) => scene.image),
        transitions: scenes.map((scene) => scene.transition),
        onStart: () => {
          lockExitRef.current = desiredSceneRef.current === LAST_SCENE;
          setIsTransitioning(true);
          setRevolutionDone(false);
          setAcquisitionVisible(false);
          setDialogueOpen(false);
        },
        onReveal: (index) => {
          setSceneIndex(index);
          setAcquisitionVisible(index === LAST_SCENE);
          setDialogueIndex(0);
        },
        onFinish: (index) => {
          lockExitRef.current = false;
          setIsTransitioning(false);
          setRevolutionDone(index === LAST_SCENE);
        },
      });

      motionApiRef.current = motion;

      let snapIndex = 0;

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: SCROLL_END,
        pin: stage,
        anticipatePin: 1,
        /*
          1) 의도 판정(onUpdate): 스크롤이 INTENT를 넘는 순간 바로 전환을 시작한다.
             트랙패드 관성이 끝나길 기다리지 않는다.
          2) 스냅(snapTo): 스크롤 위치를 장면 지점에 맞춰 안착시킨다.
          두 단계가 같은 pickSceneIndex를 쓰므로 서로 다른 장면을 가리키지 않는다.
        */
        onUpdate: (self) => {
          // 각성 연출 중에는 핀 구간 밖으로 나가지 못하게 끝 지점에 붙잡아 둔다.
          // 핀이 걸려 있는 구간 안에서의 보정이라 화면상 움직임은 보이지 않는다.
          if (lockExitRef.current && self.progress >= 1) {
            gsap.set(window, { scrollTo: self.end - 1 });
            return;
          }

          const current = desiredSceneRef.current;

          if (gestureLockRef.current) {
            if (Math.abs(self.progress - SCENE_POINTS[current]) < SNAP_EPS) {
              gestureLockRef.current = false;
            }
            return;
          }

          const index = pickSceneIndex(self.progress, self.direction, current);
          if (index === current) return;

          gestureLockRef.current = true;
          desiredSceneRef.current = index;
          if (assetsReadyRef.current) motion?.request(index);
        },
        snap: {
          snapTo: (value: number, self?: ScrollTrigger) => {
            const direction = self?.direction ?? 0;
            // 마지막 장면 뒤 정지 구간에서 아래로 스크롤하면 자유롭게 빠져나간다.
            if (direction > 0 && value > SCENE_POINTS[LAST_SCENE] + SNAP_EPS) {
              snapIndex = LAST_SCENE;
              return value;
            }
            snapIndex = pickSceneIndex(value, direction, desiredSceneRef.current);
            desiredSceneRef.current = snapIndex;
            return SCENE_POINTS[snapIndex];
          },
          duration: { min: 0.2, max: 0.4 },
          delay: 0.04,
          ease: "power2.out",
          // onUpdate에서 이미 시작했더라도 request는 같은 장면이면 아무 일도 하지 않는다.
          onStart: () => {
            if (assetsReadyRef.current) motion?.request(snapIndex);
          },
          onComplete: () => {
            gestureLockRef.current = false;
          },
        },
      });

      if (!prefersReducedMotion()) {
        [marqueeTopRef.current, marqueeBottomRef.current].forEach((track, index) => {
          if (!track) return;
          gsap.to(track, {
            xPercent: index === 0 ? -30 : 26,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.1,
            },
          });
        });
      }
    }, section);

    return () => {
      motion?.destroy();
      ctx.revert();
      triggerRef.current = null;
      motionApiRef.current = null;
    };
  }, [scenes]);



  const glideToChapter = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    if (prefersReducedMotion()) {
      navigateToChapter(id, false);
      return;
    }

    const navOffset = id === "about" ? 66 : 0;
    const y = window.scrollY + target.getBoundingClientRect().top - navOffset;
    chapterPagingRef.current = true;
    gsap.killTweensOf(window);
    gsap.to(window, {
      scrollTo: { y, autoKill: false },
      duration: 0.82,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => {
        chapterPagingRef.current = false;
        history.replaceState(null, "", `#${id}`);
        ScrollTrigger.update();
      },
    });
  };

  // 최종 SSR 화면에서 아래로 한 번 굴리면 ABOUT 첫 장면으로 한 화면씩 넘어간다.
  // HERO 내부의 긴 pin 구간을 자연 스크롤로 빠져나가게 두면 다시 '드륵드륵'한 감각이 생기므로
  // 마지막 장면이 완전히 끝난 순간에만 wheel gesture를 챕터 전환으로 바꾼다.
  useEffect(() => {
    if (sceneIndex !== LAST_SCENE || !acquisitionVisible || !revolutionDone || isTransitioning) return;

    let wheelSum = 0;
    let resetTimer = 0;
    const desktop = window.matchMedia("(min-width: 761px)");

    const onWheel = (event: WheelEvent) => {
      if (!desktop.matches || event.deltaY <= 0) return;

      // 이 리스너는 컴포넌트가 살아 있는 동안 계속 window에 붙어 있으므로,
      // SSR 화면이 실제 viewport에 보일 때만 입력을 가로챈다.
      // ABOUT으로 넘어간 뒤까지 preventDefault가 남으면 ABOUT 첫 장면이 잠기는 문제가 생긴다.
      const stage = stageRef.current;
      if (!stage) return;
      const stageRect = stage.getBoundingClientRect();
      const ssrIsVisible = stageRect.bottom > 1 && stageRect.top < window.innerHeight - 1;
      if (!ssrIsVisible) return;

      // 마지막 SSR이 완성된 뒤의 아래 방향 입력은 이 화면에 잠시 붙잡아 두고
      // 임계값을 넘는 순간 ABOUT으로 한 번에 보낸다. tween 중의 관성 입력도 막는다.
      event.preventDefault();
      if (chapterPagingRef.current) return;

      wheelSum += event.deltaY;
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => { wheelSum = 0; }, 140);
      if (Math.abs(wheelSum) < 28) return;

      wheelSum = 0;
      glideToChapter("about");
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.clearTimeout(resetTimer);
      window.removeEventListener("wheel", onWheel);
    };
  }, [sceneIndex, acquisitionVisible, revolutionDone, isTransitioning]);

  /* ========================================
     NEXT / PREV
  ======================================== */

  const moveToScene = (targetIndex: number) => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    const index = Math.max(
      0,
      Math.min(scenes.length - 1, targetIndex)
    );

    const progress = SCENE_POINTS[index];

    const target = trigger.start + (trigger.end - trigger.start) * progress;

    // 버튼은 스크롤 이동을 기다리지 않고 즉시 전환을 시작한다.
    desiredSceneRef.current = index;
    gestureLockRef.current = true; // 스크롤이 도착하는 동안 의도 판정이 끼어들지 않게
    if (assetsReadyRef.current) motionApiRef.current?.request(index);

    gsap.to(window, {
      scrollTo: target,

      duration: prefersReducedMotion() ? 0 : 0.55,

      ease: "power3.inOut",
    });
  };

  const handlePrev = () => {
    if (sceneIndex === 0 || isTransitioning) return;

    /*
      최종에서 뒤로 가면 다음에 다시
      Revolution을 볼 수 있게 초기화.
    */

    if (sceneIndex === LAST_SCENE) {
      setRevolutionDone(false);
    }

    moveToScene(sceneIndex - 1);
  };

  const handleNext = () => {
    if (isTransitioning) return;

    if (sceneIndex === LAST_SCENE) {
      /*
        Revolution 중에는 프로젝트 이동 금지.
      */

      if (!revolutionDone || isTransitioning) return;

      navigateToChapter(mobileMode ? "about-profile" : "projects");

      return;
    }

    if (mobileMode) levelFeedback.play();
    moveToScene(sceneIndex + 1);
  };

  /* ========================================
     DIALOGUE
  ======================================== */

  const handleSkip = () => {
    navigateToChapter("projects");
  };

  const handleAbout = () => {
    glideToChapter("about");
  };

  const handleCharacter = () => {
    if (isTransitioning) return;

    if (!dialogueOpen) {
      setDialogueOpen(true);
      return;
    }

    setDialogueIndex((prev) => {
      return (prev + 1) % currentScene.dialogue.length;
    });
  };

  return (
    <section
      ref={sectionRef}
      className="yoojinHero"
      id="top"
    >
      <div
        ref={stageRef}
        className={`heroStage scene-${sceneIndex} ${acquisitionVisible ? "isAcquired" : ""}`}
        data-mobile-journey={mobileMode ? "true" : undefined}
      >
        {/* A11Y: 문서의 유일한 h1 + 화면 변화 안내 */}

        <h1 className="srOnly">이유진 — 프론트엔드 개발자 포트폴리오</h1>
        <div className="srOnly" role="status" aria-live="polite" aria-atomic="true">
          {dialogueOpen
            ? `이유진: ${currentScene.dialogue[dialogueIndex]}`
            : `${currentScene.level} / ${pad2(scenes.length)}. ${currentScene.job}. ${currentScene.title}. ${currentScene.phrase}`}
        </div>

        {/* SKIP: 첫 포커스 요소이자, 연출 중에도 항상 보이는 프로젝트 바로가기 */}

        <GrowthJourney index={sceneIndex} complete={acquisitionVisible} />

        {/* IMAGE */}

        <div className="imageStack">
          {scenes.map((scene, index) => (
            <div
              key={scene.image}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className="heroImageLayer"
            >
              <img
                src={scene.image}
                alt={`이유진 캐릭터 이미지 (${scene.level} / ${pad2(scenes.length)})`}
                className="heroImage"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="imageWash" />
        <div ref={ambientRef} className="heroAmbient" aria-hidden="true">
          <span className="ambientItem ambientOrbit"><i /></span>
          <span className="ambientItem ambientStar">{"\u2733"}</span>
          <span className="ambientItem ambientTag">MOTION / {pad2(sceneIndex + 1)}</span>
          <span className="ambientItem ambientCross">{"\uFF0B"}</span>
          <span className="ambientItem ambientDash" />
        </div>
        <div ref={motionRef} className="heroMotion" aria-hidden="true" />

        {/* HEADER */}

        <header className="heroHeader">
          <div className="headerBrand">
            <a href="#top">
              YOOJIN
            </a>

            <span>
              FRONTEND DEVELOPER · REACT / TYPESCRIPT
            </span>
          </div>

          <nav aria-label="주요 메뉴">
            <a href="#about">
              ABOUT
            </a>

            <a href="#contact">
              CONTACT
            </a>
          </nav>
        </header>

        {/* NUMBER */}

        <span
          ref={numberRef}
          className="giantNumber"
          aria-hidden="true"
        >
          {pad2(sceneIndex + 1)}
        </span>

        {/* TYPO */}

        <div className="kineticTypography">
          <div className="keywordMask">
            <div
              ref={keywordRef}
              className="keywordFilled"
              aria-hidden="true"
            >
              {Array.from(currentScene.keyword).map((letter, index) => (
                <span className="keywordLetter" key={index}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
          <span ref={keywordEchoRef} className="keywordEcho" aria-hidden="true">
            {currentScene.keyword}
          </span>
          <div
            ref={outlineRef}
            className="keywordOutline"
            aria-hidden="true"
          >
            {currentScene.outline}
          </div>

          <p
            ref={phraseRef}
            className="scenePhrase"
          >
            {currentScene.phrase}
          </p>
          <span ref={accentRef} className="typeAccent" aria-hidden="true" />
        </div>

        {/* MARQUEE */}

        <div className="marquee marqueeTop" aria-hidden="true">
          <div
            ref={marqueeTopRef}
            className="marqueeTrack"
          >
            {currentScene.marquee}
            {currentScene.marquee}
          </div>
        </div>

        <div className="marquee marqueeBottom" aria-hidden="true">
          <div
            ref={marqueeBottomRef}
            className="marqueeTrack outlineMarquee"
          >
            {currentScene.marquee}
            {currentScene.marquee}
          </div>
        </div>

        {/* CHARACTER */}

        {!mobileMode && (
          <button
            type="button"
            className="characterHitbox"
            aria-disabled={isTransitioning}
            aria-expanded={dialogueOpen}
            onClick={handleCharacter}
            aria-label="이유진 대사 보기"
          >
            <span>
              TAP
            </span>
          </button>
        )}

        {!mobileMode && dialogueOpen && (
          <button
            ref={dialogueRef}
            type="button"
            className="dialogueBox"
            onClick={handleCharacter}
            aria-label={`Yoojin: ${currentScene.dialogue[dialogueIndex]}. Tap for the next line.`}
          >
            <span className="dialogueSpark dialogueSparkOne" aria-hidden="true">{"\u2733"}</span>
            <span className="dialogueSpark dialogueSparkTwo" aria-hidden="true">{"\u2726"}</span>
            <span className="dialogueSpeaker">
              <span className="dialogueAvatar" aria-hidden="true">Y</span>
              <span className="dialogueMeta">
                <small>CHARACTER LOG / {pad2(sceneIndex + 1)}</small>
                <strong>YOOJIN</strong>
              </span>
            </span>
            <span ref={dialogueTextRef} className="dialogueCopy">
              {currentScene.dialogue[dialogueIndex]}
            </span>
            <span className="dialogueAdvance">
              <small>{pad2(dialogueIndex + 1)} / {pad2(currentScene.dialogue.length)}</small>
              <span aria-hidden="true">{"\u2197"}</span>
            </span>
          </button>
        )}

        {/* NAVIGATION */}

        <footer className="heroFooter" aria-label="성장 단계와 프로젝트 이동">
          <GrowthIdentity index={sceneIndex} transitioning={isTransitioning} />
          <button
            type="button"
            className="skipCta"
            onClick={handleSkip}
            aria-label="인트로 건너뛰고 프로젝트 보기"
          >
            <small>SKIP INTRO</small>
            <strong>PROJECTS ↗</strong>
          </button>
        <div className="navigationControl">
          <button
            type="button"
            className="prevControl"
            aria-disabled={sceneIndex === 0 || isTransitioning}
            onClick={handlePrev}
          >
            ←
            <span>
              PREV
            </span>
          </button>

          {sceneIndex === LAST_SCENE && revolutionDone && (
            <button
              type="button"
              className="aboutChapterControl"
              onClick={handleAbout}
              aria-label="이유진 소개 보기"
            >
              <small>NEXT / ABOUT</small>
              <strong>카드 밖의 이야기</strong>
              <span aria-hidden="true">↓</span>
            </button>
          )}

          <button
            type="button"
            className={`nextControl ${mobileMode && levelFeedback.active ? "isMobileLevelUpPressed" : ""} ${
              sceneIndex === LAST_SCENE && !revolutionDone
                ? "isWaiting"
                : ""
            }`}
            aria-disabled={isTransitioning || (sceneIndex === LAST_SCENE && !revolutionDone)}
            onClick={handleNext}
            aria-label={mobileMode && sceneIndex === LAST_SCENE && revolutionDone ? "이유진 소개 보기" : undefined}
          >
            <span className="nextCopy">
              <small>
                {sceneIndex === LAST_SCENE
                  ? revolutionDone ? "NEXT CHAPTER" : "FINAL EVOLUTION"
                  : `NEXT / LV.${pad2(sceneIndex + 1)} → ${pad2(sceneIndex + 2)}`}
              </small>
              <strong>
                {sceneIndex === LAST_SCENE
                  ? revolutionDone ? "VIEW WORK" : "AWAKENING"
                  : "LEVEL UP"}
              </strong>
              <span className="nextDestination">
                {sceneIndex === LAST_SCENE
                  ? revolutionDone ? "프로젝트 보러 가기" : "프론트엔드 개발자로 각성 중"
                  : `${GROWTH[sceneIndex + 1].name} 단계로`}
              </span>
            </span>
            <span className="nextArrow" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none">
                <path className="stepPath" d="M11 49h13V36h13V23h13" />
                <path className="risePath" d="M21 43 48 16M29 16h19v19" />
              </svg>
            </span>
            <span className={`mobileNextCopy ${isTransitioning || sceneIndex === LAST_SCENE ? "mobileNextCopy--korean" : ""}`}>
              {isTransitioning ? "전환 중…" : sceneIndex === LAST_SCENE
                ? revolutionDone ? mobileMode ? "소개 보기" : "작업 보기" : "전환 중…"
                : "LEVEL UP ↑"}
            </span>
            {mobileMode && levelFeedback.active && (
              <span key={levelFeedback.sequence} className="mobileLevelFeedback" aria-hidden="true">
                +1 LEVEL UP<i /><i /><i />
              </span>
            )}
          </button>
        </div>
        </footer>

        {/* SSR */}

        {sceneIndex === LAST_SCENE &&
          acquisitionVisible && (
            <>
            <AcquisitionFireworks />
            <div className="acquisitionFrame" aria-hidden="true" />
            <div className="ssrReward" role="status">
              <small className="ssrEyebrow">RARITY ACQUIRED</small>
              <strong>SSR</strong>
              <div className="ssrRewardStars" aria-hidden="true">
                <span /><span /><span /><span /><span />
              </div>
              <small className="ssrName">이유진 · FRONTEND DEVELOPER</small>
            </div>
            </>
          )}
      </div>
    </section>
  );
}
