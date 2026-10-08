import { useEffect, useRef, useState } from "react";

export function useMobileLevelUpFeedback() {
  const audioRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [active, setActive] = useState(false);
  const [sequence, setSequence] = useState(0);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const audio = audioRef.current;
    audioRef.current = null;
    if (audio && audio.state !== "closed") void audio.close().catch(() => {});
  }, []);

  const play = () => {
    setSequence(value => value + 1);
    setActive(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActive(false), 750);
    if (!soundEnabled) return;

    const AudioCtor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    try {
      const audio = audioRef.current ?? new AudioCtor();
      audioRef.current = audio;
      const chime = () => {
        if (audioRef.current !== audio || audio.state !== "running") return;
        const now = audio.currentTime;
        [659.25, 987.77, 1318.51].forEach((frequency, index) => {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          const start = now + index * .065;
          oscillator.type = "triangle";
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(.075, start + .006);
          gain.gain.exponentialRampToValueAtTime(.0001, start + .13);
          oscillator.connect(gain);
          gain.connect(audio.destination);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
          oscillator.start(start);
          oscillator.stop(start + .14);
        });
      };
      if (audio.state === "running") chime();
      else void audio.resume().then(chime).catch(() => {});
    } catch { /* The visual feedback remains available when audio is unsupported. */ }
  };

  return { active, sequence, soundEnabled, play, toggleSound: () => setSoundEnabled(value => !value) };
}
