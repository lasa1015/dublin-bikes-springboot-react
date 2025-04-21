import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import StationMarkers from './StationMarkers';
import useStations from '../../hooks/useStations';
import WeatherPanel from '../Weather/WeatherPanel';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 53.346,
  lng: -6.26,
};

const libraries: ("places" | "geometry")[] = ['places', 'geometry'];

const GoogleMapContainer = () => {
  const stations = useStations(); // ✅ 使用自定义 Hook 获取数据

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  if (loadError) return <div>地图加载失败</div>;
  if (!isLoaded) return <div>地图加载中...</div>;

  return (
    <>
    <WeatherPanel />
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={center}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy', 
        clickableIcons: false,  
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      }}
    >
      <StationMarkers stations={stations} />
    </GoogleMap>
    
    </>
  );
};

export default GoogleMapContainer;
