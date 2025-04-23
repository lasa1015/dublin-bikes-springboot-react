// src/components/Map/GoogleMapContainer.tsx

import { useRef, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

import StationMarkers from './StationMarkers';
import { useRoute } from '../../contexts/RouteContext';


// 引入单独的地图样式配置文件（尺寸、默认中心点、地图参数）
import { mapStyle, defaultCenter, mapOptions } from './config/mapOptions';

// 引入两个自定义 Hook（已经从原文件中拆出）
import useDrawOverlayCircles from './hooks/useDrawOverlayCircles';
import useRoutePlanner from './hooks/useRoutePlanner';

interface Props {
  searchLocation: google.maps.LatLngLiteral | null;
}

export default function GoogleMapContainer({ searchLocation }: Props) {


  //* useRef 是 React 提供的一个 保存“可变值”但不会引发组件重新渲染的工具。
  //* useState 的值一变，React 会重新渲染整个组件
  //* const ref = useRef<类型>(初始值);
  // 把 Google 地图对象保存在 mapRef.current 里, 后续可以在任意地方访问地图
  const mapRef = useRef<google.maps.Map | null>(null);


  // 自定义 Hook：绘制/更新图层圆圈
  useDrawOverlayCircles(mapRef);

  // 自定义 Hook：根据 routeTrigger 触发路线规划
  useRoutePlanner(mapRef);

  /* ------------------------ 搜索框定位（平移地图） ------------------------ */
  useEffect(() => {
    if (searchLocation && mapRef.current) {
      mapRef.current.panTo(searchLocation);
    }
  }, [searchLocation]);


  return (

    <GoogleMap
      mapContainerStyle={mapStyle}
      center={searchLocation ?? defaultCenter}
      zoom={searchLocation ? 16 : 14}
      onLoad={map => (mapRef.current = map)}
      options={mapOptions}
    >

      {/* 车站固定 Marker */}
      <StationMarkers />

      {/* 搜索得到的临时 Marker */}
      {searchLocation && (
        <Marker position={searchLocation} />
      )}

      {/* 路线渲染，关闭默认 A/B 标记 */}
      {useRoute().routeResult && (
        <DirectionsRenderer
          directions={useRoute().routeResult}
          options={{ suppressMarkers: true, suppressBicyclingLayer: true }}
        />
      )}
    </GoogleMap>
  );
}
