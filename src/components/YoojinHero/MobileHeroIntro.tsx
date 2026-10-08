import { LAST_SCENE } from "./heroScenes";
import { MOBILE_SCENES } from "./mobileScenes";
import "./MobileHeroIntro.css";

type Props = {
  onStartJourney: () => void;
  onViewProjects: () => void;
};

export default function MobileHeroIntro({ onStartJourney, onViewProjects }: Props) {
  return (
    <section id="top" className="mobileHeroIntro" aria-label="이유진 프론트엔드 포트폴리오">
      <img className="mobileIntroBackdrop" src={MOBILE_SCENES[LAST_SCENE].image} alt="작업 공간에 앉아 있는 이유진 포트폴리오 캐릭터" fetchPriority="high" decoding="async" />
      <div className="mobileIntroPortrait">
        <div className="mobileIntroBrand" aria-hidden="true"><b>YOOJIN</b><span>FRONTEND PORTFOLIO</span></div>
        <h1 className="mobileIntroIdentity" aria-label="프론트엔드 개발자 이유진">
          <span>FRONTEND DEVELOPER</span>
          <strong>YOOJIN</strong>
        </h1>
      </div>
      <div className="mobileIntroActions">
        <p>비개발자에서 프론트엔드까지,<br />다섯 단계의 성장 기록.</p>
        <button type="button" className="mobileIntroProjects" onClick={onViewProjects}>
          대표 작업 보기 <span aria-hidden="true">↗</span>
        </button>
        <button type="button" className="mobileIntroStart" onClick={onStartJourney}>
          <span className="mobileIntroPlay" aria-hidden="true">▶</span>
          <span className="mobileIntroStartCopy"><strong>유진 키우기 시작</strong><small>눌러서 성장 과정 보기</small></span>
          <span className="mobileIntroStartArrow" aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
