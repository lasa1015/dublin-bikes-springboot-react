// src/components/Planner/JourneyPlanner.tsx
import './JourneyPlanner.css';
import { useRef, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import useStations from '../../hooks/useStations';

interface Props {
  onLocationSelect: (loc: google.maps.LatLngLiteral | null) => void;
}

export default function JourneyPlanner({ onLocationSelect }: Props) {
  const stations = useStations();

  const [departure, setDeparture] = useState('');
  const [arrival, setArrival]   = useState('');
  const [inputTxt, setInputTxt] = useState('');

  const acRef = useRef<google.maps.places.Autocomplete | null>(null);

  /** 地点选中后取坐标 */
  const handlePlaceChanged = () => {
    const place = acRef.current?.getPlace();
    if (!place || !place.geometry) return;      // 安全判断

    const { lat, lng } = place.geometry.location!;
    onLocationSelect({ lat: lat(), lng: lng() });
  };

  return (
    <div id="journey_planner">
      <img id="title" src="/img/title.png" alt="logo" />

      {/* ---------- 搜地点 ---------- */}
      <div id="search_wrapper">
        <Autocomplete
          onLoad={(ac) => (acRef.current = ac)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="enter your target location"
            value={inputTxt}
            onChange={(e) => setInputTxt(e.target.value)}
          />
        </Autocomplete>

        <button
          id="search_btn"
          type="button"
          onClick={() => handlePlaceChanged()}
        >
          Search
        </button>
      </div>

      {/* ---------- 选站 ---------- */}
      <label>DEPARTURE STATION</label>
      <select value={departure} onChange={(e) => setDeparture(e.target.value)}>
        <option value="">Select a station</option>
        {stations.map((s) => (
          <option key={s.number} value={s.name}>{s.name}</option>
        ))}
      </select>

      <label>ARRIVAL STATION</label>
      <select value={arrival} onChange={(e) => setArrival(e.target.value)}>
        <option value="">Select a station</option>
        {stations.map((s) => (
          <option key={s.number} value={s.name}>{s.name}</option>
        ))}
      </select>

      <button id="go_btn" type="button">GO</button>
    </div>
  );
}
