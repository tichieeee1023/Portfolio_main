import React, { useRef, useState } from 'react';

export default function ProjectMedia({ src, title, phone = false }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) { video.pause(); return; }
    try { await video.play(); } catch { setPaused(true); }
  };
  if (!src || failedSrc === src) return (
    <div className={`placeholder ${phone ? 'placeholder--phone' : 'placeholder--pc'}`}>
      <span>{phone ? 'MOBILE VIEW' : 'PROJECT PREVIEW'}</span>
      <strong>{phone ? 'PREVIEW' : title}</strong>
      <span>{phone ? '9 : 19.5' : 'SCREENSHOT COMING SOON'}</span>
    </div>
  );
  const label = `${title} ${phone ? '모바일' : 'PC'} 화면`;
  if (/\.(webm|mp4)(?:[?#]|$)/i.test(src)) {
    return <>
      <video key={src} ref={videoRef} src={src} aria-label={label} autoPlay muted loop playsInline
        onPlay={() => setPaused(false)} onPause={() => setPaused(true)}
        onError={() => setFailedSrc(src)} />
      <button className="media-playback" type="button" onClick={togglePlayback}
        aria-label={`${title} 영상 ${paused ? '재생' : '일시정지'}`} title={paused ? '재생' : '일시정지'}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M8 5v14l11-7z" /> : <path d="M6 5h4v14H6zm8 0h4v14h-4z" />}
        </svg>
      </button>
    </>;
  }
  return <img src={src} alt={label} draggable="false" onError={() => setFailedSrc(src)} />;
}
