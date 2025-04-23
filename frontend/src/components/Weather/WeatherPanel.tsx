import './WeatherPanel.css';

// 引入自定义 Hook：用于从后端或 API 获取当前天气数据
import useWeather from './hooks/useWeather';

// 引入自定义 Hook：用于从后端或 API 获取当前空气质量数据（例如 PM2.5）
import useAirQuality from './hooks/useAirQuality';

// 引入天气预报面板组件，用于显示未来一段时间的天气折线图
import WeatherForecastPanel from './WeatherForecastPanel';

// 引入 React 的 useState Hook，用于控制组件内部状态（是否显示天气预报）
import { useState } from 'react';


const WeatherPanel = () => {

  // 调用自定义 hook 获取当前天气数据
  const weather = useWeather();

  // 调用自定义 hook 获取当前空气质量
  const airQuality = useAirQuality();

  // 变量：是否显示天气预报面板，初始为 false
  const [showForecast, setShowForecast] = useState(false);

  // * 如果当前天气数据 或 空气质量数据还没加载好，就什么都不渲染
  // * 因为 useWeather() 和 useAirQuality() 是异步获取数据的 hook，
  // * 在页面第一次加载的时候，它们的值可能是 undefined 或 null。
  // * 这时候如果你就直接访问 weather.temp，就会报错
  // * 如果删掉这一句，必须保证下面所有用到 weather.xxx 和 airQuality.xxx 的地方都加上保护判断，
  // * 比如：{weather && <div>{weather.temp.toFixed(1)}°C</div>}
  if (!weather || !airQuality) return null;

  return (
    <>

      <div id="weather">

        {/* 温度，保留 1 位小数 */}
        <div id="temp">{weather.temp.toFixed(1)}°C</div>

        {/* 天气图标（使用 OpenWeather 提供的图标链接） */}
        <div id="weather_icon">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`}
            alt="weather icon"
          />
        </div>


        <div id="weather_content">
           {/* 风速、PM2.5*/}
          <div>Wind: {weather.windSpeed} m/s</div>
          <div>PM2.5: {airQuality.pm25} µg/m³</div>

          {/* 天气预报按钮 */}
          <button
            id="weather_prediction_btn"

            //* 点击按钮后，修改 showForecast 状态为 true，显示天气预报面板
            onClick={() => setShowForecast(true)}
          >
            weather forecast
          </button>
        </div>
      </div>

      {/* 如果 showForecast 为 true，就渲染天气预报折线图面板 */}
      {showForecast && ( 

        //* 把关闭函数 onClose 传给子组件，子组件调用这个函数就能关闭面板
        <WeatherForecastPanel onClose={() => setShowForecast(false)} />
      )}
    </>
  );
};

// 默认导出组件，让外部可以通过 import 使用
export default WeatherPanel;
