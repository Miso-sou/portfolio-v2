import { useState, useEffect } from 'react';

// Import all weather icons from assets
import sunIcon from '../../assets/weather/sun.png';
import cloudIcon from '../../assets/weather/cloud.png';
import cloudyIcon from '../../assets/weather/cloudy.png';
import rainIcon from '../../assets/weather/rain.png';
import drizzleIcon from '../../assets/weather/drizzle.png';
import lightningIcon from '../../assets/weather/lightning-bolt.png';
import snowIcon from '../../assets/weather/snow-storm.png';
import hazeIcon from '../../assets/weather/haze.png';
import breezyIcon from '../../assets/weather/breezy.png';
import nightIcon from '../../assets/weather/night.png';
import sunriseIcon from '../../assets/weather/sunrise.png';
import warningIcon from '../../assets/weather/warning-sign.png';

// Map Open-Meteo WMO weather codes to our icon assets
// https://open-meteo.com/en/docs (WMO Weather interpretation codes)
function getWeatherIcon(wmoCode, isDay) {
  if (!isDay) return nightIcon;

  if (wmoCode === 0) return sunIcon;                         // Clear sky
  if (wmoCode === 1) return sunIcon;                         // Mainly clear
  if (wmoCode === 2) return cloudyIcon;                      // Partly cloudy
  if (wmoCode === 3) return cloudIcon;                       // Overcast
  if (wmoCode >= 45 && wmoCode <= 48) return hazeIcon;       // Fog / rime fog
  if (wmoCode >= 51 && wmoCode <= 55) return drizzleIcon;    // Drizzle
  if (wmoCode >= 56 && wmoCode <= 57) return drizzleIcon;    // Freezing drizzle
  if (wmoCode >= 61 && wmoCode <= 65) return rainIcon;       // Rain
  if (wmoCode >= 66 && wmoCode <= 67) return rainIcon;       // Freezing rain
  if (wmoCode >= 71 && wmoCode <= 77) return snowIcon;       // Snow / snow grains
  if (wmoCode >= 80 && wmoCode <= 82) return rainIcon;       // Rain showers
  if (wmoCode >= 85 && wmoCode <= 86) return snowIcon;       // Snow showers
  if (wmoCode >= 95 && wmoCode <= 99) return lightningIcon;  // Thunderstorm

  return warningIcon; // Unknown
}

const CACHE_KEY = 'weather-icon-cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Date.now() - data.timestamp < CACHE_TTL) return data;
    }
  } catch { /* ignore */ }
  return null;
}

function saveCache(wmoCode, isDay) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ wmoCode, isDay, timestamp: Date.now() }));
  } catch { /* ignore */ }
}

/**
 * WeatherIcon — a dynamic desktop icon that fetches the user's location
 * via the browser Geolocation API, then queries the free Open-Meteo API
 * (no API key needed, no backend) to get the current weather code, and
 * displays the matching pixel-art weather icon from assets.
 *
 * Falls back to sunrise icon while loading, warning icon on error.
 */
export default function WeatherIcon({ className = 'w-12 h-12' }) {
  const [iconSrc, setIconSrc] = useState(sunriseIcon); // loading state

  useEffect(() => {
    let cancelled = false;

    // Try cache first
    const cached = loadCache();
    if (cached) {
      setIconSrc(getWeatherIcon(cached.wmoCode, cached.isDay));
      return;
    }

    // 1. Get user location
    if (!navigator.geolocation) {
      setIconSrc(warningIcon);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return;
        try {
          const { latitude, longitude } = pos.coords;
          // 2. Fetch weather from Open-Meteo (free, no API key)
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Weather API error');
          const data = await res.json();

          if (cancelled) return;

          const wmoCode = data.current_weather.weathercode;
          const isDay = data.current_weather.is_day === 1;

          saveCache(wmoCode, isDay);
          setIconSrc(getWeatherIcon(wmoCode, isDay));
        } catch {
          if (!cancelled) setIconSrc(warningIcon);
        }
      },
      () => {
        // Geolocation denied / error — fall back to sun
        if (!cancelled) setIconSrc(sunIcon);
      },
      { timeout: 10000 }
    );

    return () => { cancelled = true; };
  }, []);

  return <img src={iconSrc} className={className} alt="Weather" draggable={false} />;
}
