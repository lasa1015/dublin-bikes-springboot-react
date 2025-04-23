import { Marker, InfoWindow } from '@react-google-maps/api'; // 导入 Google 地图上的标记（Marker）和信息窗（InfoWindow）组件

import { useState } from 'react';                            // 引入 React 的状态管理 Hook
import InfoWindowContent from './InfoWindowContent';         // 引入自定义的信息窗内容组件
import { useRoute } from '../../contexts/RouteContext';      // 使用全局路径规划上下文（出发站和到达站的编号）
import { CurrentStation, useStationContext } from '../../contexts/StationContext';



// * const MyComponent = ({ a, b }: Props) => { ... }
// * 从父组件传进来的 props 参数是一个 Props 类型的对象，用结构赋值把 a、b 提取出来，直接在函数体中使用
// * 解构名必须跟 Props 中的字段名一致
const StationMarkers = () => {


  const { stations } = useStationContext();
  

  // 当前点击选中的车站，初始为 null
  const [selectedStation, setSelectedStation] = useState<CurrentStation | null>(null);
  
  // 从上下文中获取当前路径规划的起点编号和终点编号
  const { departureNumber, arrivalNumber } = useRoute();

  

  return (
    <>

      {/* 遍历所有车站，每个车站都渲染一个 Marker */}
      {stations.map((station) => {
        
        /** 判断当前车站是否是“出发站”或“到达站” */
        const isDeparture = station.number === departureNumber;
        const isArrival   = station.number === arrivalNumber;

        // 默认图标
        let iconUrl = '/img/bikeicon.png';             

        // 出发站的图标
        if (isDeparture) iconUrl = '/img/bikeicon_a.png'; 

        // 到达站的图标
        else if (isArrival) iconUrl = '/img/bikeicon_b.png'; 

        // 内层 return 是 map() 函数要求必须要写的
        // 决定每一个原数组中的元素，要被“转换成什么”放入新的数组中
        return (

          // Marker 是从 @react-google-maps/api 这个库中引入的组件
          <Marker

            key={station.number}   // key 用车站编号保证唯一性

            position={{ lat: station.latitude, lng: station.longitude }} // 设置 Marker 位置

            icon={{
              url: iconUrl,        // 图标 
              scaledSize: new window.google.maps.Size(32, 43),   // 图标大小
            }}

            // 点击该标记时，选中该车站，打开信息窗
            onClick={() => setSelectedStation(station)}    
          />
        );
      })}



      {/* 如果选中了某个车站，就显示信息窗 InfoWindow */}

      {selectedStation && (

        <InfoWindow
          
          position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }} // 信息窗位置

          onCloseClick={() => setSelectedStation(null)} // 关闭信息窗时，将selectedStation变量设回 null
          
          options={{

            pixelOffset: new window.google.maps.Size(0, -47) // 向上偏移 47 像素，使窗口浮在 Marker 上方
          }}
        >


          {/* 自定义的组件来展示信息窗的内容 */}
          <InfoWindowContent station={selectedStation} />


        </InfoWindow>
      )}
    </>
  );
};

export default StationMarkers;
