import './WeatherForecastPanel.css';

// 引入自定义 Hook：用于获取天气预测数据
import useForecast from './hooks/useForecast';

// 引入图表组件：react-google-charts 用于画图
import { Chart } from 'react-google-charts';

// 引入图表通用样式配置对象
import { baseChartOptions } from './chartOptions';


// onClose 函数，由父组件传入，用于点击 "×" 时关闭面板
const WeatherForecastPanel = ({ onClose }: { onClose: () => void }) => {

  // 调用自定义 Hook，获取天气预报数组
  const forecastData = useForecast();

  // 只显示前 8 条天气预测数据（避免图表太挤）
  const displayedData = forecastData.slice(0, 8);

  // 如果数据为空或尚未加载完全，什么都不显示
  if (!forecastData || forecastData.length === 0) return null;

  //  准备图表数据, Google Chart 需要的数据格式是一个“二维数组”
  // [
  //   ['横轴标签', '纵轴标题'],
  //   ['08:00', 12.3],
  //   ['09:00', 13.1],
  //   ['10:00', 14.2],
  //   ...
  // ]
  const tempChartData = [
    ['Time', 'Temperature (°C)'],     //['横轴标签', '纵轴标题'],
    ...displayedData.map((item) => [  // 对 displayedData（前 8 条天气预报）执行 map 遍历

      // 把原本是时间戳的 forecastTime 转成 JS 的时间对象,再用 toLocaleTimeString 转成类似 08:00、14:30 的格式
      // 作为横轴的标签
      new Date(item.forecastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      item.temp,  //该时间点的温度，作为 纵轴的值。
    ]),
  ];

  
  const windChartData = [
    ['Time', 'Wind Speed (m/s)'],
    ...displayedData.map((item) => [
      new Date(item.forecastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      item.windSpeed,
    ]),
  ];

  return (
    <div id="weather_more">

      {/* 关闭按钮，点击时执行 onClose 函数 */}
      <div className="close" onClick={onClose}>×</div>

      {/* 天气图标区域 */}
      <div id="weather_condition">

        {/* 遍历前 8 条天气预报数据，显示天气图标和时间 */}
        
        {displayedData.map((item, idx) => (

          //  item 是数组中的每一个对象，idx 是索引值 
          <div key={idx} className="forecast_icon">

            {/* 天气图标 */}
            <img
              src={`https://openweathermap.org/img/wn/${item.weatherIcon}@2x.png`}
              alt={item.weatherDescription}
            />

            {/* 显示小时（例：14:00） */}
            <div>{new Date(item.forecastTime).getHours()}:00</div>
          </div>
        ))}
      </div>

      {/* 温度折线图 */}
      <div id="weather_temperature">

        <Chart
          chartType="LineChart"             // 图表类型：折线图
          data={tempChartData}              // 图表数据
          width="100%"                      // 图表宽度
          height="100%" //  高度百分比自适应
          options={{
            ...baseChartOptions,            // 使用另一个文件写好的统一样式
            title: 'Temperature (°C)',      // 图表标题
            colors: ['#00b3aa'],            // 折线颜色（青绿色）
          }}
        />
      </div>

      {/* 风速折线图 */}
      <div id="weather_wind">
        <Chart
          chartType="LineChart"
          data={windChartData}
          width="100%"
          height="100%" //  高度百分比自适应
          options={{
            ...baseChartOptions,
            title: 'Wind Speed (m/s)',
            colors: ['#ff9966'],           // 折线颜色（橘色）
          }}
        />
      </div>
    </div>
  );
};

export default WeatherForecastPanel;
