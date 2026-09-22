import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import "./YoojinHero.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type Scene = {
  image: string;
  keyword: string;
  outline: string;
  phrase: string;
  marquee: string;
  level: string;
  job: string;
  title: string;
  dialogue: string[];
};

const SCENES: Scene[] = [
  {
    image: "/assets/profile/yoojin-00.webp",
    keyword: "GROW",
    outline: "YOOJIN",
    phrase: "START SMALL. KEEP GOING.",
    marquee:
      "GROW • LEARN • TRY • MAKE • GROW • LEARN • TRY • MAKE • ",
    level: "01",
    job: "LEARNER",
    title: "FIRST STEP",
    dialogue: [
      "아직은 배우는 중이에요.",
      "일단 만들어보는 편입니다.",
      "뭘 만들지 고민하는 시간이 제일 길어요.",
    ],
  },

  {
    image: "/assets/profile/yoojin-01.webp",
    keyword: "CODE",
    outline: "FIRST COMMIT",
    phrase: "HTML / CSS / JAVASCRIPT",
    marquee:
      "HTML • CSS • JAVASCRIPT • CODE • HTML • CSS • JAVASCRIPT • CODE • ",
    level: "02",
    job: "WEB LEARNER",
    title: "FIRST COMMIT",
    dialogue: [
      "일단 코드를 쳐봅니다.",
      "안 되면 다시 해보면 되죠.",
      "처음엔 HTML이 제일 쉬운 줄 알았어요.",
    ],
  },

  {
    image: "/assets/profile/yoojin-02.webp",
    keyword: "LEARN",
    outline: "BUILD",
    phrase: "BUILD. BREAK. REPEAT.",
    marquee:
      "COMPONENT • STATE • REACT • BUILD • BREAK • REPEAT • COMPONENT • ",
    level: "03",
    job: "FRONTEND TRAINEE",
    title: "COMPONENT BUILDER",
    dialogue: [
      "컴포넌트를 나누는 재미를 알아버렸어요.",
      "상태가 바뀌면 화면도 바뀌는 게 재밌어요.",
      "이제 그냥 예쁜 화면만 만들고 싶진 않아요.",
    ],
  },

  {
    image: "/assets/profile/yoojin-03.webp",
    keyword: "KEEP",
    outline: "GOING",
    phrase: "ONE MORE TRY.",
    marquee:
      "INTERACTION • DEBUG • COFFEE • AGAIN • INTERACTION • DEBUG • ",
    level: "04",
    job: "FRONTEND TRAINEE",
    title: "UI TINKERER",
    dialogue: [
      "커피는 기능 구현에 포함됩니다.",
      "조금만 더 하면 될 것 같아요.",
      "인터랙션 넣다가 시간이 사라졌어요.",
    ],
  },

  {
    image: "/assets/profile/yoojin-04.webp",
    keyword: "FRONTEND",
    outline: "DEVELOPER",
    phrase: "INTERACTION MAKER",
    marquee:
      "FRONTEND • REACT • TYPESCRIPT • INTERACTION • FRONTEND • REACT • ",
    level: "05",
    job: "FRONTEND DEVELOPER",
    title: "INTERACTION MAKER",
    dialogue: [
      "화면이 반응하는 순간을 좋아합니다.",
      "이제 제가 만든 프로젝트도 보여드릴게요.",
      "안녕하세요. 프론트엔드 개발자 이유진입니다.",
    ],
  },
];

