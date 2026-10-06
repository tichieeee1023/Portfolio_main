import type { TransitionKind } from "./heroMotion";

export type Scene = {
  image: string;
  /** 이 장면으로 "들어올 때" 재생되는 전환 연출 */
  transition: TransitionKind;
  keyword: string;
  outline: string;
  phrase: string;
  marquee: string;
  level: string;
  job: string;
  title: string;
  dialogue: string[];
};

export const SCENES: Scene[] = [
  {
    image: "/assets/profile/yoojin-00.webp",
    transition: "cut",
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
    transition: "cut",
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
    transition: "blinds",
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
    transition: "shards",
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
    transition: "awakening",
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

export const LAST_SCENE = SCENES.length - 1;

/*
  스크롤 배치: 장면 사이 간격은 정확히 1화면(SCENE_GAP),
  마지막 장면 뒤에는 짧은 정지 구간(END_HOLD)을 둔다.
  정지 구간에서는 화면이 핀으로 고정돼 있어서, 각성 연출 중에 관성 스크롤이
  이어져도 SSR 장면이 곧바로 밀려 나가지 않는다.
*/
const SCENE_GAP = 1; // 화면 높이 단위
const END_HOLD = 0.4; // 화면 높이 단위
const TOTAL = (SCENES.length - 1) * SCENE_GAP + END_HOLD;

/** 핀 구간 진행도(0~1) 위에서 각 장면이 놓이는 지점 */
export const SCENE_POINTS = SCENES.map((_, i) => (i * SCENE_GAP) / TOTAL);

/** 핀 구간 길이 */
export const SCROLL_END = `+=${Math.round(TOTAL * 100)}%`;
