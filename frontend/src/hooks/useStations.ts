import { useEffect, useState } from 'react';

export interface CurrentStation {
  number: number;
  status: string;
  latitude: number;
  longitude: number;
  availableBikes: number;
  availableBikeStands: number;
  capacity: number;
}

export default function useStations() {
  const [stations, setStations] = useState<CurrentStation[]>([]);

  useEffect(() => {
    fetch('/api/current-bike/all')
      .then(res => res.json())
      .then(data => {
        console.log('站点数据:', data); // 👈 加这个
        setStations(data);
      })
      .catch(err => console.error('获取车站数据失败:', err));
  }, []);
  

  return stations;
}
