// src/App.tsx
import { PlannerProvider } from './contexts/PlannerContext';   // ← 加上它
import { useJsApiLoader } from '@react-google-maps/api';       // 你原本就有
import Header          from './components/Header/Header';
import WeatherPanel    from './components/Weather/WeatherPanel';
import JourneyPlanner  from './components/Planner/JourneyPlanner';
import GoogleMapContainer from './components/Map/GoogleMapContainer';
import { useState }    from 'react';
import ToggleOverlayButtons from './components/Map/ToggleOverlayButtons';
import Legend from './components/Map/Legend'; // ← 别忘记引入 Legend

export default function App() {
  /* 你的 useJsApiLoader / 天气等逻辑照旧 */
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: ['places', 'geometry'],
  });

  const [searchLocation, setSearchLocation] =
    useState<google.maps.LatLngLiteral | null>(null);



    const [showBikesLayer, setShowBikesLayer] = useState(false);
const [showStandsLayer, setShowStandsLayer] = useState(false);


  if (loadError) return <div>地图脚本加载失败</div>;
  if (!isLoaded)   return <div>地图脚本加载中…</div>;

  return (
    <PlannerProvider>
      <Header />
      <ToggleOverlayButtons
  showBikes={showBikesLayer}
  showStands={showStandsLayer}
  onToggleBikes={() => {
    setShowBikesLayer(prev => {
      setShowStandsLayer(false);
      return !prev;
    });
  }}
  onToggleStands={() => {
    setShowStandsLayer(prev => {
      setShowBikesLayer(false);
      return !prev;
    });
  }}
/>

      <WeatherPanel />
      <JourneyPlanner /* onLocationSelect={setSearchLocation} 可留待以后用 */ />
        {/* ✅ 条件渲染图例 */}
  {(showBikesLayer || showStandsLayer) && <Legend />}

      <GoogleMapContainer

  searchLocation={searchLocation}
  showBikesLayer={showBikesLayer}
  showStandsLayer={showStandsLayer}
/>

    </PlannerProvider>
  );
}
