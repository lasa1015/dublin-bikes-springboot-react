import { useEffect, useState } from 'react';

export interface ForecastItem {
  id: number;
  forecastTime: string;
  weatherIcon: string;
  temp: number;
  windSpeed: number;
}

const useForecast = (): ForecastItem[] => {
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);

  useEffect(() => {
    fetch('/api/current-weather-forecast/all')
      .then((res) => res.json())
      .then((data) => {
        // 对数据进行整理，只保留需要的字段并排序
        const processed = data.map((item: any) => ({
          id: item.id,
          forecastTime: item.forecastTime,
          weatherIcon: item.weatherIcon,
          temp: item.temp,
          windSpeed: item.windSpeed,
        })).sort((a, b) =>
          new Date(a.forecastTime).getTime() - new Date(b.forecastTime).getTime()
        );

        setForecastData(processed);
      })
      .catch((err) => console.error('❌ 获取天气预报失败:', err));
  }, []);

  return forecastData;
};

export default useForecast;
