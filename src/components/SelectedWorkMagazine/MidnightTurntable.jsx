import React, { useEffect, useRef, useState } from 'react';

export default function MidnightTurntable({ audioSrc, active, stopToken }) {
  const audioRef = useRef(null);
  const requestRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(!audioSrc);

  useEffect(() => {
    setUnavailable(!audioSrc);
    if (!audioSrc) return undefined;
    const audio = new Audio(audioSrc);
    audio.preload = 'none';
    audioRef.current = audio;
    const stopped = () => setPlaying(false);
    const failed = () => { setPlaying(false); setUnavailable(true); };
    audio.addEventListener('ended', stopped);
    audio.addEventListener('error', failed);
    return () => {
      requestRef.current += 1;
      audio.pause();
      audio.removeEventListener('ended', stopped);
      audio.removeEventListener('error', failed);
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, [audioSrc]);

  useEffect(() => {
    requestRef.current += 1;
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    setPlaying(false);
  }, [active, stopToken]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || unavailable || !active) return;
    const request = ++requestRef.current;
    if (!audio.paused) { audio.pause(); setPlaying(false); return; }
    try {
      await audio.play();
      if (request !== requestRef.current) { audio.pause(); return; }
      setPlaying(true);
    } catch (error) {
      if (request !== requestRef.current) return;
      setPlaying(false);
      if (error.name !== 'AbortError') setUnavailable(true);
    }
  };

  return (
    <div className={`turntable ${playing ? 'is-playing' : ''}`}>
      <button type="button" onClick={toggle} disabled={unavailable || !active}
        aria-label={unavailable ? 'Midnight Chord 오디오 샘플 준비 중' : playing ? 'Midnight Chord 일시정지' : 'Midnight Chord 샘플 재생'}
        aria-pressed={playing}>
        <span className="record" aria-hidden="true"><span>MC</span></span>
        <span className="tone-arm" aria-hidden="true" />
        <span className="turntable-copy"><strong>MIDNIGHT CHORD</strong>
          <span aria-live="polite">{unavailable ? 'SAMPLE COMING SOON' : playing ? 'NOW PLAYING · PAUSE' : 'CLICK TO LISTEN · PLAY'}</span>
        </span>
        <span className="equalizer" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <i key={i} style={{ '--bar': i }} />)}</span>
      </button>
    </div>
  );
}