export default function YoojinHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const keywordRef = useRef<HTMLHeadingElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLParagraphElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  const marqueeTopRef = useRef<HTMLDivElement>(null);
  const marqueeBottomRef = useRef<HTMLDivElement>(null);

  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [sceneIndex, setSceneIndex] = useState(0);

  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [revolutionActive, setRevolutionActive] = useState(false);
  const [revolutionDone, setRevolutionDone] = useState(false);

  const currentScene = SCENES[sceneIndex];

  /* ========================================
     PRELOAD
  ======================================== */

  useEffect(() => {
    SCENES.forEach((scene) => {
      const image = new Image();
      image.src = scene.image;
    });
  }, []);

  /* ========================================
     MAIN SCROLL
  ======================================== */

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;

    if (!section || !stage) return;

    const ctx = gsap.context(() => {
      imageRefs.current.forEach((image, index) => {
        if (!image) return;

        gsap.set(image, {
          opacity: index === 0 ? 1 : 0,

          clipPath:
            index === 0
              ? "inset(0% 0% 0% 0%)"
              : "inset(0% 100% 0% 0%)",

          zIndex: index === 0 ? 2 : 1,
        });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: "top top",

          /*
            마지막 장면 체류 시간을 길게 확보
          */
          end: "+=760%",

          pin: stage,

          scrub: 0.65,

          anticipatePin: 1,

          /*
            마지막을 바로 100%로 snap 하지 않음.
            72%부터 끝까지 최종 화면 체류.
          */
          snap: {
            snapTo: [0, 0.18, 0.36, 0.54, 0.72],

            duration: {
              min: 0.2,
              max: 0.5,
            },

            delay: 0.06,

            ease: "power2.inOut",
          },

          onUpdate: (self) => {
            const p = self.progress;

            let nextIndex = 0;

            if (p >= 0.18) nextIndex = 1;
            if (p >= 0.36) nextIndex = 2;
            if (p >= 0.54) nextIndex = 3;
            if (p >= 0.72) nextIndex = 4;

            setSceneIndex(nextIndex);
          },
        },
      });

      /*
        전환은 이미지 흔들지 않고
        좌우 마스크로만.
      */

      const starts = [0, 0.18, 0.36, 0.54, 0.72];

      for (let index = 1; index < SCENES.length; index++) {
        const previous = imageRefs.current[index - 1];
        const next = imageRefs.current[index];

        if (!previous || !next) continue;

        /*
          GSAP timeline 자체는 0~4 길이를 사용하고
          ScrollTrigger progress와는 별개.
        */
        const start = index;

        const fromRight = index % 2 !== 0;

        timeline.set(
          next,
          {
            zIndex: 3,
          },
          start - 0.05
        );

        timeline.fromTo(
          next,
          {
            opacity: 1,

            clipPath: fromRight
              ? "inset(0% 0% 0% 100%)"
              : "inset(0% 100% 0% 0%)",
          },
          {
            opacity: 1,

            clipPath: "inset(0% 0% 0% 0%)",

            duration: 0.72,

            ease: "power4.out",
          },
          start
        );

        timeline.to(
          previous,
          {
            opacity: 0,

            duration: 0.4,

            ease: "power2.out",
          },
          start + 0.22
        );
      }

      triggerRef.current = timeline.scrollTrigger ?? null;

      if (marqueeTopRef.current) {
        gsap.to(marqueeTopRef.current, {
          xPercent: -30,

          ease: "none",

          scrollTrigger: {
            trigger: section,

            start: "top top",
            end: "bottom bottom",

            scrub: 1.1,
          },
        });
      }

      if (marqueeBottomRef.current) {
        gsap.to(marqueeBottomRef.current, {
          xPercent: 26,

          ease: "none",

          scrollTrigger: {
            trigger: section,

            start: "top top",
            end: "bottom bottom",

            scrub: 1.1,
          },
        });
      }

      void starts;
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  /* ========================================
     TYPO / HUD
  ======================================== */

  useEffect(() => {
    setDialogueOpen(false);
    setDialogueIndex(0);

    if (
      !keywordRef.current ||
      !outlineRef.current ||
      !phraseRef.current ||
      !numberRef.current
    ) {
      return;
    }

    const tl = gsap.timeline();

    tl.fromTo(
      keywordRef.current,
      {
        yPercent: 110,
        opacity: 0,
      },
      {
        yPercent: 0,
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
        opacity: sceneIndex === 4 ? 0 : 0.12,

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

    /*
      마지막 진입.
      기존 1.5초 → 2.8초.
    */

    if (sceneIndex === 4 && !revolutionDone) {
      setRevolutionActive(true);

      const timer = window.setTimeout(() => {
        setRevolutionActive(false);
        setRevolutionDone(true);
      }, 2800);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [sceneIndex, revolutionDone]);

  /* ========================================
     FINAL SCROLL LOCK

     SSR 획득 후 아래 방향 휠만 막음.
     위로 스크롤은 허용.
  ======================================== */

  useEffect(() => {
    if (sceneIndex !== 4 || !revolutionDone) return;

    const blockDownScroll = (event: WheelEvent) => {
      /*
        아래로 스크롤만 차단.
        위로 돌리면 이전 카드로 복귀 가능.
      */
      if (event.deltaY > 0) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", blockDownScroll, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", blockDownScroll);
    };
  }, [sceneIndex, revolutionDone]);

  /* ========================================
     NEXT / PREV
  ======================================== */

  const moveToScene = (targetIndex: number) => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    const index = Math.max(
      0,
      Math.min(SCENES.length - 1, targetIndex)
    );

    /*
      마지막 위치를 72%에 배치.
      100%로 보내지 않음.
    */

    const points = [0, 0.18, 0.36, 0.54, 0.72];

    const progress = points[index];

    const target =
      trigger.start +
      (trigger.end - trigger.start) * progress;

    gsap.to(window, {
      scrollTo: target,

      duration: 0.8,

      ease: "power3.inOut",
    });
  };

  const handlePrev = () => {
    /*
      최종에서 뒤로 가면 다음에 다시
      Revolution을 볼 수 있게 초기화.
    */

    if (sceneIndex === 4) {
      setRevolutionDone(false);
      setRevolutionActive(false);
    }

    moveToScene(sceneIndex - 1);
  };

  const handleNext = () => {
    if (sceneIndex === 4) {
      /*
        Revolution 중에는 프로젝트 이동 금지.
      */

      if (!revolutionDone) return;

      document
        .querySelector("#projects")
        ?.scrollIntoView({
          behavior: "smooth",
        });

      return;
    }

    moveToScene(sceneIndex + 1);
  };

  /* ========================================
     DIALOGUE
  ======================================== */

  const handleCharacter = () => {
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
        className={`heroStage scene-${sceneIndex}`}
      >
        {/* IMAGE */}

        <div className="imageStack">
          {SCENES.map((scene, index) => (
            <div
              key={scene.image}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className="heroImageLayer"
            >
              <img
                src={scene.image}
                alt=""
                className="heroImage"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="imageWash" />

        {/* HEADER */}

        <header className="heroHeader">
          <div className="headerBrand">
            <a href="#top">
              YOOJIN
            </a>

            <span>
              FRONTEND DEVELOPER
            </span>
          </div>

          <nav>
            <a href="#about">
              ABOUT
            </a>

            <a href="#projects">
              PROJECTS
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
        >
          0{sceneIndex + 1}
        </span>

        {/* TYPO */}

        <div className="kineticTypography">
          <div className="keywordMask">
            <h1
              ref={keywordRef}
              className="keywordFilled"
            >
              {currentScene.keyword}
            </h1>
          </div>

          <div
            ref={outlineRef}
            className="keywordOutline"
          >
            {currentScene.outline}
          </div>

          <p
            ref={phraseRef}
            className="scenePhrase"
          >
            {currentScene.phrase}
          </p>
        </div>

        {/* MARQUEE */}

        <div className="marquee marqueeTop">
          <div
            ref={marqueeTopRef}
            className="marqueeTrack"
          >
            {currentScene.marquee}
            {currentScene.marquee}
          </div>
        </div>

        <div className="marquee marqueeBottom">
          <div
            ref={marqueeBottomRef}
            className="marqueeTrack outlineMarquee"
          >
            {currentScene.marquee}
            {currentScene.marquee}
          </div>
        </div>

        {/* CHARACTER */}

        <button
          type="button"
          className="characterHitbox"
          onClick={handleCharacter}
          aria-label="이유진 대사 보기"
        >
          <span>
            TAP
          </span>
        </button>

        {dialogueOpen && (
          <button
            type="button"
            className="dialogueBox"
            onClick={handleCharacter}
          >
            <strong>
              YOOJIN
            </strong>

            <p>
              {currentScene.dialogue[dialogueIndex]}
            </p>

            <span>
              TAP ↘
            </span>
          </button>
        )}

        {/* NAVIGATION */}

        <div className="navigationControl">
          <button
            type="button"
            className="prevControl"
            disabled={sceneIndex === 0}
            onClick={handlePrev}
          >
            ←
            <span>
              PREV
            </span>
          </button>

          <button
            type="button"
            className={`nextControl ${
              sceneIndex === 4 && !revolutionDone
                ? "isWaiting"
                : ""
            }`}
            onClick={handleNext}
          >
            <div>
              <small>
                {sceneIndex === 4
                  ? revolutionDone
                    ? "PORTFOLIO"
                    : "FINAL EVOLUTION"
                  : `0${sceneIndex + 2} / 05`}
              </small>

              <strong>
                {sceneIndex === 4
                  ? revolutionDone
                    ? "VIEW PROJECTS"
                    : "EVOLVING..."
                  : "NEXT"}
              </strong>
            </div>

            <span className="nextArrow">
              →
            </span>
          </button>
        </div>

        {/* SLIM STATUS BAR */}

        <footer className="gameFooter">
          <div className="footerLevel">
            <span className="footerMiniLabel">
              LEVEL
            </span>

            <div className="levelNumber">
              <span>
                LV.
              </span>

              <strong>
                {currentScene.level}
              </strong>
            </div>
          </div>

          <div className="footerInfo">
            <div className="footerInfoItem">
              <span className="footerMiniLabel">
                JOB
              </span>

              <strong>
                {currentScene.job}
              </strong>
            </div>

            <div className="footerDivider" />

            <div className="footerInfoItem">
              <span className="footerMiniLabel">
                TITLE
              </span>

              <strong>
                {currentScene.title}
              </strong>
            </div>
          </div>
        </footer>

        {/* REVOLUTION */}

        {revolutionActive && (
          <div className="revolutionScreen">
            <span className="revolutionSmall">
              FINAL AWAKENING
            </span>

            <strong className="revolutionTitle">
              REVOLUTION!
            </strong>

            <div className="revolutionRings">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}

        {/* SSR */}

        {sceneIndex === 4 &&
          revolutionDone && (
            <div className="ssrReward">
              <div className="ssrRewardStars">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>

              <strong>
                SSR
              </strong>

              <small>
                NEW CARD ACQUIRED
              </small>
            </div>
          )}
      </div>
    </section>
  );
}