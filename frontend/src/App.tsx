// src/App.tsx
import { useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';

import { RouteProvider } from './contexts/RouteContext'; // ✅ 引入新 context
import Header from './components/Header/Header';
import WeatherPanel from './components/Weather/WeatherPanel';
import JourneyPlanner from './components/Planner/JourneyPlanner';
import GoogleMapContainer from './components/Map/GoogleMapContainer';
import ToggleOverlayButtons from './components/Map/ToggleOverlayButtons';
import Legend from './components/Map/Legend';

export default function App() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: ['places', 'geometry'],
  });

  const [searchLocation, setSearchLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [showBikesLayer, setShowBikesLayer] = useState(false);
  const [showStandsLayer, setShowStandsLayer] = useState(false);

  if (loadError) return <div>地图脚本加载失败</div>;
  if (!isLoaded) return <div>地图脚本加载中…</div>;

  return (

      <RouteProvider>
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
        <JourneyPlanner onLocationSelect={setSearchLocation} />
        {(showBikesLayer || showStandsLayer) && <Legend />}
        <GoogleMapContainer
          searchLocation={searchLocation}
          showBikesLayer={showBikesLayer}
          showStandsLayer={showStandsLayer}
        />
      </RouteProvider>
 
  );
}
