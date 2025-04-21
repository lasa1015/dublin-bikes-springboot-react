import './WeatherPanel.css';
import useWeather from '../../hooks/useWeather';
import useAirQuality from '../../hooks/useAirQuality';
import WeatherForecastPanel from './WeatherForecastPanel';
import { useState } from 'react';

const WeatherPanel = () => {
  const weather = useWeather();
  const airQuality = useAirQuality();
  const [showForecast, setShowForecast] = useState(false); // 控制是否显示预报面板

  if (!weather || !airQuality) return null;

  return (
    <>
      <div id="weather">
        <div id="temp">{weather.temp.toFixed(1)}°C</div>

        <div id="weather_icon">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`}
            alt="weather icon"
          />
        </div>

        <div id="weather_content">
          <div>Wind: {weather.windSpeed} m/s</div>
          <div>PM2.5: {airQuality.pm25} µg/m³</div>
          <button
            id="weather_prediction_btn"
            onClick={() => setShowForecast(true)}
          >
            forecast
          </button>
        </div>
      </div>

      {/* 弹出天气预报面板 */}
      {showForecast && (
        <WeatherForecastPanel onClose={() => setShowForecast(false)} />
      )}
    </>
  );
};

export default WeatherPanel;
