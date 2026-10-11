import type { CSSProperties } from "react";

type BrandTone = "dark" | "light";
type BrandVariant = "horizontal" | "monogram" | "icon" | "emblem";

type BrandLogoProps = {
  variant?: BrandVariant;
  tone?: BrandTone;
  className?: string;
  title?: string;
};

const FONT_STACK = '"Cormorant Garamond", "Times New Roman", Georgia, serif';

function Star({ x, y, size, color, opacity = 1 }: { x: number; y: number; size: number; color: string; opacity?: number }) {
  const s = size;
  return (
    <g className="brandMarkStar" transform={`translate(${x} ${y})`} opacity={opacity}>
      <path d={`M 0 ${-s} L ${s * 0.22} ${-s * 0.22} L ${s} 0 L ${s * 0.22} ${s * 0.22} L 0 ${s} L ${-s * 0.22} ${s * 0.22} L ${-s} 0 L ${-s * 0.22} ${-s * 0.22} Z`} fill={color} />
    </g>
  );
}

function Monogram({ ink, accent, sub }: { ink: string; accent: string; sub: string }) {
  return (
    <g>
      <path d="M18 72 C 48 31, 95 15, 154 21 C 183 23, 208 29, 231 39" fill="none" stroke={accent} strokeWidth="3.4" strokeLinecap="round" opacity="0.9" />
      <path d="M19 74 C 73 96, 126 101, 187 84 C 207 79, 225 72, 239 64" fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" opacity="0.34" />
      <text x="54" y="126" fill={ink} style={{ fontFamily: FONT_STACK, fontWeight: 700, fontSize: 112, letterSpacing: '-0.08em' } as CSSProperties}>Y</text>
      <text x="114" y="143" fill={ink} style={{ fontFamily: FONT_STACK, fontWeight: 700, fontSize: 122, letterSpacing: '-0.09em' } as CSSProperties}>J</text>
      <path d="M136 18 v20" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
      <circle cx="136" cy="42" r="2.4" fill={accent} />
      <path d="M136 146 v10" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <circle cx="136" cy="160" r="2.1" fill={accent} />
      <path d="M136 6 l4 4 l-4 4 l-4 -4 Z" fill={accent} opacity="0.9" />
      <path d="M136 170 l3.6 3.6 l-3.6 3.6 l-3.6 -3.6 Z" fill={accent} opacity="0.75" />
      <Star x={211} y={80} size={11} color={accent} />
      <Star x={224} y={80} size={4} color={sub} opacity={0.6} />
    </g>
  );
}

export default function BrandLogo({ variant = "horizontal", tone = "dark", className, title = "YOOJIN 브랜드 로고" }: BrandLogoProps) {
  const palette = tone === "light"
    ? { ink: '#f8f1e6', accent: '#d5ae74', sub: '#efe5d4' }
    : { ink: '#2b1e17', accent: '#c8a05f', sub: '#6f5c4d' };

  if (variant === "icon") {
    return (
      <svg className={className} viewBox="0 0 96 96" role="img" aria-label={title}>
        <title>{title}</title>
        <rect x="1.5" y="1.5" width="93" height="93" rx="21" fill={tone === 'light' ? 'rgba(248,241,230,0.07)' : 'rgba(43,30,23,0.06)'} stroke={tone === 'light' ? 'rgba(248,241,230,0.45)' : 'rgba(43,30,23,0.18)'} strokeWidth="1.5" />
        <g transform="translate(14 13) scale(0.28)">
          <Monogram ink={palette.ink} accent={palette.accent} sub={palette.sub} />
        </g>
      </svg>
    );
  }

  if (variant === "emblem") {
    return (
      <svg className={className} viewBox="0 0 230 230" role="img" aria-label={title}>
        <title>{title}</title>
        <circle cx="115" cy="115" r="111" fill="none" stroke={palette.accent} strokeWidth="0.9" opacity="0.72" />
        <circle cx="115" cy="115" r="103" fill="none" stroke={palette.accent} strokeWidth="0.55" opacity="0.34" />
        <text x="115" y="32" fill={palette.ink} textAnchor="middle" style={{ fontFamily: FONT_STACK, fontSize: 21, fontWeight: 700, letterSpacing: '0.26em' } as CSSProperties}>YOOJIN</text>
        <text x="115" y="210" fill={palette.ink} textAnchor="middle" style={{ fontFamily: FONT_STACK, fontSize: 11.8, fontWeight: 600, letterSpacing: '0.16em' } as CSSProperties}>FRONTEND DEVELOPER</text>
        <path d="M27 60 Q115 3 203 60 M27 170 Q115 227 203 170" fill="none" stroke={palette.accent} strokeWidth="0.8" opacity="0.4" />
        <g transform="translate(36 52) scale(0.64)">
          <Monogram ink={palette.ink} accent={palette.accent} sub={palette.sub} />
        </g>
        <Star x={17} y={115} size={4.4} color={palette.accent} />
        <Star x={213} y={115} size={4.4} color={palette.accent} />
      </svg>
    );
  }

  if (variant === "monogram") {
    return (
      <svg className={className} viewBox="0 0 248 182" role="img" aria-label={title}>
        <title>{title}</title>
        <Monogram ink={palette.ink} accent={palette.accent} sub={palette.sub} />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 458 118" role="img" aria-label={title}>
      <title>{title}</title>
      <g transform="translate(0 3) scale(0.52)">
        <Monogram ink={palette.ink} accent={palette.accent} sub={palette.sub} />
      </g>
      <path d="M166 20 v76" stroke={tone === 'light' ? 'rgba(248,241,230,0.55)' : 'rgba(43,30,23,0.22)'} strokeWidth="1.4" />
      <Star x={183} y={58} size={5.5} color={palette.accent} />
      <text x="206" y="52" fill={palette.ink} style={{ fontFamily: FONT_STACK, fontWeight: 600, fontSize: 34, letterSpacing: '0.21em' } as CSSProperties}>YOOJIN</text>
      <text x="206" y="82" fill={tone === 'light' ? 'rgba(248,241,230,0.88)' : 'rgba(43,30,23,0.72)'} style={{ fontFamily: FONT_STACK, fontWeight: 600, fontSize: 13, letterSpacing: '0.36em' } as CSSProperties}>FRONTEND DEVELOPER</text>
    </svg>
  );
}
