import { Fragment, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { navigateToChapter } from './chapterNavigation';
import { buildAboutTimeline } from './aboutMotion';
import { aboutPagerLabels, chapters, pad, skillGroups, SKILL_TOTAL, TOTAL } from './chapterData';
import './PortfolioChapters.css';
import SelectedWorkMagazine from '../SelectedWorkMagazine/SelectedWorkMagazine';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/** sticky 내비 높이(데스크톱). CSS의 .chapterNav height, scroll-margin-top과 맞춰야 한다. */
const NAV_HEIGHT = 66;
/** 배경이 어두운 챕터. TOP 버튼 색을 반전시키는 데 쓴다. */
const DARK_CHAPTERS = new Set(['experiments', 'contact']);

function SectionHeading({ id, number, eyebrow, title, description }: { id: string; number: string; eyebrow: string; title: string; description: string }) {
  // 글자 단위로 쪼개면 한글 단어 중간에서 줄이 바뀌므로 "단어 단위"로 마스크 처리한다.
  const words = title.split(' ');
  return <div className="chapterHeading" data-no={number} data-reveal>
    <div className="chapterHeadingTop"><span>{number} / {TOTAL}</span><span>{eyebrow}</span></div>
    <h2 id={id}>
      {words.map((word, index) => {
        const last = index === words.length - 1;
        return <Fragment key={index}>
          {index > 0 && ' '}
          <span className={'hWord' + (last ? ' hWord--outline' : '')}>
            <span className="hWordInner">{word}{last && <span className="chapterDot">.</span>}</span>
          </span>
        </Fragment>;
      })}
    </h2>
    <p>{description}</p>
  </div>;
}

/** 히어로의 마키 문법을 가져온 띠. 같은 문장을 두 번 이어 붙여 -50% 이동으로 끊김 없이 순환한다. */
function Marquee({ text, repeat = 8, variant }: { text: string; repeat?: number; variant?: 'outline' }) {
  const unit = (text + ' • ').repeat(repeat);
  return <div className={'chapterSeam' + (variant ? ' chapterSeam--' + variant : '')} aria-hidden="true">
    <div className="chapterSeamTrack">{unit}{unit}</div>
  </div>;
}

type ScrollApi = {
  toAboutScreen: (index: number) => void;
  toTop: () => void;
};

export default function PortfolioChapters() {
  const root = useRef<HTMLElement>(null);
  // 이펙트 안의 스크롤 함수(진행 중인 트윈/휠 잠금 상태를 공유)를 이벤트 핸들러에서 호출하기 위한 통로
  const scrollApi = useRef<ScrollApi | null>(null);
  const [active, setActive] = useState('about');
  const [activeAboutScreen, setActiveAboutScreen] = useState(0);
  const [showAboutPager, setShowAboutPager] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const host = root.current;
    if (!host) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktopQuery = window.matchMedia('(min-width: 761px)');
    const panels = Array.from(host.querySelectorAll<HTMLElement>('.chapter'));
    const aboutSection = host.querySelector<HTMLElement>('.chapterAbout');
    const aboutScreens = Array.from(host.querySelectorAll<HTMLElement>('.aboutScreen'));
    let disposed = false;

    /* ------------------------------------------------------------------
       스크롤 이동 (GSAP 한 곳으로 모은다)
       - 진행 여부는 '내가 만든 플래그'가 아니라 window를 움직이는 트윈이 살아 있는지로 판단한다.
         플래그 방식은 다른 곳에서 트윈을 kill하면 onComplete가 안 불려서
         '휠이 영영 먹통'이 되는 문제가 있었다.
       - 히어로의 glideToChapter 같은 다른 컴포넌트의 스크롤 트윈도 같이 본다.
         (그 트윈 도중에 끼어들어 kill하면 히어로 쪽 잠금이 풀리지 않을 수 있다)
       - autoKill:false → 트랙패드 관성 휠이 이동을 끊지 못하게 한다. (히어로와 같은 방식)
    ------------------------------------------------------------------ */
    let pageTween: gsap.core.Tween | null = null;
    const isWindowTweening = () => gsap.getTweensOf(window).some((tween) => tween.isActive());

    const scrollWindowTo = (y: number, duration: number) => {
      gsap.killTweensOf(window);
      if (reduced) {
        window.scrollTo({ top: y });
        return;
      }
      pageTween = gsap.to(window, {
        scrollTo: { y, autoKill: false },
        duration,
        ease: 'power3.inOut',
        overwrite: true,
        onComplete: () => ScrollTrigger.update(),
      });
    };

    /* ------------------------------------------------------------------
       ABOUT 휠 페이징 (한 번의 휠 제스처 = 한 장면)
    ------------------------------------------------------------------ */
    const WHEEL_GESTURE_GAP = 120; // 이 시간(ms) 이상 휠이 멈췄다 다시 들어오면 '새 제스처'
    const WHEEL_THRESHOLD = 28;
    let lastWheelAt = 0;
    let wheelSum = 0;
    let gestureUsed = false; // 이번 제스처로 이미 장면을 넘겼거나 막았는가 (관성 휠이 연속 전환을 만들지 않게)

    // 현재 장면 = 위쪽이 내비 아래 선에 닿았거나 지나간 마지막 장면
    const currentAboutIndex = () => {
      let index = 0;
      aboutScreens.forEach((screen, i) => {
        if (screen.getBoundingClientRect().top <= NAV_HEIGHT + 8) index = i;
      });
      return index;
    };

    const scrollToAboutScreen = (index: number) => {
      const screen = aboutScreens[index];
      if (!screen) return;
      gestureUsed = true;
      wheelSum = 0;
      const y = window.scrollY + screen.getBoundingClientRect().top - NAV_HEIGHT;
      scrollWindowTo(y, 0.78);
    };

    const scrollToTop = () => scrollWindowTo(0, 0.9);

    const handleWheelPaging = (event: WheelEvent) => {
      if (event.ctrlKey) return; // 트랙패드 핀치 줌은 막지 않는다
      if (!aboutSection || aboutScreens.length === 0 || !desktopQuery.matches) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      // Firefox 등은 deltaMode가 line/page라 값이 훨씬 작게 들어온다
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const delta = event.deltaY * unit;
      const direction = Math.sign(delta);
      if (!direction) return;

      const sectionRect = aboutSection.getBoundingClientRect();
      const viewportCenter = window.innerHeight * 0.5;
      if (sectionRect.top > viewportCenter || sectionRect.bottom < viewportCenter) return;

      // 새 제스처인지 판단
      const now = performance.now();
      if (now - lastWheelAt > WHEEL_GESTURE_GAP) {
        gestureUsed = false;
        wheelSum = 0;
      }
      lastWheelAt = now;

      // 스크롤 트윈이 도는 중(내 장면 전환, 히어로에서 ABOUT으로 내려오는 중 등)에는 개입하지 않고 입력만 삼킨다.
      // 끝난 뒤 남은 관성 휠이 곧바로 다음 장면으로 넘어가지 않도록 제스처도 소진 처리한다.
      if (isWindowTweening()) {
        event.preventDefault();
        gestureUsed = true;
        return;
      }

      const current = currentAboutIndex();
      const rect = aboutScreens[current].getBoundingClientRect();
      const offset = rect.top - NAV_HEIGHT; // >0: 아직 내려오는 중, <0: 이미 지나친 상태

      // 낮은 화면(노트북 등)에서 장면 내용이 viewport보다 길면, 끝까지는 일반 스크롤로 읽게 둔다.
      if (rect.height > window.innerHeight - NAV_HEIGHT + 8) {
        if (direction > 0 && rect.bottom > window.innerHeight + 2) { gestureUsed = true; return; }
        if (direction < 0 && offset < -2) { gestureUsed = true; return; }
      }

      let target: number;
      if (direction > 0) {
        if (current === aboutScreens.length - 1) return; // 마지막 장면에서 아래로 → WORK로 자연스럽게
        target = offset > 8 ? current : current + 1;      // 장면이 아직 정렬 전이면 먼저 제자리에 맞춘다
      } else {
        target = offset < -8 ? current : current - 1;
        if (target < 0) return;                           // 첫 장면에서 위로 → HERO로 자연스럽게
      }

      event.preventDefault();
      if (gestureUsed) return;

      if (Math.sign(wheelSum) !== direction) wheelSum = 0;
      wheelSum += delta;
      if (Math.abs(wheelSum) < WHEEL_THRESHOLD) return;

      scrollToAboutScreen(target);
    };

    // non-passive wheel 리스너는 페이지 전체 휠 스크롤을 메인 스레드에 묶어두므로,
    // ABOUT이 화면에 있을 때만 붙인다.
    let wheelBound = false;
    const bindWheel = (on: boolean) => {
      if (on === wheelBound) return;
      wheelBound = on;
      if (on) window.addEventListener('wheel', handleWheelPaging, { passive: false });
      else window.removeEventListener('wheel', handleWheelPaging);
    };

    scrollApi.current = { toAboutScreen: scrollToAboutScreen, toTop: scrollToTop };

    /* ------------------------------------------------------------------
       Observers
    ------------------------------------------------------------------ */
    // 상단 내비: 지금 읽고 있는 챕터
    const chapterObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.2, 0.5] });
    panels.forEach((panel) => chapterObserver.observe(panel));

    // ABOUT 왼쪽 스텝 내비 / 페이저 노출 / 휠 페이징 on-off
    let aboutScreenObserver: IntersectionObserver | null = null;
    let aboutSectionObserver: IntersectionObserver | null = null;
    if (aboutSection && aboutScreens.length) {
      aboutScreenObserver = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = aboutScreens.indexOf(visible.target as HTMLElement);
        if (index >= 0) setActiveAboutScreen(index);
      }, { threshold: [0.25, 0.5, 0.72], rootMargin: '-66px 0px -8% 0px' });
      aboutScreens.forEach((screen) => aboutScreenObserver?.observe(screen));

      aboutSectionObserver = new IntersectionObserver(([entry]) => {
        const inView = Boolean(entry?.isIntersecting);
        setShowAboutPager(inView);
        if (!reduced) bindWheel(inView);
      }, { threshold: 0.02, rootMargin: '-66px 0px -6% 0px' });
      aboutSectionObserver.observe(aboutSection);
    }

    // HERO가 화면에서 벗어나면 우하단 TOP 버튼을 노출한다.
    let heroVisibilityObserver: IntersectionObserver | null = null;
    const heroSection = document.getElementById('top');
    if (heroSection) {
      heroVisibilityObserver = new IntersectionObserver(([entry]) => {
        setShowTopButton(!entry?.isIntersecting);
      }, { threshold: 0.08 });
      heroVisibilityObserver.observe(heroSection);
    }

    /* ------------------------------------------------------------------
       GSAP: 진행 바 / 챕터 reveal / ABOUT 모션 타임라인
    ------------------------------------------------------------------ */
    const aboutTimelines = new Map<HTMLElement, gsap.core.Timeline>();

    const context = gsap.context(() => {
      const bar = host.querySelector<HTMLElement>('.chapterProgress');
      if (bar) {
        const setProgress = gsap.quickSetter(bar, 'scaleX') as (value: number) => void;
        ScrollTrigger.create({
          trigger: host, start: 'top top', end: 'bottom bottom',
          onUpdate: (self) => setProgress(self.progress),
        });
      }
      if (reduced) return;

      // ABOUT 장면 모션은 여기서 '멈춘 채로' 미리 만들어 둔다(깜빡임 방지). 재생은 아래 Observer가 한다.
      aboutScreens.slice(1).forEach((screen) => {
        const tl = buildAboutTimeline(screen);
        if (tl) aboutTimelines.set(screen, tl);
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        // 챕터 제목: 히어로 키워드와 같은 이징(power4/expo)과 skew로 단어가 솟아오른다.
        if (element.classList.contains('chapterHeading')) {
          const tl = gsap.timeline({ scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
          tl.from(element.querySelector('.chapterHeadingTop'), { opacity: 0, y: 14, duration: 0.5, ease: 'power3.out', clearProps: 'transform,opacity' }, 0)
            .from(element.querySelectorAll('.hWordInner'), { yPercent: 110, skewX: -8, opacity: 0, duration: 0.85, ease: 'power4.out', stagger: 0.07, clearProps: 'transform,opacity' }, 0.05)
            .from(element.querySelector('p'), { y: 18, opacity: 0, duration: 0.6, ease: 'power2.out', clearProps: 'transform,opacity' }, 0.35)
            .fromTo(element, { '--ghostX': '48px', '--ghostO': 0 }, { '--ghostX': '0px', '--ghostO': 1, duration: 1, ease: 'expo.out', clearProps: '--ghostX,--ghostO' }, 0);
          return;
        }
        // 마지막 챕터의 큰 제목도 같은 결로 등장
        if (element.tagName === 'H2') {
          gsap.from(element, {
            yPercent: 22, skewX: -7, opacity: 0, duration: 1, ease: 'expo.out',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          });
          return;
        }
        gsap.from(element, {
          y: 26,
          opacity: 0,
          duration: 0.82,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>('.workCard').forEach((card) => {
        const image = card.querySelector('.workCardImage img');
        if (!image) return;
        gsap.fromTo(image, { scale: 1.08 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        });
      });
      // 프로젝트 이미지는 히어로의 컷처럼 사선으로 열린다.
      gsap.utils.toArray<HTMLElement>('.workCardImage').forEach((frame) => {
        gsap.fromTo(frame,
          { clipPath: 'polygon(0 0, 0 0, -25% 100%, 0 100%)' },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.1, ease: 'expo.out',
            clearProps: 'clipPath',
            scrollTrigger: { trigger: frame, start: 'top 85%', once: true },
          });
      });
    }, host);

    // 장면이 화면 가운데 띠에 닿으면 재생한다.
    // 예전처럼 '장면의 42% 이상이 보일 때'로 잡으면, 모바일처럼 장면이 세로로 아주 긴 경우
    // 비율이 끝내 0.42에 못 닿아 모션이 영영 안 돌 수 있다. 띠(band)와 겹치는지만 보면 장면 높이와 무관하다.
    let aboutMotionObserver: IntersectionObserver | null = null;
    if (aboutTimelines.size) {
      const played = new WeakSet<Element>();
      aboutMotionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || played.has(entry.target)) return;
          played.add(entry.target);
          entry.target.classList.add('about-motion-played');
          aboutTimelines.get(entry.target as HTMLElement)?.play();
          aboutMotionObserver?.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: '-35% 0px -22% 0px' });
      aboutTimelines.forEach((_, screen) => aboutMotionObserver?.observe(screen));
    }

    /* ------------------------------------------------------------------
       앵커 링크 / 해시
    ------------------------------------------------------------------ */
    // 이 컴포넌트 안에 있는 요소만 대상으로 한다 (#top은 히어로라 따로 처리)
    const resolveTarget = (id: string) => {
      const targetId = ['work-moonlight', 'work-harvest', 'work-b612'].includes(id) ? 'projects' : id;
      const element = targetId ? document.getElementById(targetId) : null;
      return element && host.contains(element) ? element : null;
    };

    const handleLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute('href')?.slice(1);
      if (!id) return;

      if (id === 'top') {
        event.preventDefault();
        scrollToTop();
        history.replaceState(null, '', location.pathname + location.search);
        return;
      }
      if (!resolveTarget(id)) return;
      event.preventDefault();
      pageTween?.kill(); // 진행 중이던 ABOUT 장면 이동과 네이티브 스크롤이 겹치지 않게
      navigateToChapter(id);
    };

    const handleHashChange = () => {
      const id = location.hash.slice(1);
      if (resolveTarget(id)) navigateToChapter(id, false);
    };

    // 주소에 #hash가 있는 채로 열었을 때 폰트/레이아웃이 자리잡는 동안 위치를 다시 맞춘다.
    // 단, 사용자가 이미 스크롤을 시작했다면 건드리지 않는다(늦게 로드된 폰트가 화면을 되돌려 놓는 것 방지).
    let userMoved = false;
    const markMoved = () => { userMoved = true; };
    const movedEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    movedEvents.forEach((type) => window.addEventListener(type, markMoved, { passive: true, once: true }));

    const settleHash = () => {
      if (disposed || userMoved) return;
      handleHashChange();
    };

    host.addEventListener('click', handleLink);
    window.addEventListener('hashchange', handleHashChange);
    const frame = requestAnimationFrame(settleHash);
    const settledHash = window.setTimeout(settleHash, 650);
    void document.fonts.ready.then(() => {
      if (disposed) return;
      ScrollTrigger.refresh(); // 폰트 적용 후 제목 높이가 바뀌므로 트리거 위치를 다시 계산
      settleHash();
    });

    return () => {
      disposed = true;
      scrollApi.current = null;
      cancelAnimationFrame(frame);
      window.clearTimeout(settledHash);
      movedEvents.forEach((type) => window.removeEventListener(type, markMoved));
      host.removeEventListener('click', handleLink);
      window.removeEventListener('hashchange', handleHashChange);
      bindWheel(false);
      chapterObserver.disconnect();
      aboutScreenObserver?.disconnect();
      aboutSectionObserver?.disconnect();
      heroVisibilityObserver?.disconnect();
      aboutMotionObserver?.disconnect();
      pageTween?.kill();
      gsap.killTweensOf(window);
      aboutScreens.forEach((screen) => screen.classList.remove('about-motion-played'));
      context.revert();
    };
  }, []);

  const scrollToAboutScreen = (index: number) => {
    if (scrollApi.current) scrollApi.current.toAboutScreen(index);
    else document.querySelectorAll('.aboutScreen')[index]?.scrollIntoView({ block: 'start' });
  };

  const scrollToTop = () => {
    if (scrollApi.current) scrollApi.current.toTop();
    else window.scrollTo({ top: 0 });
  };

  return <main ref={root} className="portfolioChapters" aria-label="이유진 포트폴리오">
    <button
      type="button"
      className={'topButton' + (showTopButton ? ' is-visible' : '')}
      data-tone={DARK_CHAPTERS.has(active) ? 'dark' : 'light'}
      onClick={scrollToTop}
      aria-label="포트폴리오 맨 위로 이동"
    >
      <span aria-hidden="true">↑</span>
      <small>TOP</small>
    </button>
    <Marquee text="STAGE CLEAR • NEXT CHAPTER" />
    <nav className="chapterNav" aria-label="포트폴리오 목차">
      <a className="chapterBrand" href="#top" aria-label="맨 위로">Y<span>.</span></a>
      <div className="chapterNavLinks">
        {chapters.map((chapter, index) => <a key={chapter.id} href={'#' + chapter.id} aria-current={active === chapter.id ? 'location' : undefined}><span>{pad(index + 1)}</span>{chapter.label}</a>)}
      </div>
      <a className="chapterNavContact" href="mailto:curencandy001@gmail.com">LET’S TALK <span aria-hidden="true">↗</span></a>
      <div className="chapterProgress" aria-hidden="true" />
    </nav>

    <nav className={'aboutPager' + (showAboutPager ? ' is-visible' : '')} aria-label="ABOUT 장면 이동">
      {aboutPagerLabels.map((label, index) => (
        <button
          key={label}
          type="button"
          className={activeAboutScreen === index ? 'is-active' : ''}
          onClick={() => scrollToAboutScreen(index)}
          aria-current={activeAboutScreen === index ? 'step' : undefined}
          aria-label={`${index + 1}. ${label}`}
        >
          <span className="aboutPagerNumber">{index + 1}</span>
          <span className="aboutPagerDot" aria-hidden="true" />
        </button>
      ))}
    </nav>

    <section id="about" className="chapter chapterAbout" aria-labelledby="about-title">
      <div className="chapterShell chapterShell--about">
        <div className="aboutScreen aboutScreen--cover">
          <SectionHeading id="about-title" number="01" eyebrow="THE PERSON BEHIND THE CARD" title="카드 밖의 이야기" description="화면을 만드는 방식에는, 지금까지 읽고 만들고 다듬어온 시간이 담겨 있습니다." />
          <div className="aboutScrollCue" aria-hidden="true"><span>SCROLL TO READ</span><i /></div>
        </div>

        <div className="aboutScreen aboutScreen--profile">
          <div className="aboutGrid">
            <div className="aboutPortrait">
              <div className="aboutPortraitImage"><img src="/assets/profile/yoojin-04.webp" alt="프론트엔드 개발자 이유진의 포트폴리오 캐릭터" loading="lazy" decoding="async" /></div>
              <div className="aboutPortraitMeta"><span>CHARACTER FILE / LEE YOOJIN</span><span>FRONTEND DEVELOPER</span></div>
            </div>
            <div className="aboutStory">
              <p className="aboutKicker">READ → INTERPRET → BUILD</p>
              <h3 className="aboutHeadline" aria-label="모호한 요구사항 속에서 본질을 찾아, 사용하기 편한 명료한 화면으로 번역합니다.">
                <span className="aboutHeadlineLine">모호한 요구사항 속에서</span>
                <span className="aboutHeadlineLine">본질을 찾아,</span>
                <span className="aboutHeadlineLine">사용하기 편한</span>
                <span className="aboutHeadlineLine">명료한 화면으로</span>
                <span className="aboutHeadlineLine aboutHeadlineAccent">번역합니다.</span>
              </h3>
              <p className="aboutLead">언어와 문학을 전공하고 번역하며 맥락과 의도를 읽는 법을 익혔습니다. 자영업을 하며 아이디어를 실제 결과물로 옮겼습니다.</p>
              <p className="aboutLead aboutLead--strong">아이디어가 떠오르면 직접 구현해보고, 테스트하며, 반복해서 개선합니다.</p>
              <div className="aboutTraits">
                <span><b>01</b> 본질을 읽는 구조화</span>
                <span><b>02</b> 의미를 형태로 바꾸는 재해석</span>
                <span><b>03</b> 반복해서 다듬는 개선</span>
              </div>
              <a className="textLink" href="#projects">만든 것들 보기 <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>

        <div className="aboutScreen aboutScreen--transcreation">
          <div className="aboutDetail aboutTranscreation">
            <div className="aboutDetailHead">
              <span>01 / TRANSCREATION</span>
              <span>TRANSLATION + CREATION</span>
            </div>
            <div className="transcreationTitle" role="img" aria-label="Translation plus Creation equals Transcreation">
              <span>TRANS<span className="transcreationLight">LATION</span></span>
              <b aria-hidden="true">+</b>
              <span>CREATION</span>
            </div>
            <div className="transcreationResult">
              <p>읽고 해석하는 힘과,<br />직접 만들어내는 힘.</p>
              <strong>TRANS<em>CREATION</em></strong>
            </div>
            <div className="transcreationNotes">
              <article>
                <span>TRANSLATION</span>
                <h4>맥락과 의도를 읽는 힘</h4>
                <p>언어 · 문학 · 번역</p>
              </article>
              <article>
                <span>CREATION</span>
                <h4>생각을 실제 형태로 만드는 힘</h4>
                <p>기획 · 창작 · 자영업</p>
              </article>
              <div className="transcreationArrow" aria-hidden="true">→</div>
              <article className="transcreationFrontend">
                <span>NOW</span>
                <h4>FRONTEND</h4>
                <p>요구와 기획을 화면과 인터랙션으로 구체화합니다.</p>
              </article>
            </div>
          </div>
        </div>

        <div className="aboutScreen aboutScreen--background">
          <div className="aboutDetail aboutBackground">
            <div className="aboutDetailHead">
              <span>02 / BACKGROUND</span>
              <span>SELECTED PROFILE</span>
            </div>
            <div className="backgroundIntro">
              <p>지금의 작업 방식을 만든<br />배경과 경험.</p>
              <span>필요한 정보만 빠르게 읽히도록 정리했습니다.</span>
            </div>
            <div className="backgroundGrid">
              <article className="backgroundCard">
                <span className="backgroundIndex">01 / EDUCATION</span>
                <h4>LANGUAGE<br />&amp; LITERATURE</h4>
                <p><b>중앙대학교</b><br />일본어문학전공 · 국어국문학 복수전공</p>
                <small>규슈대학교 JLCC 교환학생 · JLPT N1</small>
              </article>
              <article className="backgroundCard">
                <span className="backgroundIndex">02 / DEVELOPMENT</span>
                <h4>FRONTEND</h4>
                <p><b>이젠아카데미 DX 안산교육센터</b><br />생성형 AI 활용 프론트엔드 개발자 양성과정</p>
                <small>960 HOURS · HTML / CSS / JavaScript / React</small>
              </article>
              <article className="backgroundCard">
                <span className="backgroundIndex">03 / AI &amp; WORKFLOW</span>
                <h4>GENERATIVE<br />AI</h4>
                <p><b>시흥여성새로일하기지원본부</b><br />생성형 AI 기반 사무혁신전문가 과정</p>
                <small>AI-ASSISTED WORKFLOW</small>
              </article>
              <article className="backgroundCard">
                <span className="backgroundIndex">04 / EXPERIENCE</span>
                <h4>MAKE<br />&amp; OPERATE</h4>
                <p><b>드림팩토리 월하 · 시흥양봉협동조합</b><br />기획 · 제작 · 콘텐츠 · 온라인 운영</p>
                <small>FROM IDEA TO REAL OUTPUT</small>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="projects" className="chapter chapterProjects" aria-label="만든 것들 · Selected Work">
      <SelectedWorkMagazine />
    </section>

    <section id="skills" className="chapter chapterSkills" aria-labelledby="skills-title">
      <div className="chapterShell">
        <SectionHeading id="skills-title" number="03" eyebrow="HOW I BUILD" title="기술과 방식" description="기술 이름보다, 그 기술로 어떤 문제를 다뤘는지 보여드리고 싶습니다." />
        <div className="skillGrid">
          {skillGroups.map((group) => <article className="skillCard" key={group.number} data-reveal>
            <div className="skillCardTop"><span>{group.number} / {SKILL_TOTAL}</span><span aria-hidden="true">↗</span></div>
            <p className="skillCardEnglish">{group.english}</p>
            <h3>{group.title}</h3>
            <p className="skillCardDescription">{group.description}</p>
            <div className="skillTags">{group.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
            <a href={group.href} className="skillEvidence">작업에서 보기 <span>{group.evidence}</span><span aria-hidden="true">↗</span></a>
          </article>)}
        </div>
        <p className="skillFootnote" data-reveal>기획의 맥락을 읽고 → 구조를 세우고 → 작은 화면과 예외 상황까지 확인합니다.</p>
      </div>
    </section>

    <section id="experiments" className="chapter chapterPlay" aria-labelledby="experiments-title">
      <div className="chapterShell">
        <SectionHeading id="experiments-title" number="04" eyebrow="SMALL EXPERIMENTS" title="만들며 배운 것" description="완성된 서비스 밖에서도 움직임과 반응을 작게 실험합니다." />
        <div className="playGrid">
          <article className="playCard playCard--motion" data-reveal>
            <div className="playCardVisual playSceneStrip" role="img" aria-label="포트폴리오 히어로의 성장 장면 3개">
              <img src="/assets/profile/yoojin-00.webp" alt="" loading="lazy" />
              <img src="/assets/profile/yoojin-02.webp" alt="" loading="lazy" />
              <img src="/assets/profile/yoojin-04.webp" alt="" loading="lazy" />
              <span className="playVisualLabel">01 → 03 → 05</span>
            </div>
            <div className="playCardBody"><span>01 / MOTION STUDY</span><h3>한 장의 카드가 완성되기까지</h3><p>이 페이지의 첫 장면. 스크롤에 따라 표정, 문장, 역할이 바뀌고 마지막에 SSR 카드로 이어집니다.</p><a href="#top" className="textLink">첫 장면 다시 보기 <span aria-hidden="true">↗</span></a></div>
          </article>
          <article className="playCard playCard--bricks" data-reveal>
            <div className="playCardVisual brickScene" aria-hidden="true">
              <div className="brickRows">{Array.from({ length: 24 }, (_, index) => <i key={index} />)}</div>
              <div className="brickBall" /><div className="brickPaddle" /><span className="playVisualLabel">CANVAS / GAME LOOP</span>
            </div>
            <div className="playCardBody"><span>02 / CANVAS STUDY</span><h3>Retro Brick Breaker</h3><p>순수 JavaScript와 Canvas로 게임 루프, 패들 조작, 벽돌 충돌과 재시작을 연습한 작은 프로젝트입니다.</p><a href="https://github.com/tichieeee1023/bricksGame" target="_blank" rel="noopener noreferrer" className="textLink">코드 보기 <span aria-hidden="true">↗</span></a></div>
          </article>
        </div>
      </div>
    </section>

    <section id="contact" className="chapter chapterContact" aria-labelledby="contact-title">
      <Marquee text="LET'S BUILD • TOGETHER" repeat={4} variant="outline" />
      <div className="chapterShell">
        <div className="contactOverline" data-reveal><span>{TOTAL} / {TOTAL}</span><span>THE NEXT CHAPTER</span></div>
        <p className="contactPrelude" data-reveal>이제 다음 이야기를 함께 만들 차례입니다.</p>
        <h2 id="contact-title" data-reveal>함께 만들<br /><em>화면이 있나요?</em></h2>
        <div className="contactBottom" data-reveal>
          <a className="contactMail" href="mailto:curencandy001@gmail.com">이메일 보내기 <span aria-hidden="true">↗</span></a>
          <div className="contactDetails"><a href="mailto:curencandy001@gmail.com">curencandy001@gmail.com</a><a href="https://github.com/tichieeee1023" target="_blank" rel="noopener noreferrer">GITHUB ↗</a></div>
        </div>
        <footer className="chapterEnd"><span>LEE YOOJIN / FRONTEND DEVELOPER</span><a href="#top">BACK TO TOP ↑</a></footer>
      </div>
    </section>
  </main>;
}
