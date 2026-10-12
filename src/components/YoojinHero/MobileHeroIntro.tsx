import { LAST_SCENE } from "./heroScenes";
import { MOBILE_SCENES } from "./mobileScenes";
import MobileMenu from "../common/MobileMenu";
import "./MobileHeroIntro.css";

type Props = {
  onStartJourney: () => void;
  onViewProjects: () => void;
};

export default function MobileHeroIntro({ onStartJourney, onViewProjects }: Props) {
  return (
    <section id="top" className="mobileHeroIntro" aria-label="이유진 프론트엔드 포트폴리오">
      <img
        className="mobileIntroBackdrop"
        src={MOBILE_SCENES[LAST_SCENE].image}
        alt="창가에서 노트북을 보며 커피를 마시는 이유진 포트폴리오 일러스트"
        fetchPriority="high"
        decoding="async"
      />
      <header className="mobileIntroHeader">
        <a href="#top" className="mobileIntroLogo" aria-label="이유진 포트폴리오 첫 화면">
          <img src="/brand/yj-monogram-light.png" alt="YJ" width="161" height="165" />
        </a>
        <MobileMenu light />
      </header>
      <div className="mobileIntroContent">
        <p className="mobileIntroEyebrow">LEE YOOJIN / PORTFOLIO</p>
        <h1 className="mobileIntroTitle"><span className="mobileIntroProfession">FRONTEND DEVELOPER</span><strong>이유진</strong></h1>
        <div className="mobileIntroRule" aria-hidden="true" />
        <p className="mobileIntroDescription">대표 작업과 다섯 단계의 성장 기록을 소개합니다.</p>
        <div className="mobileIntroButtons">
          <button type="button" className="mobileIntroProjects" onClick={onViewProjects}>
            <span>대표 작업 보기</span><span aria-hidden="true">↗</span>
          </button>
          <button type="button" className="mobileIntroStart" onClick={onStartJourney}>
            <span>5단계 성장 보기</span><span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
