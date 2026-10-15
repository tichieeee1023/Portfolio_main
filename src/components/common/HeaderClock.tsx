import { useEffect, useState } from 'react';
import './HeaderClock.css';
import { useSeoulWeather } from './useSeoulWeather';

const koreaTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

export default function HeaderClock() {
  const [now, setNow] = useState<Date | null>(null);
  const weather = useSeoulWeather();

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    let timer: number | undefined;
    const update = () => {
      window.clearTimeout(timer);
      if (!desktop.matches) { setNow(null); return; }
      setNow(new Date());
      timer = window.setTimeout(update, 60000 - Date.now() % 60000);
    };
    update();
    desktop.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearTimeout(timer);
      desktop.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  if (!now) return null;
  const time = koreaTime.format(now);
  return <time className="headerClock" dateTime={now.toISOString()} aria-label={`한국 시간 ${time}${weather ? ", 서울 " + weather.label : ""}`}>
    {weather && <a className="headerWeather" href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" aria-label={`서울 날씨: ${weather.label}, Open-Meteo 제공`} title={`서울 · ${weather.label} / Weather by Open-Meteo`}><span aria-hidden="true">{weather.icon}</span></a>}
    <span>SEOUL</span><span aria-hidden="true">·</span><span className="headerClockTime">{time}</span><span className="headerClockZone">KST</span>
  </time>;
}
