import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

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
        <p className="intro-kicker">A SMALL MAGAZINE OF SELECTED PROJECTS</p>
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
      {project.special?.type === 'audio-turntable' && <MidnightTurntable audioSrc={project.special.audioSrc} active={active} stopToken={stopToken} />}
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
      <p className="ed-lede js-reveal">{project.description}</p>
      <section className="ed-block ed-focus js-reveal"><span className="ed-label">{project.focusLabel}</span><p>{project.focus}</p></section>
      {project.meta && <p className="project-meta js-reveal">{project.meta}</p>}
      <section className="ed-block built-with js-reveal">
        <span className="ed-label">BUILT WITH</span>
        <ul className="ed-tech">{project.tech.map(item => <li className="tech-chip" key={item}>{item}</li>)}</ul>
      </section>
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [audioStopToken, setAudioStopToken] = useState(0);
  const activeProject = PROJECTS[activeIndex];
  const isCompact = () => window.matchMedia(COMPACT_QUERY).matches;
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setThemeOnBook = project => { if (bookRef.current) bookRef.current.dataset.theme = project.theme; };

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
      layers.forEach((layer, i) => {
        resetParts(getParts(layer));
        layer.classList.toggle('is-active', i === to);
      });
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
      setAudioStopToken(value => value + 1);
      layerRefs.current[index]?.scrollIntoView({ behavior: 'instant', block: 'start' });
      setActiveIndex(index);
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
      animatingRef.current = false;
      openedRef.current = true;
      coverMotion.p = 1;
      paintIntro(intro, 1);
      intro.inert = true;
      activeIndexRef.current = index;
      setActiveIndex(index);
      setAudioStopToken(value => value + 1);
      setThemeOnBook(PROJECTS[index]);
      layers.forEach((layer, i) => {
        resetParts(getParts(layer));
        layer.classList.toggle('is-active', i === index);
      });
      if (isCompact()) requestAnimationFrame(() => layers[index].scrollIntoView({ block: 'start' }));
    };
    setThemeOnBook(PROJECTS[0]);
    layers.forEach((layer, i) => layer.classList.toggle('is-active', i === 0));
    paintIntro(intro, 0);
    activeIndexRef.current = 0;
    openedRef.current = false;
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
      animatingRef.current = false;
      setAudioStopToken(value => value + 1);
      paintIntro(intro, openedRef.current ? 1 : 0);
      if (!mq.matches) setActiveIndex(activeIndexRef.current);
      layers.forEach((layer, i) => {
        resetParts(getParts(layer));
        layer.classList.toggle('is-active', i === activeIndexRef.current);
      });
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
    };
  }, []);

  useEffect(() => {
    const updateVisible = () => {
      if (!window.matchMedia(COMPACT_QUERY).matches) return;
      const anchor = window.innerHeight * .35;
      let closest = 0;
      let distance = Infinity;
      layerRefs.current.forEach((layer, index) => {
        const rect = layer.getBoundingClientRect();
        const delta = rect.top <= anchor && rect.bottom > anchor ? 0 : Math.abs(rect.top - anchor);
        if (delta < distance) { closest = index; distance = delta; }
      });
      setActiveIndex(closest);
    };
    window.addEventListener('scroll', updateVisible, { passive: true });
    updateVisible();
    return () => window.removeEventListener('scroll', updateVisible);
  }, []);

  return (
    <div className="selectedWorkMagazine"><div className="prototype-shell">
      <div ref={bookRef} className="portfolio-book" data-theme={activeProject.theme}>
        <MagazineIntro introRef={introRef} onOpen={openMagazine} />
        <section className="magazine-shell" aria-label="Selected work magazine">
          <header className="running-head magazine-head">
            <WorkIndex projects={PROJECTS} activeIndex={activeIndex} onSelect={jumpTo} />
            <span>{activeProject.id} / {COUNT}</span>
          </header>
          <div className="stage">
            {PROJECTS.map((project, index) => <ProjectLayer key={project.slug} project={project} index={index}
              active={activeIndex === index} stopToken={audioStopToken} layerRef={el => { layerRefs.current[index] = el; }} />)}
          </div>
          <footer className="running-foot magazine-foot">
            <span>{activeProject.title.join(' ')} — {activeProject.koTitle}</span>
            <span>{activeIndex < PROJECTS.length - 1 ? 'SCROLL FOR NEXT PROJECT →' : 'END OF SELECTED WORK'}</span>
          </footer>
        </section>
      </div>
    </div></div>
  );
}

