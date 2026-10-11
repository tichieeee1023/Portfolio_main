import { LAST_SCENE, SCENES, type Scene } from "./heroScenes";

// Same five stages and dialogue; the mobile artwork has its own portrait framing.
export const MOBILE_SCENES: Scene[] = SCENES.map((scene, index) => ({
  ...scene,
  image: `/assets/profile/yoojin-mo-${String(index).padStart(2, "0")}.webp`,
  // 모바일 성장 연출은 기존 타이포 순서를 유지한다.
  ...(index === LAST_SCENE ? { keyword: "FRONTEND", outline: "DEVELOPER" } : {}),
}));
