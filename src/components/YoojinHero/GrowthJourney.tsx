import { useEffect, useRef } from "react";
import { GROWTH } from "./growthData";

export function GrowthJourney({ index, transitioning, complete }: { index: number; transitioning: boolean; complete: boolean }) {
  return <>
    <nav className={`growthJourney ${complete ? "isComplete" : ""}`} aria-label="개발자 성장 단계">
      <ol>{GROWTH.map((step, i) => <li key={step.name} className={i === index ? "isCurrent" : i < index ? "isPassed" : ""} aria-current={i === index ? "step" : undefined}>
        <span className="growthNode" aria-hidden="true">{i < index ? "✓" : `0${i + 1}`}</span>
        <span className="growthName">{step.name}</span>
      </li>)}</ol>
    </nav>
    <div className={`growthIdentity ${transitioning ? "isEvolving" : ""}`} key={index}>
      <span className="growthRank">
        <b>{GROWTH[index].rank}</b>
        <span className="growthPips" aria-hidden="true">{GROWTH.map((_, i) => <i key={i} className={i <= index ? "isOn" : ""} />)}</span>
      </span>
      <div><small>{index === 0 ? "PLAYER ORIGIN" : "LEVEL UP ↑"} / LV.0{index + 1}</small>
        <strong>{index === 4 ? "프론트엔드 개발자" : GROWTH[index].name}</strong>
        <p>{GROWTH[index].skill}</p>
      </div>
    </div>
  </>;
}

export function AcquisitionFireworks() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    let width = 0, height = 0, frame = 0, previous = 0;
    const particles: { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; star: boolean; color: string }[] = [];
    const resize = () => {
      width = canvas.clientWidth; height = canvas.clientHeight;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const bursts = [{ at: 0, x: .15, y: .3 }, { at: 320, x: .86, y: .23 }, { at: 760, x: .22, y: .18 }, { at: 1100, x: .78, y: .38 }];
    const start = performance.now();
    const render = (now: number) => {
      const elapsed = now - start;
      const dt = Math.min((now - (previous || now)) / 1000, .035);
      previous = now;
      ctx.clearRect(0, 0, width, height);
      while (bursts.length && elapsed >= bursts[0].at) {
        const burst = bursts.shift()!;
        const count = width < 600 ? 48 : 85;
        for (let i = 0; i < count; i++) {
          const angle = Math.PI * 2 * i / count, speed = 65 + Math.random() * 150;
          const life = 1.1 + Math.random() * 1.1;
          particles.push({ x: width * burst.x, y: height * burst.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life, max: life, size: 1 + Math.random() * 2, star: i % 8 === 0, color: ["#fff4d3", "#e6bd70", "#ba824b"][i % 3] });
        }
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.life -= dt;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        p.vy += 48 * dt; p.vx *= Math.exp(-.6 * dt); p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.globalAlpha = Math.min(1, p.life / p.max * 1.5); ctx.strokeStyle = p.color; ctx.fillStyle = p.color;
        ctx.lineWidth = p.size; ctx.beginPath(); ctx.moveTo(p.x - p.vx * .035, p.y - p.vy * .035); ctx.lineTo(p.x, p.y); ctx.stroke();
        if (p.star) { ctx.beginPath(); ctx.moveTo(p.x, p.y - 5); ctx.lineTo(p.x + 2, p.y - 2); ctx.lineTo(p.x + 5, p.y); ctx.lineTo(p.x + 2, p.y + 2); ctx.lineTo(p.x, p.y + 5); ctx.lineTo(p.x - 2, p.y + 2); ctx.lineTo(p.x - 5, p.y); ctx.lineTo(p.x - 2, p.y - 2); ctx.closePath(); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
      if (elapsed < 3500 && !preference.matches) frame = requestAnimationFrame(render);
      else ctx.clearRect(0, 0, width, height);
    };
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); ctx.clearRect(0, 0, width, height); };
  }, []);
  return <canvas ref={ref} className="acquisitionFireworks" aria-hidden="true" />;
}
