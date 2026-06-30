import { useState, useEffect } from 'react';
import sunIcon from '../assets/weather/sun.png';
import cloudIcon from '../assets/weather/cloud.png';
import cloudyIcon from '../assets/weather/cloudy.png';
import rainIcon from '../assets/weather/rain.png';
import drizzleIcon from '../assets/weather/drizzle.png';
import lightningIcon from '../assets/weather/lightning-bolt.png';
import snowIcon from '../assets/weather/snow-storm.png';
import hazeIcon from '../assets/weather/haze.png';
import breezyIcon from '../assets/weather/breezy.png';
import nightIcon from '../assets/weather/night.png';
import sunriseIcon from '../assets/weather/sunrise.png';
import warningIcon from '../assets/weather/warning-sign.png';

function getWeatherDescription(wmoCode) {
  if (wmoCode === 0) return 'CLEAR SKY';
  if (wmoCode === 1) return 'MAINLY CLEAR';
  if (wmoCode === 2) return 'PARTLY CLOUDY';
  if (wmoCode === 3) return 'OVERCAST';
  if (wmoCode >= 45 && wmoCode <= 48) return 'HAZE / FOG';
  if (wmoCode >= 51 && wmoCode <= 55) return 'DRIZZLE';
  if (wmoCode >= 56 && wmoCode <= 57) return 'FREEZING DRIZZLE';
  if (wmoCode >= 61 && wmoCode <= 65) return 'RAIN';
  if (wmoCode >= 66 && wmoCode <= 67) return 'FREEZING RAIN';
  if (wmoCode >= 71 && wmoCode <= 77) return 'SNOW';
  if (wmoCode >= 80 && wmoCode <= 82) return 'RAIN SHOWERS';
  if (wmoCode >= 85 && wmoCode <= 86) return 'SNOW SHOWERS';
  if (wmoCode >= 95 && wmoCode <= 99) return 'THUNDERSTORM';
  return 'UNKNOWN';
}

function getWeatherIcon(wmoCode, isDay = true) {
  if (!isDay && (wmoCode === 0 || wmoCode === 1)) return nightIcon;
  if (wmoCode === 0) return sunIcon;
  if (wmoCode === 1) return sunIcon;
  if (wmoCode === 2) return cloudyIcon;
  if (wmoCode === 3) return cloudIcon;
  if (wmoCode >= 45 && wmoCode <= 48) return hazeIcon;
  if (wmoCode >= 51 && wmoCode <= 55) return drizzleIcon;
  if (wmoCode >= 56 && wmoCode <= 57) return drizzleIcon;
  if (wmoCode >= 61 && wmoCode <= 65) return rainIcon;
  if (wmoCode >= 66 && wmoCode <= 67) return rainIcon;
  if (wmoCode >= 71 && wmoCode <= 77) return snowIcon;
  if (wmoCode >= 80 && wmoCode <= 82) return rainIcon;
  if (wmoCode >= 85 && wmoCode <= 86) return snowIcon;
  if (wmoCode >= 95 && wmoCode <= 99) return lightningIcon;
  return warningIcon;
}

