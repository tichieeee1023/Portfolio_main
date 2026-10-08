import { SCENES, type Scene } from "./heroScenes";

// Same five stages and dialogue; the mobile artwork has its own portrait framing.
export const MOBILE_SCENES: Scene[] = SCENES.map((scene, index) => ({
  ...scene,
  image: `/assets/profile/yoojin-mo-${String(index).padStart(2, "0")}.webp`,
}));
