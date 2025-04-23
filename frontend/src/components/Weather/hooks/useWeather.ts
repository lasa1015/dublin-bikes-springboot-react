import { useEffect, useState } from 'react';

export interface WeatherData {
  temp: number;
  windSpeed: number;
  weatherIcon: string;
}

export default function useWeather() {

  // 创建一个叫 weather 的状态变量，它的类型是 WeatherData 或 null，初始值是 null
  // 还提供一个 setWeather 的函数来修改这个状态
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {

    // fetch 是一个 函数，是 浏览器原生自带的 API，不需要导入就能用, 用来向服务器发送 HTTP 请求
    fetch('/api/current-weather/latest')
      .then(res => res.json())
      .then(data => {    
        
         //* 返回的数据结构是数组，TS 会自动宽松校验数组项，写成setXXX(data)即可
         //* 返回的数据是单个对象，TS 会严格检查有没有多余字段， 需要 手动把接口里有的字段一项一项地提取出来赋值    
        setWeather({        

          temp: data.temp,
          windSpeed: data.windSpeed,
          weatherIcon: data.weatherIcon,
        });
      })
      .catch(err => console.error('❌ 获取天气失败:', err));
  }, []);

  return weather;
}
