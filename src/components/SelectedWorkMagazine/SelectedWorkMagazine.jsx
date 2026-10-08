import React, { useLayoutEffect, useRef, useState } from 'react';

import gsap from 'gsap';
import { CHROME_SWITCH_AT, DURATION, getParts, paintIntro, paintTransition, resetParts } from './transition.js';
import { PROJECTS } from './workProjects.js';
import WorkIndex from './WorkIndex.jsx';
import MidnightTurntable from './MidnightTurntable.jsx';
import ProjectMedia from './ProjectMedia.jsx';
import './styles.css';

const COUNT = String(PROJECTS.length).padStart(2, '0');
const COMPACT_QUERY = '(max-width: 900px)';

function MagazineIntro({ introRef, onOpen }) {
  return (
    <section ref={introRef} className="intro-sheet" aria-label="Selected work magazine intro">
      <div className="intro-fold" aria-hidden="true"><span /></div>
      <div className="intro-shadow" aria-hidden="true" />
      <header className="running-head intro-head">
        <span>YOOJIN — PORTFOLIO</span><span>SELECTED WORK</span><span>ISSUE 01 · 2026</span>
      </header>
      <aside className="intro-rail" aria-hidden="true"><span>WORK</span><small>01—{COUNT}</small></aside>
      <div className="intro-body">
        <p className="intro-kicker">FROM BACKGROUND TO SELECTED WORK</p>
        <h2 id="projects-title">SELECTED<br /><em>WORK</em></h2>
        <p className="intro-copy">여섯 개의 프로젝트를 한 장씩 넘겨보는 작은 포트폴리오 매거진.</p>
        <button className="open-button" type="button" onClick={onOpen}><span>OPEN MAGAZINE</span><span>↘</span></button>
      </div>
      <div className="intro-meta">{PROJECTS.map(p => <span key={p.id}>{p.id} {p.title.join(' ')}</span>)}</div>
      <footer className="running-foot intro-foot"><span>SELECTED WORK / FRONTEND PORTFOLIO</span><span>SCROLL TO OPEN →</span></footer>
    </section>
  );
}

function ProjectVisual({ project, active, stopToken }) {
  return (
    <figure className="visual js-visual">
      <div className="visual-media js-media"><ProjectMedia src={project.pcSrc} title={project.title.join(' ')} /></div>
      <div className="phone js-phone" role="group" aria-label={`${project.title.join(' ')} 모바일 화면`}>
        <div className="phone-notch" />
        <div className="phone-screen"><ProjectMedia src={project.mobileSrc} title={project.title.join(' ')} phone /></div>
      </div>
      {project.special?.type === 'turntable-visualizer' && <MidnightTurntable active={active} />}
    </figure>
  );
}

function ProjectEditorial({ project }) {
  return (
    <article className="editorial js-editorial" tabIndex={0} aria-label={`${project.title.join(' ')} 상세 설명`}>
      <span className="folio" aria-hidden="true">{project.id}</span>
      <header className="ed-top js-reveal">
        <p className="ed-kicker">{project.id} / {project.group === 'team' ? 'TEAM PROJECT' : 'PERSONAL PROJECT'}</p>
        <span className="ed-kind">{project.category}</span>
      </header>
      {project.chapter && <p className="chapter-marker js-reveal">{project.chapter}</p>}
      <h2 className="ed-title" aria-label={project.title.join(' ')}>
        {project.title.map(line => <span className="mask" key={line} aria-hidden="true"><span className="mask-in js-title-line">{line}</span></span>)}
      </h2>
      <p className="ed-lede js-reveal"><span className="desktop-copy">{project.description}</span><span className="mobile-copy">{project.mobileDescription}</span></p>
      <section className="ed-block ed-focus js-reveal"><span className="ed-label">{project.focusLabel}</span><p><span className="desktop-copy">{project.focus}</span><span className="mobile-copy">{project.mobileFocus || project.focus}</span></p></section>
      <section className="ed-block built-with js-reveal" aria-label="사용 기술">
        <span className="ed-label">BUILT WITH</span>
        <ul className="ed-tech">{project.tech.map(item => <li className="tech-chip" key={item}>{item}</li>)}</ul>
      </section>
      {project.meta && <p className="project-meta js-reveal">{project.meta}</p>}
      <div className="ed-links js-reveal">
        {project.live && <a href={project.live} target="_blank" rel="noreferrer">LIVE SITE ↗</a>}
        {project.github && <a href={project.github} target="_blank" rel="noreferrer">GITHUB ↗</a>}
      </div>
    </article>
  );
}

