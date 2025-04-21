import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { ReactNode } from 'react';
import StationMarkers from './StationMarkers'; // 加这一行

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 60px)', // 避免滚动条
};

const center = {
  lat: 53.346,
  lng: -6.26,
};

const libraries: ("places" | "geometry")[] = ['places', 'geometry'];

interface Props {
  children?: ReactNode;
}

const GoogleMapContainer = ({ children }: Props) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  if (loadError) return <div>地图加载失败</div>;
  if (!isLoaded) return <div>地图加载中...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={center}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
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
      {/* 显示站点标记 */}
      <StationMarkers />
      {children}
    </GoogleMap>
  );
};

export default GoogleMapContainer;
