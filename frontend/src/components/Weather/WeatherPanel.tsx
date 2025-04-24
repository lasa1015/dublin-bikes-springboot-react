import './WeatherPanel.css';

// 引入自定义 Hook：用于从后端或 API 获取当前天气数据
import useWeather from './hooks/useWeather';

// 引入自定义 Hook：用于从后端或 API 获取当前空气质量数据（例如 PM2.5）
import useAirQuality from './hooks/useAirQuality';


// 引入全局 LeftPanelContext 来控制天气预报面板的显示状态
import { useLeftPanel } from '../../contexts/LeftPanelContext';

const WeatherPanel = () => {

  // 调用自定义 hook 获取当前天气数据
  const weather = useWeather();

  // 调用自定义 hook 获取当前空气质量
  const airQuality = useAirQuality();

  // 从全局 Context 获取面板状态和控制函数
  const { currentPanel, openPanel, closePanel } = useLeftPanel();

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
          {/* 风速、PM2.5 */}
          <div>Wind: {weather.windSpeed} m/s</div>
          <div>PM2.5: {airQuality.pm25} µg/m³</div>

          {/* 天气预报按钮 */}
          <button
            id="weather_prediction_btn"

            // 点击按钮后，打开天气预报面板（设置为 'weather'）。再次点击时关闭面板
            onClick={() =>
              currentPanel === 'weather' ? closePanel() : openPanel('weather')
            }
            
          >
            weather forecast
          </button>
        </div>
      </div>
    
    </>
  );
};

// 默认导出组件，让外部可以通过 import 使用
export default WeatherPanel;
