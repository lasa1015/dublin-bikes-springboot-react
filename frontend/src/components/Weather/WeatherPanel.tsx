import './WeatherPanel.css';
import useWeather from '../../hooks/useWeather';
import useAirQuality from '../../hooks/useAirQuality';

const WeatherPanel = () => {
  const weather = useWeather();
  const airQuality = useAirQuality();

  if (!weather || !airQuality) return null;

  return (
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
        <button id="weather_prediction_btn">forecast</button>
      </div>
    </div>
  );
};

export default WeatherPanel;
