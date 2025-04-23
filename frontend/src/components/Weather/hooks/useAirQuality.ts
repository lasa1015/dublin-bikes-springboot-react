import { useEffect, useState } from 'react';

export interface AirQualityData {
  pm25: number;
}

// 自定义 Hook 就是你自己写的一个函数，它 名字以 use 开头，并且 内部用到了其它 Hook（如 useState、useEffect 等）。
// 自定义 Hook 的本质是：封装可复用的“带有状态/副作用逻辑”的代码块
// export default function 把这个“函数”设为默认导出，别的文件可以直接 import xxx from ...
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
