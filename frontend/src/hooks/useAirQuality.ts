import { useEffect, useState } from 'react';

export interface AirQualityData {
  pm25: number;
}

export default function useAirQuality() {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);

  useEffect(() => {
    
    fetch('/api/airquality/latest')
      .then(res => res.json())
      .then(data => {
        setAirQuality({

          pm25: data.pm25,
        });
      })
      .catch(err => console.error('❌ 获取空气质量失败:', err));
  }, []);

  return airQuality;
}
