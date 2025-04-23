import { useEffect, useState } from 'react';

// 定义一个接口 ForecastItem，用于规定每一项天气预报对象的数据结构
export interface ForecastItem {
  id: number;               // 每条预报记录的唯一 ID（来自数据库）
  forecastTime: string;     // 预报的时间（格式为字符串）
  weatherIcon: string;      // 天气图标的 ID（用于在前端展示图标）
  temp: number;             // 温度（摄氏度）
  windSpeed: number;        // 风速（米/秒）
}


// * 返回值类型是 ForecastItem[] ，可选择写or不写
// * TS（TypeScript）强制要求这个函数最后 return 出来的东西必须满足这个类型结构，否则会报错。
export default function useForecast (): ForecastItem[]  {
  
  // 创建一个名为 forecastData 的状态变量（初始值为空数组）
  // setForecastData 是用于更新该状态的函数
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);

  // 使用 useEffect， 组件加载时向后端请求数据
  useEffect(() => {

    // 发送 GET 请求，获取所有天气预报数据
    fetch('/api/current-weather-forecast/all')
      .then((res) => res.json())  // 把响应转换为 JSON 数据
      .then((data) => {

        // 对原始数据进行加工（只保留我们想要展示的字段）
        const processed = data.map((item: any) => ({
          id: item.id,                            // 数据库 ID
          forecastTime: item.forecastTime,        // 预报时间
          weatherIcon: item.weatherIcon,          // 天气图标 ID
          temp: item.temp,                        // 温度
          windSpeed: item.windSpeed               // 风速
        }))
        
        // 把整理好的数据更新到状态中，供组件使用
        setForecastData(processed);
      })
      .catch((err) => console.error('❌ 获取天气预报失败:', err)); // 错误处理
  }, []); // 依赖数组为空，表示只在组件首次挂载时运行一次

  // 返回最终的天气预报数组
  return forecastData;
};
