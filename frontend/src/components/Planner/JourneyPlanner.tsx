import './JourneyPlanner.css';
import { useEffect, useRef, useState } from 'react';

// 自定义 Hook：获取所有站点数据（从后端获取，包含编号、坐标、名称等）
import useStations from '../../hooks/useStations';

// 全局上下文：用于管理路线相关状态（出发站/到达站、触发路线等）
import { useRoute } from '../../contexts/RouteContext';

// 组件参数类型：onLocationSelect 是一个函数，用于将用户搜索选中的位置传给父组件
interface Props {
  onLocationSelect: (loc: google.maps.LatLngLiteral | null) => void;
}


export default function JourneyPlanner({ onLocationSelect }: Props) {

  const stations = useStations(); // 获取站点数据，用于下拉框显示

  const {
    departureNumber,       // 当前选中的出发站编号
    arrivalNumber,         // 当前选中的到达站编号
    setDepartureNumber,    // 设置出发站编号
    setArrivalNumber,      // 设置到达站编号
    fireRoute,             // 触发路径规划
    clearAll,              // 一键清除所有状态（出发站、到达站）
  } = useRoute();

  /* ---------- gmp-place-autocomplete 的状态 ---------- */
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);



  // 当用户选择了一个搜索结果时，自动获取其坐标并调用父组件提供的 onLocationSelect
  useEffect(() => {
    const el = document.querySelector('gmp-place-autocomplete'); // 获取原生 HTML 元素
    const handler = async (e: any) => {
      const place = await e.detail.place;
      setSelectedPlace(place);
      place.geometry?.location &&
        onLocationSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
    };
    el?.addEventListener('placechange', handler);
    return () => el?.removeEventListener('placechange', handler); // 卸载时清除监听器
  }, [onLocationSelect]);

  // 点击 Search 按钮时（可选功能，防止用户只选不点）
  const handleSearchClick = () => {
    selectedPlace?.geometry?.location &&
      onLocationSelect({
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      });
  };


  // 点击 GO：如果出发站和到达站都有选中，则触发路线规划
  const handleGoClick = () => {
    if (!departureNumber || !arrivalNumber) return;
    fireRoute();
  };

  // 点击 CLEAR：调用上下文提供的 clearAll 一键清空所有路线状态
  const handleClearClick = () => clearAll();

  /* ---------- 组件 UI ---------- */
  return (
    <div id="journey_planner">
      <img id="title" src="/img/title.png" alt="logo" />

      {/* 🔍 地点搜索框（目前注释掉了，可恢复使用） */}
      {/*
      <div id="search_wrapper" style={{ zIndex: 9999, display: 'flex', gap: 6 }}>
        <gmp-place-autocomplete
          style={{
            flex: 1,
            height: 36,
            borderRadius: 4,
            border: 'none',
            fontSize: 14,
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
          placeholder="Enter your target location"
        ></gmp-place-autocomplete>

        <button id="search_btn" onClick={handleSearchClick}>
          Search
        </button>
      </div>
      */}

      {/*  出发站选择下拉框 */}
      <label>DEPARTURE STATION</label>
      <select
        value={departureNumber ?? ''}
        onChange={e => setDepartureNumber(Number(e.target.value))}
      >
        <option value="">Select a station</option>
        {stations.map(s => (
          <option key={s.number} value={s.number}>
            {s.name}
          </option>
        ))}
      </select>

      {/* 到达站选择下拉框 */}
      <label>ARRIVAL STATION</label>
      <select
        value={arrivalNumber ?? ''}
        onChange={e => setArrivalNumber(Number(e.target.value))}
      >
        <option value="">Select a station</option>
        {stations.map(s => (
          <option key={s.number} value={s.number}>
            {s.name}
          </option>
        ))}
      </select>

      {/* 操作按钮区域 */}
      <button id="go_btn" type="button" onClick={handleGoClick}>
        GO
      </button>

      <button
        id="go_btn"         // 复用相同样式
        type="button"
        style={{ marginTop: 8 }}   // 与 GO 按钮保持间距
        onClick={handleClearClick}
      >
        CLEAR
      </button>
    </div>
  );
}
