import './JourneyPlanner.css';
import { useEffect, useRef, useState } from 'react';
import useStations from '../../hooks/useStations';
import { useRoute } from '../../contexts/RouteContext';

interface Props {
  onLocationSelect: (loc: google.maps.LatLngLiteral | null) => void;
}

export default function JourneyPlanner({ onLocationSelect }: Props) {
  const stations = useStations();

  const {
    departureNumber,
    arrivalNumber,
    setDepartureNumber,
    setArrivalNumber,
    fireRoute,          // ⬅️ 新增
  } = useRoute();

  /* ---------- 自动补全 ---------- */
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const acRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = document.querySelector('gmp-place-autocomplete');
    const handle = async (e: any) => {
      const place = await e.detail.place;
      setSelectedPlace(place);
      place.geometry?.location &&
        onLocationSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
    };
    el?.addEventListener('placechange', handle);
    return () => el?.removeEventListener('placechange', handle);
  }, [onLocationSelect]);

  const handleSearchClick = () => {
    selectedPlace?.geometry?.location &&
      onLocationSelect({
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      });
  };

  /* ---------- “GO” 按钮 ---------- */
  const handleGoClick = () => {
    const dep = stations.find(s => s.number === departureNumber);
    const arr = stations.find(s => s.number === arrivalNumber);
    if (!dep || !arr) return;          // 没选全，什么也不做
    fireRoute();                       // 只是触发，让地图去真正请求路径
  };

  return (
    <div id="journey_planner">
      <img id="title" src="/img/title.png" alt="logo" />

      {/* 搜索框 + Search 按钮 */}
      <div id="search_wrapper" style={{ zIndex: 9999, display: 'flex', gap: 6 }}>
        <gmp-place-autocomplete
          ref={acRef}
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

      {/* 下拉框 */}
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

      <button id="go_btn" type="button" onClick={handleGoClick}>
        GO
      </button>
    </div>
  );
}
