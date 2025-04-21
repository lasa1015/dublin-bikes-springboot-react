import './WeatherForecastPanel.css';
import useForecast from '../../hooks/useForecast';
import { Chart } from 'react-google-charts';

const WeatherForecastPanel = ({ onClose }: { onClose: () => void }) => {
  const forecastData = useForecast();
  const displayedData = forecastData.slice(0, 8); // 只显示前 8 条

  if (!forecastData || forecastData.length === 0) return null;

  const tempChartData = [
    ['Time', 'Temperature (°C)'],
    ...displayedData.map((item) => [
      new Date(item.forecastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      item.temp,
    ]),
  ];

  const windChartData = [
    ['Time', 'Wind Speed (m/s)'],
    ...displayedData.map((item) => [
      new Date(item.forecastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      item.windSpeed,
    ]),
  ];

  const baseOptions = {
    legend: 'none',
    curveType: 'none',
    lineWidth: 2,
    pointSize: 4,
    hAxis: {
      textStyle: { fontSize: 12.5 },
      gridlines: {
        color: '#cccccc', // 横线颜色
        count: 4,
      },
    },
    vAxis: {
      textStyle: { fontSize: 13 },
      gridlines: {
        color: '#cccccc', // 竖线颜色
        count: 5,
      },
    },
    chartArea: {
      width: '88%',
      height: '70%',
      top: 40, 
    },
    titleTextStyle: {
      fontSize: 16,     // ✅ 标题字体更大
    
      bold: true,
      color: '#333',
    },
    backgroundColor: 'transparent',  // ✅ 背景透明（可根据需要换为白色）
  };
  

  return (
    <div id="weather_more">
      <div className="close" onClick={onClose}>×</div>

      <div id="weather_condition">
        {displayedData.map((item, idx) => (
          <div key={idx} className="forecast_icon">
            <img
              src={`https://openweathermap.org/img/wn/${item.weatherIcon}@2x.png`}
              alt={item.weatherDescription}
            />
            <div>{new Date(item.forecastTime).getHours()}:00</div>
          </div>
        ))}
      </div>

      <div id="weather_temperature">
        <Chart
          chartType="LineChart"
          data={tempChartData}
          width="100%"
          height="250px"
          options={{
            ...baseOptions,
            title: 'Temperature (°C)',
            colors: ['#00b3aa'], 
          }}
        />
      </div>

      <div id="weather_wind">
        <Chart
          chartType="LineChart"
          data={windChartData}
          width="100%"
          height="250px"
          options={{
            ...baseOptions,
            title: 'Wind Speed (m/s)',
            colors: ['#ff9966'], // ✅ 紫色风速线
          }}
        />
      </div>
    </div>
  );
};

export default WeatherForecastPanel;