const formatDay = (dateString) => {
  const [y, m, d] = dateString.split('-');
  const date = new Date(y, m - 1, d);
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return days[date.getDay()];
};

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return;
        try {
          const { latitude, longitude } = pos.coords;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('API Error');
          const data = await res.json();

          if (cancelled) return;
          
          const daily = data.daily.time.map((t, i) => ({
            time: t,
            weathercode: data.daily.weathercode[i],
            maxTemp: Math.round(data.daily.temperature_2m_max[i]),
            minTemp: Math.round(data.daily.temperature_2m_min[i]),
          })).slice(1, 6); // next 5 days

          // Reverse geocode to get city name
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`);
            const geoData = await geoRes.json();
            const addr = geoData.address;
            setCity(addr?.city || addr?.town || addr?.village || addr?.county || null);
          } catch {
            // City name is non-critical, ignore errors
          }

          setWeather({
            current: {
              temp: Math.round(data.current_weather.temperature),
              wmoCode: data.current_weather.weathercode,
              isDay: data.current_weather.is_day === 1,
              windSpeed: Math.round(data.current_weather.windspeed),
            },
            daily
          });
          setLoading(false);
        } catch (err) {
          if (!cancelled) {
            setError('Failed to fetch weather');
            setLoading(false);
          }
        }
      },
      (err) => {
        if (!cancelled) {
          setError('Location access denied');
          setLoading(false);
        }
      },
      { timeout: 10000 }
    );

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-os-bg">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <img src={sunriseIcon} className="w-16 h-16" style={{ imageRendering: 'pixelated' }} alt="Loading" />
          <span className="font-display text-[10px] text-os-ink">FETCHING SATELLITE DATA...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-os-bg p-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <img src={warningIcon} className="w-16 h-16" style={{ imageRendering: 'pixelated' }} alt="Error" />
          <span className="font-display text-[10px] text-os-ink text-red-700">{error}</span>
          <span className="font-body text-lg text-os-ink mt-2">Please enable location access.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full border-2 bg-os-window overflow-hidden">
      {/* Current Weather Area */}
      <div className="flex border-b-2 border-os-ink shrink-0 bg-os-accent">
        <div className="flex-1 p-3 flex flex-col items-center justify-center border-r-2 border-os-ink gap-2">
          <img 
            src={getWeatherIcon(weather.current.wmoCode, weather.current.isDay)} 
            className="w-16 h-16 drop-shadow-md" 
            style={{ imageRendering: 'pixelated' }} 
            alt="Current Weather" 
          />
          <div className="font-display text-xl text-os-ink mt-1 flex items-start">
            {weather.current.temp}
            <span className="text-[10px] ml-0.5 mt-0.5">°C</span>
          </div>
        </div>
        
        <div className="flex-1 p-3 flex flex-col justify-center gap-2">
          <div>
            <div className="font-display text-[10px] text-os-ink opacity-70 mb-1">CONDITIONS</div>
            <div className="font-body text-xl text-os-ink leading-none uppercase">
              {getWeatherDescription(weather.current.wmoCode)}
            </div>
          </div>
          
          <div className="w-full h-[2px] bg-os-ink opacity-20 my-0.5"></div>

          {city && (
            <div>
              <div className="font-display text-[10px] text-os-ink opacity-70 mb-1">LOCATION</div>
              <div className="font-body text-xl text-os-ink leading-none">
                {city}
              </div>
            </div>
          )}
          
          <div className="w-full h-[2px] bg-os-ink opacity-20 my-0.5"></div>
          
          <div>
            <div className="font-display text-[10px] text-os-ink opacity-70 mb-1">WIND SPEED</div>
            <div className="font-body text-xl text-os-ink leading-none">
              {weather.current.windSpeed} km/h
            </div>
          </div>
        </div>
      </div>

      {/* Forecast List */}
      <div className="flex-1 overflow-y-auto retro-scrollbar bg-os-bg p-3 flex flex-col">
        <div className="font-display text-[8px] text-os-ink mb-2 px-1">
          // 5-DAY FORECAST
        </div>
        <div className="flex flex-col gap-2">
          {weather.daily.map(day => (
            <div 
              key={day.time} 
              className="flex items-center justify-between border-2 border-os-ink bg-os-window p-2 hover:bg-os-accent transition-colors"
            >
              <div className="font-display text-[8px] w-10 text-os-ink shrink-0">
                {formatDay(day.time)}
              </div>
              <img 
                src={getWeatherIcon(day.weathercode, true)} 
                className="w-8 h-8 drop-shadow-sm shrink-0" 
                style={{ imageRendering: 'pixelated' }} 
                alt="Forecast"
              />
              <div className="font-body text-lg flex gap-3 w-16 justify-end shrink-0">
                <span className="text-os-ink opacity-50">{day.minTemp}°</span>
                <span className="text-os-ink font-bold">{day.maxTemp}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
