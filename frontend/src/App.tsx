import { useEffect, useState } from 'react';
import './App.css';

interface AirQuality {
  recordedTime: string;
  longitude: number;
  latitude: number;
  aqi: number;
  pm25: number;
  pm10: number;
}

interface CurrentWeather {
  timestamp: string;
  longitude: number;
  latitude: number;
  weatherMain: string;
  weatherDescription: string;
  weatherIcon: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  pressure: number;
  humidity: number;
  visibility: number | null;
  windSpeed: number;
  windDeg: number;
  clouds: number;
}

function App() {
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [weather, setWeather] = useState<CurrentWeather | null>(null);

  useEffect(() => {
    fetch('/api/airquality/latest')
      .then((res) => res.json())
      .then(setAirQuality)
      .catch((err) => console.error('获取空气质量失败:', err));

    fetch('/api/current-weather/latest')
      .then((res) => res.json())
      .then(setWeather)
      .catch((err) => console.error('获取天气数据失败:', err));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>都柏林环境信息</h1>

      {/* 空气质量模块 */}
      <section style={{ marginBottom: '2rem', background: '#f4f4f4', padding: '1rem', borderRadius: '10px' }}>
        <h2>当前空气质量</h2>
        {airQuality ? (
          <div>
            <p><strong>时间：</strong>{new Date(airQuality.recordedTime).toLocaleString()}</p>
            <p><strong>位置：</strong>经度 {airQuality.longitude}, 纬度 {airQuality.latitude}</p>
            <p><strong>AQI：</strong>{airQuality.aqi}</p>
            <p><strong>PM2.5：</strong>{airQuality.pm25}</p>
            <p><strong>PM10：</strong>{airQuality.pm10}</p>
          </div>
        ) : (
          <p>正在加载空气质量数据...</p>
        )}
      </section>

      {/* 天气模块 */}
      <section style={{ background: '#e0f7fa', padding: '1rem', borderRadius: '10px' }}>
        <h2>当前天气</h2>
        {weather ? (
          <div>
            <p><strong>时间：</strong>{new Date(weather.timestamp).toLocaleString()}</p>
            <p><strong>天气：</strong>{weather.weatherMain}（{weather.weatherDescription}）</p>
            <p><strong>温度：</strong>{weather.temp}°C，体感 {weather.feelsLike}°C</p>
            <p><strong>湿度：</strong>{weather.humidity}%</p>
            <p><strong>风速：</strong>{weather.windSpeed} m/s，风向 {weather.windDeg}°</p>
            <p><strong>气压：</strong>{weather.pressure} hPa</p>
            <p><strong>云量：</strong>{weather.clouds}%</p>
            {weather.weatherIcon && (
              <img
                src={`http://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`}
                alt="天气图标"
              />
            )}
          </div>
        ) : (
          <p>正在加载天气数据...</p>
        )}
      </section>
    </div>
  );
}

export default App;
