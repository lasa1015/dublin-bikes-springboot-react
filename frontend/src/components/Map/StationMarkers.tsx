import { Marker } from '@react-google-maps/api';             // 只引入 Marker
import { useStationContext } from '../../contexts/StationContext';
import { useRoute } from '../../contexts/RouteContext';
import { useSelectedStation } from '../../contexts/SelectedStationContext';

import SelectedStationInfo from './SelectedStationInfo';  // ✅ 引入新的整合组件
import { useState } from 'react';

const StationMarkers = () => {
  const { stations } = useStationContext();
  const { departureNumber, arrivalNumber } = useRoute();
  const { setSelectedStation } = useSelectedStation();

  // ✅ 控制信息窗是否显示（默认 false）
  const [openInfoWindow, setOpenInfoWindow] = useState(false);

  return (
    <>
      {/* 遍历所有车站，每个车站都渲染一个 Marker */}
      {stations.map((station) => {
        /** 判断当前车站是否是“出发站”或“到达站” */
        const isDeparture = station.number === departureNumber;
        const isArrival   = station.number === arrivalNumber;

        // 默认图标
        let iconUrl = '/img/bikeicon.png';             

        // 出发站图标
        if (isDeparture) iconUrl = '/img/bikeicon_a.png'; 
        // 到达站图标
        else if (isArrival) iconUrl = '/img/bikeicon_b.png'; 

        return (
          <Marker
            key={station.number}   // key 用车站编号保证唯一性
            position={{ lat: station.latitude, lng: station.longitude }} // 设置 Marker 位置
            icon={{
              url: iconUrl,        
              scaledSize: new window.google.maps.Size(32, 43),   // 图标大小
            }}
            // ✅ 点击 Marker 时：先关闭，再重新打开（解决重复点击无效的问题）
            onClick={() => {
              setOpenInfoWindow(false);
              setSelectedStation(station);
              setTimeout(() => setOpenInfoWindow(true), 0);
            }}
          />
        );
      })}

      {/* 显示选中的站点信息窗口（内部自己判断是否展示） */}
      <SelectedStationInfo
        openInfoWindow={openInfoWindow}
        setOpenInfoWindow={setOpenInfoWindow}
      />
    </>
  );
};

export default StationMarkers;