function ProjectLayer({ project, index, layerRef, active, stopToken }) {
  return (
    <section ref={layerRef} id={`project-${project.slug}`} data-index={index} data-theme={project.theme}
      className={`project-layer theme-${project.theme} layout-${project.layout}`} aria-label={`${project.id} ${project.title.join(' ')}`}>
      <ProjectVisual project={project} active={active} stopToken={stopToken} />
      <ProjectEditorial project={project} />
    </section>
  );
}

export default function SelectedWorkMagazine() {
  const introRef = useRef(null);
  const bookRef = useRef(null);
  const layerRefs = useRef([]);
  const motion = useRef({ p: 0 });
  const introMotion = useRef({ p: 0 });
  const animatingRef = useRef(false);
  const openedRef = useRef(false);
  const activeIndexRef = useRef(0);
  const wheelAccumulator = useRef(0);
  const wheelTimer = useRef(null);
  const touchStartY = useRef(null);
  const lockUntilRef = useRef(0);
  const compactTimelineRef = useRef(null);
  const compactStageRef = useRef(null);
  const swipeRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [audioStopToken, setAudioStopToken] = useState(0);
  const activeProject = PROJECTS[activeIndex];
  const isCompact = () => window.matchMedia(COMPACT_QUERY).matches;
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setThemeOnBook = project => { if (bookRef.current) bookRef.current.dataset.theme = project.theme; };
  const showLayer = index => {
    layerRefs.current.forEach((layer, i) => {
      resetParts(getParts(layer));
      layer.classList.remove('is-turning');
      layer.classList.toggle('is-active', i === index);
      layer.inert = i !== index;
      layer.setAttribute('aria-hidden', String(i !== index));
    });
    if (compactStageRef.current) compactStageRef.current.style.height = '';
  };
  const turnCompact = index => {
    if (!PROJECTS[index] || index === activeIndexRef.current) return;
    compactTimelineRef.current?.kill();
    const from = activeIndexRef.current;
    showLayer(from);
    const outgoing = layerRefs.current[from];
    const incoming = layerRefs.current[index];
    const stage = compactStageRef.current;
    const direction = index > from ? 1 : -1;
    // Reading and direct navigation stay available while a short sheet turn plays.
    activeIndexRef.current = index;
    setActiveIndex(index);
    setThemeOnBook(PROJECTS[index]);
    setAudioStopToken(value => value + 1);
    const focusWasInPage = outgoing.contains(document.activeElement);
    outgoing.inert = true;
    outgoing.setAttribute('aria-hidden', 'true');
    incoming.inert = false;
    incoming.setAttribute('aria-hidden', 'false');
    outgoing.classList.add('is-turning');
    incoming.classList.add('is-turning');
    incoming.classList.add('is-active');
    stage.style.height = `${Math.max(outgoing.offsetHeight, incoming.offsetHeight)}px`;
    const navHeight = document.querySelector('.chapterNav')?.getBoundingClientRect().height ?? 58;
    window.scrollTo({ top: window.scrollY + bookRef.current.getBoundingClientRect().top - navHeight, behavior: 'instant' });
    const finish = () => {
      showLayer(index);
      if (focusWasInPage) incoming.querySelector('.editorial')?.focus({ preventScroll: true });
      compactTimelineRef.current = null;
    };
    if (prefersReduced()) { finish(); return; }
    compactTimelineRef.current = gsap.timeline({ onComplete: finish })
      .set(outgoing, { zIndex: 2, transformOrigin: direction > 0 ? 'left center' : 'right center' })
      .set(incoming, { zIndex: 1 })
      .fromTo(incoming, { xPercent: direction * 10 }, { xPercent: 0, duration: .35, ease: 'power2.out' }, 0)
      .to(outgoing, { xPercent: -direction * 102, rotationY: -direction * 6, duration: .35, ease: 'power2.inOut' }, 0);
  };

  const tweenIntro = (target, onDone) => {
    const intro = introRef.current;
    if (!intro) return;
    animatingRef.current = true;
    gsap.killTweensOf(introMotion.current);
    gsap.to(introMotion.current, {
      p: target, duration: target === 1 ? 1.0 : 0.78, ease: 'none',
      onUpdate: () => paintIntro(intro, introMotion.current.p),
      onComplete: () => {
        paintIntro(intro, target);
        intro.inert = target === 1;
        openedRef.current = target === 1;
        animatingRef.current = false;
        lockUntilRef.current = performance.now() + 420;
        onDone?.();
      },
    });
  };
  const openMagazine = () => {
    if (animatingRef.current || openedRef.current) return;
    setThemeOnBook(PROJECTS[0]);
    if (prefersReduced()) {
      introMotion.current.p = 1;
      paintIntro(introRef.current, 1);
      introRef.current.inert = true;
      openedRef.current = true;
      return;
    }
    tweenIntro(1);
  };
  const closeMagazine = () => {
    if (animatingRef.current || !openedRef.current || activeIndexRef.current !== 0) return;
    if (prefersReduced()) {
      introMotion.current.p = 0;
      paintIntro(introRef.current, 0);
      introRef.current.inert = false;
      openedRef.current = false;
      return;
    }
    tweenIntro(0);
  };

  // Preserve the v8 transition driver, timing and reverse playback.
  const transitionTo = to => {
    const from = activeIndexRef.current;
    if (animatingRef.current || !openedRef.current || to === from || to < 0 || to >= PROJECTS.length) return;
    setAudioStopToken(value => value + 1);
    const layers = layerRefs.current;
    const forward = to > from;
    const A = getParts(layers[forward ? from : to]);
    const B = getParts(layers[forward ? to : from]);
    const settle = () => {
      showLayer(to);
      activeIndexRef.current = to;
      setActiveIndex(to);
      setThemeOnBook(PROJECTS[to]);
      animatingRef.current = false;
      lockUntilRef.current = performance.now() + 420;
    };
    if (prefersReduced()) { settle(); return; }
    animatingRef.current = true;
    let chromeIndex = from;
    const m = motion.current;
    gsap.killTweensOf(m);
    m.p = forward ? 0 : 1;
    paintTransition(A, B, m.p);
    gsap.to(m, {
      p: forward ? 1 : 0, duration: DURATION, ease: 'none',
      onUpdate: () => {
        paintTransition(A, B, m.p);
        const idx = m.p >= CHROME_SWITCH_AT ? B.index : A.index;
        if (idx !== chromeIndex) {
          chromeIndex = idx;
          setActiveIndex(idx);
          setThemeOnBook(PROJECTS[idx]);
        }
      },
      onComplete: settle,
    });
  };
  const jumpTo = index => {
    if (isCompact()) {
      turnCompact(index);
      return;
    }
    if (!openedRef.current) { if (index === 0) openMagazine(); return; }
    transitionTo(index);
  };

  useLayoutEffect(() => {
    const intro = introRef.current;
    if (!intro) return undefined;
    const layers = layerRefs.current;
    const projectMotion = motion.current;
    const coverMotion = introMotion.current;
    const onNavigate = event => {
      const index = event.detail;
      if (!Number.isInteger(index) || !PROJECTS[index]) return;
      gsap.killTweensOf([projectMotion, coverMotion]);
      compactTimelineRef.current?.kill();
      animatingRef.current = false;
      openedRef.current = true;
      coverMotion.p = 1;
      paintIntro(intro, 1);
      intro.inert = true;
      activeIndexRef.current = index;
      setActiveIndex(index);
      setAudioStopToken(value => value + 1);
      setThemeOnBook(PROJECTS[index]);
      showLayer(index);
      if (isCompact()) requestAnimationFrame(() => layers[index].scrollIntoView({ block: 'start' }));
    };
    setThemeOnBook(PROJECTS[0]);
    showLayer(0);
    paintIntro(intro, isCompact() ? 1 : 0);
    intro.inert = isCompact();
    activeIndexRef.current = 0;
    openedRef.current = isCompact();
    animatingRef.current = false;
    const inViewport = () => {
      const rect = bookRef.current?.getBoundingClientRect();
      return rect && rect.top <= 68 && rect.bottom >= window.innerHeight * .6;
    };
    const alignBook = () => {
      const top = bookRef.current.getBoundingClientRect().top;
      if (Math.abs(top - 66) > 2) window.scrollBy(0, top - 66);
    };
    const atBoundary = direction => !animatingRef.current && (
      (!openedRef.current && direction < 0) ||
      (openedRef.current && activeIndexRef.current === PROJECTS.length - 1 && direction > 0)
    );
    const onWheel = event => {
      if (event.defaultPrevented) return;
      if (gsap.isTweening(window) && inViewport()) { event.preventDefault(); return; }
      if (isCompact() || !inViewport() || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (atBoundary(event.deltaY)) return;
      // Overflowing copy stays readable without changing the project transition.
      const column = event.target.closest?.('.editorial');
      if (!animatingRef.current && column && ((event.deltaY > 0 && column.scrollTop + column.clientHeight < column.scrollHeight - 2) ||
        (event.deltaY < 0 && column.scrollTop > 0))) return;
      // Release the final boundary to a host portfolio's following section.
      if (openedRef.current && activeIndexRef.current === PROJECTS.length - 1 && event.deltaY > 0 && !animatingRef.current) return;
      event.preventDefault();
      alignBook();
      if (animatingRef.current || performance.now() < lockUntilRef.current) { wheelAccumulator.current = 0; return; }
      wheelAccumulator.current += event.deltaY;
      window.clearTimeout(wheelTimer.current);
      wheelTimer.current = window.setTimeout(() => { wheelAccumulator.current = 0; }, 140);
      if (Math.abs(wheelAccumulator.current) < 60) return;
      const direction = wheelAccumulator.current > 0 ? 1 : -1;
      wheelAccumulator.current = 0;
      if (!openedRef.current) { if (direction > 0) openMagazine(); return; }
      if (activeIndexRef.current === 0 && direction < 0) { closeMagazine(); return; }
      transitionTo(activeIndexRef.current + direction);
    };
    const onKeyDown = event => {
      if (event.defaultPrevented || gsap.isTweening(window)) return;
      if (isCompact() || !inViewport() || event.target.closest?.('button, a, input, textarea, select, .editorial')) return;
      const direction = ['ArrowDown', 'PageDown', 'ArrowRight'].includes(event.key) ? 1 : -1;
      if (atBoundary(direction)) return;
      if (['ArrowDown', 'PageDown', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        if (!openedRef.current) openMagazine();
        else transitionTo(activeIndexRef.current + 1);
      }
      if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(event.key)) {
        event.preventDefault();
        if (openedRef.current && activeIndexRef.current === 0) closeMagazine();
        else transitionTo(activeIndexRef.current - 1);
      }
    };
    const onTouchStart = event => { touchStartY.current = event.touches?.[0]?.clientY ?? null; };
    const onTouchEnd = event => {
      if (gsap.isTweening(window)) return;
      if (isCompact() || !inViewport() || touchStartY.current == null || animatingRef.current) return;
      const endY = event.changedTouches?.[0]?.clientY ?? touchStartY.current;
      const diff = touchStartY.current - endY;
      touchStartY.current = null;
      if (Math.abs(diff) < 45) return;
      if (!openedRef.current && diff > 0) openMagazine();
      else if (openedRef.current && activeIndexRef.current === 0 && diff < 0) closeMagazine();
      else transitionTo(activeIndexRef.current + (diff > 0 ? 1 : -1));
    };
    const mq = window.matchMedia(COMPACT_QUERY);
    const onModeChange = () => {
      gsap.killTweensOf([motion.current, introMotion.current]);
      compactTimelineRef.current?.kill();
      animatingRef.current = false;
      setAudioStopToken(value => value + 1);
      if (mq.matches) openedRef.current = true;
      paintIntro(intro, openedRef.current ? 1 : 0);
      intro.inert = openedRef.current;
      setActiveIndex(activeIndexRef.current);
      showLayer(activeIndexRef.current);
    };
    window.addEventListener('selected-work:navigate', onNavigate);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    mq.addEventListener('change', onModeChange);
    return () => {
      window.removeEventListener('selected-work:navigate', onNavigate);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      mq.removeEventListener('change', onModeChange);
      window.clearTimeout(wheelTimer.current);
      gsap.killTweensOf([projectMotion, coverMotion]);
      compactTimelineRef.current?.kill();
    };
  }, []);

  return (
    <div className="selectedWorkMagazine"><div className="prototype-shell">
      <header className="mobile-work-intro">
        <span>02 / WORK INDEX</span>
        <h2 aria-label="선택한 프로젝트">SELECTED<br /><em>WORK</em></h2>
        <p>배경과 경험을 바탕으로 만든<br />여섯 개의 프로젝트.</p>
        <a className="mobile-work-open" href="#work-pages"><span>프로젝트 보기</span><b aria-hidden="true">↓</b></a>
        <small className="mobile-cover-foot">YOOJIN / PORTFOLIO · 2026</small>
      </header>
      <div id="work-pages" ref={bookRef} className="portfolio-book" data-theme={activeProject.theme}>
        <MagazineIntro introRef={introRef} onOpen={openMagazine} />
        <section className="magazine-shell" aria-label="Selected work magazine">
          <header className="running-head magazine-head">
            <WorkIndex projects={PROJECTS} activeIndex={activeIndex} onSelect={jumpTo} />
            <span className="project-page-count">{activeProject.id} / {COUNT}</span>
            <button className="mobile-project-step" type="button" disabled={activeIndex === PROJECTS.length - 1}
              onClick={() => jumpTo(activeIndexRef.current + 1)}
              aria-label={activeIndex < PROJECTS.length - 1 ? `다음 프로젝트: ${PROJECTS[activeIndex + 1].koTitle}` : '마지막 프로젝트'}>
              <span aria-hidden="true">→</span>
            </button>
            <p className="mobile-swipe-hint"><span aria-hidden="true">↔</span>좌우로 밀어 프로젝트 넘기기</p>
          </header>
          <div className="stage" ref={compactStageRef}
            onPointerDown={event => {
              swipeRef.current = null;
              if (!isCompact() || !event.isPrimary || event.button !== 0 ||
                event.target.closest('button, a, input, textarea, select, video[controls], [contenteditable="true"]')) return;
              swipeRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerCancel={() => { swipeRef.current = null; }}
            onLostPointerCapture={() => { swipeRef.current = null; }}
            onPointerUp={event => {
              const start = swipeRef.current;
              swipeRef.current = null;
              if (!start || start.id !== event.pointerId || !isCompact()) return;
              const dx = start.x - event.clientX;
              const dy = start.y - event.clientY;
              if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.4) jumpTo(activeIndexRef.current + (dx > 0 ? 1 : -1));
            }}>
            {PROJECTS.map((project, index) => <ProjectLayer key={project.slug} project={project} index={index}
              active={activeIndex === index} stopToken={audioStopToken} layerRef={el => { layerRefs.current[index] = el; }} />)}
          </div>
          <nav className="mobile-project-nav" aria-label="프로젝트 이전·다음 이동">
            <button type="button" disabled={activeIndex === 0} onClick={() => jumpTo(activeIndexRef.current - 1)}>← 이전 프로젝트</button>
            <button type="button" disabled={activeIndex === PROJECTS.length - 1} onClick={() => jumpTo(activeIndexRef.current + 1)}>다음 프로젝트 →</button>
          </nav>
          <p className="mobile-project-status" role="status" aria-live="polite">{activeProject.id} / {COUNT} · {activeProject.koTitle}</p>
          <footer className="running-foot magazine-foot">
            <span>{activeProject.title.join(' ')} — {activeProject.koTitle}</span>
            <span>{activeIndex < PROJECTS.length - 1 ? 'SCROLL FOR NEXT PROJECT →' : 'END OF SELECTED WORK'}</span>
          </footer>
        </section>
      </div>
    </div></div>
  );
}

