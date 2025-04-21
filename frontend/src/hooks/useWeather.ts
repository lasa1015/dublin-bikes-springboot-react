import { useEffect, useState } from 'react';

export interface WeatherData {
  temp: number;
  windSpeed: number;
  weatherIcon: string;
}

export default function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch('/api/current-weather/latest')
      .then(res => res.json())
      .then(data => {
        setWeather({
          temp: data.temp,
          windSpeed: data.windSpeed,
          weatherIcon: data.weatherIcon,
        });
      })
      .catch(err => console.error('❌ 获取天气失败:', err));
  }, []);

  return weather;
}
