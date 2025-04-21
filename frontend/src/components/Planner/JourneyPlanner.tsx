import './JourneyPlanner.css';
import { useEffect, useRef, useState } from 'react';
import useStations from '../../hooks/useStations';
import { useRoute } from '../../contexts/RouteContext';

interface Props {
  onLocationSelect: (loc: google.maps.LatLngLiteral | null) => void;
}

export default function JourneyPlanner({ onLocationSelect }: Props) {
  const stations = useStations();

  /* ---------- 路线 context ---------- */
  const {
    departureNumber,
    arrivalNumber,
    setDepartureNumber,
    setArrivalNumber,
    fireRoute,
    clearAll,               // ✨ 新增
  } = useRoute();

  /* ---------- gmp‑autocomplete ---------- */
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  useEffect(() => {
    const el = document.querySelector('gmp-place-autocomplete');
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
    return () => el?.removeEventListener('placechange', handler);
  }, [onLocationSelect]);

  const handleSearchClick = () => {
    selectedPlace?.geometry?.location &&
      onLocationSelect({
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      });
  };

  /* ---------- GO / CLEAR ---------- */
  const handleGoClick = () => {
    if (!departureNumber || !arrivalNumber) return;
    /* 重复站点已在地图层 effect 中排除，这里只负责触发 */
    fireRoute();
  };

  const handleClearClick = () => clearAll();   // 一键清空

  /* ---------- UI ---------- */
  return (
    <div id="journey_planner">
      <img id="title" src="/img/title.png" alt="logo" />

      {/* 搜索框 + Search */}
      {/* <div id="search_wrapper" style={{ zIndex: 9999, display: 'flex', gap: 6 }}>
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
      </div> */}

      {/* 下拉框们 */}
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

      {/* 操作按钮区 */}
      <button id="go_btn"   type="button" onClick={handleGoClick}>
        GO
      </button>
      <button
        id="go_btn"         /* 复用同一 CSS，外观一致 */
        type="button"
        style={{ marginTop: 8 }}   /* 与 GO 之间留点间距 */
        onClick={handleClearClick}
      >
        CLEAR
      </button>
    </div>
  );
}
