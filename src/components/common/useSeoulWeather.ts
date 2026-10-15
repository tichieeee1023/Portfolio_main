import { useEffect, useState } from 'react';

type Weather = { icon: string; label: string };
const REFRESH_MS = 15 * 60 * 1000;
const ENDPOINT = 'https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=weather_code,is_day&timezone=Asia%2FSeoul';
let cached: { weather: Weather | null; fetchedAt: number } | null = null;
let pending: Promise<Weather | null> | null = null;

function weatherIcon(code: number, day: boolean): Weather | null {
  if (code === 0 || code === 1) return { icon: day ? '☀️' : '🌙', label: '맑음' };
  if (code === 2) return { icon: day ? '⛅' : '☁️', label: '구름 조금' };
  if (code === 3) return { icon: '☁️', label: '흐림' };
  if (code === 45 || code === 48) return { icon: '🌫️', label: '안개' };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code)) return { icon: '🌧️', label: '비' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: '❄️', label: '눈' };
  if ([80, 81, 82].includes(code)) return { icon: '🌦️', label: '소나기' };
  if ([95, 96, 99].includes(code)) return { icon: '⛈️', label: '뇌우' };
  return null;
}

async function loadWeather(): Promise<Weather | null> {
  if (cached && Date.now() - cached.fetchedAt < REFRESH_MS) return cached.weather;
  if (pending) return pending;
  pending = (async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(ENDPOINT, { signal: controller.signal });
      if (!response.ok) throw new Error('Weather unavailable');
      const data = await response.json();
      const code = data.current?.weather_code;
      const day = data.current?.is_day;
      const weather = typeof code === 'number' && (day === 0 || day === 1) ? weatherIcon(code, day === 1) : null;
      cached = { weather, fetchedAt: Date.now() };
      return weather;
    } catch {
      // Keep the clock usable; don't present a guessed or stale weather icon.
      cached = { weather: null, fetchedAt: Date.now() };
      return null;
    } finally {
      window.clearTimeout(timeout);
      pending = null;
    }
  })();
  return pending;
}

export function useSeoulWeather() {
  const [weather, setWeather] = useState<Weather | null>(null);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    let disposed = false;
    const update = () => {
      if (!desktop.matches) { setWeather(null); return; }
      if (document.hidden) return;
      void loadWeather().then(result => {
        if (!disposed && desktop.matches) setWeather(result);
      });
    };
    update();
    const timer = window.setInterval(update, REFRESH_MS);
    desktop.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      desktop.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  return weather;
}
