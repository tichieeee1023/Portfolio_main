import { gsap } from 'gsap';

/**
 * ABOUT 장면(.aboutScreen) 하나의 등장 모션을 "멈춘 타임라인"으로 만들어 돌려준다.
 *
 * 왜 미리 만들어 두는가
 * - 예전에는 장면이 보인 뒤에 fromTo를 실행해서, 내용이 먼저 보였다가 사라지고 다시 나타나는 깜빡임이 있었다.
 * - paused 타임라인은 만드는 순간 from 상태(숨김)가 적용되므로, 장면이 화면에 들어오기 전에 이미 준비된다.
 * - 재생(play)은 호출하는 쪽에서 IntersectionObserver로 장면이 들어올 때 한다.
 *
 * 반드시 gsap.context() 안에서 호출할 것. 언마운트 때 context.revert()로 인라인 스타일까지 되돌아간다.
 */
export function buildAboutTimeline(screen: HTMLElement): gsap.core.Timeline | null {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

  if (screen.classList.contains('aboutScreen--profile')) {
    const portrait = screen.querySelector('.aboutPortrait');
    const kicker = screen.querySelector('.aboutKicker');
    const lines = screen.querySelectorAll('.aboutHeadlineLine');
    const leads = screen.querySelectorAll('.aboutLead');
    const traits = screen.querySelector('.aboutTraits');
    const link = screen.querySelector('.textLink');

    tl.fromTo(portrait,
      { x: -34, y: 34, rotation: -4.2, opacity: 0, scale: .965 },
      { x: 0, y: 0, rotation: -1.2, opacity: 1, scale: 1, duration: 1.02, ease: 'expo.out', clearProps: 'x,y,opacity,scale' }, 0)
      .fromTo(kicker,
        { y: 16, opacity: 0, letterSpacing: '.34em' },
        { y: 0, opacity: 1, letterSpacing: '.22em', duration: .62, clearProps: 'transform,opacity,letterSpacing' }, .08)
      .fromTo(lines,
        { yPercent: 86, opacity: 0, skewY: 3, clipPath: 'inset(0 0 100% 0)' },
        { yPercent: 0, opacity: 1, skewY: 0, clipPath: 'inset(0 0 0% 0)', duration: .78, ease: 'expo.out', stagger: .075, clearProps: 'transform,opacity,clipPath' }, .14)
      .fromTo(leads,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: .58, stagger: .08, clearProps: 'transform,opacity' }, .58)
      .fromTo(traits,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: .55, clearProps: 'transform,opacity' }, .73)
      .fromTo(link,
        { x: -12, opacity: 0 },
        { x: 0, opacity: 1, duration: .5, clearProps: 'transform,opacity' }, .82);
    return tl;
  }

  if (screen.classList.contains('aboutScreen--transcreation')) {
    const head = screen.querySelector('.aboutDetailHead');
    const titleParts = screen.querySelectorAll('.transcreationTitle > span');
    const plus = screen.querySelector('.transcreationTitle > b');
    const resultCopy = screen.querySelector('.transcreationResult p');
    const result = screen.querySelector('.transcreationResult strong');
    const notes = screen.querySelectorAll('.transcreationNotes article');
    const arrow = screen.querySelector('.transcreationArrow');

    tl.fromTo(head,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: .48, clearProps: 'transform,opacity' }, 0)
      .fromTo(titleParts[0],
        { xPercent: -16, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        { xPercent: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: .88, ease: 'expo.out', clearProps: 'transform,opacity,clipPath' }, .05)
      .fromTo(titleParts[1],
        { xPercent: 16, opacity: 0, clipPath: 'inset(0 0 0 100%)' },
        { xPercent: 0, opacity: 1, clipPath: 'inset(0 0 0 0%)', duration: .88, ease: 'expo.out', clearProps: 'transform,opacity,clipPath' }, .11)
      .fromTo(plus,
        { scale: .2, rotation: -35, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: .52, ease: 'back.out(1.8)', clearProps: 'transform,opacity' }, .38)
      .fromTo(resultCopy,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: .55, clearProps: 'transform,opacity' }, .55)
      .fromTo(result,
        { yPercent: 52, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        { yPercent: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: .82, ease: 'expo.out', clearProps: 'transform,opacity,clipPath' }, .58)
      .fromTo(notes,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: .62, stagger: .1, clearProps: 'transform,opacity' }, .82)
      .fromTo(arrow,
        { x: -16, scale: .65, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, duration: .5, ease: 'back.out(1.7)', clearProps: 'transform,opacity' }, 1.02);
    return tl;
  }

  if (screen.classList.contains('aboutScreen--background')) {
    const head = screen.querySelector('.aboutDetailHead');
    const intro = screen.querySelector('.backgroundIntro p');
    const sub = screen.querySelector('.backgroundIntro > span');
    const cards = screen.querySelectorAll('.backgroundCard');

    tl.fromTo(head, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .48, clearProps: 'transform,opacity' }, 0)
      .fromTo(intro,
        { yPercent: 42, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        { yPercent: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: .78, ease: 'expo.out', clearProps: 'transform,opacity,clipPath' }, .06)
      .fromTo(sub, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .5, clearProps: 'transform,opacity' }, .28)
      .fromTo(cards,
        { y: 38, opacity: 0, clipPath: 'inset(0 0 18% 0)' },
        { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: .72, stagger: .09, ease: 'power3.out', clearProps: 'transform,opacity,clipPath' }, .34);
    return tl;
  }

  // 모션이 정의되지 않은 장면(cover 등): 빈 타임라인은 버린다.
  tl.kill();
  return null;
}
