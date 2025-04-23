// 引入 React 中的 Hook，用于加载 Google Maps 脚本
import { useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';

// 引入全局路线上下文 Provider，用于管理用户选中的出发/到达站点
import { RouteProvider } from './contexts/RouteContext'; 

// 引入新抽离的图层状态上下文 Provider（负责管理 showBikesLayer / showStandsLayer）
import { OverlayProvider, useOverlay } from './contexts/OverlayContext';

import Header from './components/Header/Header';
import WeatherPanel from './components/Weather/WeatherPanel';
import JourneyPlanner from './components/Planner/JourneyPlanner';
import GoogleMapContainer from './components/Map/GoogleMapContainer';
import ToggleOverlayButtons from './components/Map/ToggleOverlayButtons';
import Legend from './components/Map/Legend';
import { StationProvider } from './contexts/StationContext';

// App 是整个前端的主组件，负责组合和管理所有子组件
export default function App() {
  // 通过 useJsApiLoader 异步加载 Google Maps 脚本 
  // * useJsApiLoader 是 谷歌地图官方 React 库 @react-google-maps/api 提供的
  // * 直接用原生 JS 加载地图脚本会很麻烦， useJsApiLoader 封装好了这套流程
  // * 之前已经安装过了所以可以使用  npm install @react-google-maps/api
  // * useJsApiLoader() 这个钩子，它返回的其实是一个对象：
  // * {
  // *    isLoaded: boolean,      // 表示地图脚本是否加载完成（true/false）
  // *    loadError: Error | undefined   //表示加载过程中是否出错（如果出错，这里会是一个 Error 对象）
  // * }
  // * const { isLoaded, loadError } 两个变量是“从对象中解构赋值”出来的
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: ['places', 'geometry'],   // 指定额外加载哪些 Google Maps 模块（如地点搜索和路径几何计算）
  });

  // searchLocation 表示用户在右下角搜索框中选中的地图位置（经纬度）
  const [searchLocation, setSearchLocation] = useState<google.maps.LatLngLiteral | null>(null);
  



  // 地图脚本尚未加载完成时，展示加载提示
  if (!isLoaded) return <div>地图脚本加载中…</div>;

  // 地图脚本加载失败时提示
  if (loadError) return <div>地图脚本加载失败</div>;


  
  
  // 所有资源加载完成后，正式渲染页面内容
  return (
    // 全局上下文提供器，包裹所有组件，提供路线选择功能
    <RouteProvider>
      {/* 图层显示状态的全局上下文提供器 */}
      <OverlayProvider>

      <StationProvider>
        <Header />


        <ToggleOverlayButtons/>

        <WeatherPanel />

        {/* 传给 JourneyPlanner 组件一个名叫 onLocationSelect 的 prop，它的值是一个函数 setSearchLocation。*/}
        <JourneyPlanner onLocationSelect={setSearchLocation} />

      
         <Legend />

        {/* 把父组件状态变量传给 GoogleMapContainer 子组件使用 */}
        <GoogleMapContainer searchLocation={searchLocation}
        />
           </StationProvider>
      </OverlayProvider>
    </RouteProvider>
  );
}
