import { useEffect, useId, useRef, useState } from "react";
import { navigateToChapter } from "../PortfolioChapters/chapterNavigation";
import "./MobileMenu.css";

const items = [
  { id: "about", en: "ABOUT", ko: "소개" },
  { id: "projects", en: "WORK", ko: "프로젝트" },
  { id: "skills", en: "TOOLKIT", ko: "기술과 활용" },
  { id: "experiments", en: "PLAY", ko: "게임 · 개발 실험" },
  { id: "contact", en: "CONTACT", ko: "연락처" },
];

type Props = {
  light?: boolean;
  active?: string;
};

export default function MobileMenu({ light = false, active }: Props) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [open]);

  const goTo = (id: string) => {
    setOpen(false);
    navigateToChapter(id);
  };

  return (
    <div ref={rootRef} className={`mobileSiteMenu${light ? " mobileSiteMenu--light" : ""}`}>
      <button
        ref={buttonRef}
        type="button"
        className={`mobileSiteMenuTrigger${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "메뉴 닫기" : "전체 메뉴 열기"}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      {open && (
        <nav id={menuId} className="mobileSiteMenuPanel" aria-label="모바일 전체 메뉴">
          <p className="mobileSiteMenuHeading">YOOJIN / PORTFOLIO</p>
          {items.map((item, index) => (
            <a
              href={`#${item.id}`}
              key={item.id}
              aria-current={active === item.id ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                goTo(item.id);
              }}
            >
              <span className="mobileSiteMenuIndex">{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.en}</strong>
              <small>{item.ko}</small>
              <span aria-hidden="true" className="mobileSiteMenuArrow">↗</span>
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
