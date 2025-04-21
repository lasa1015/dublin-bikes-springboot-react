import { GoogleMap, Marker } from '@react-google-maps/api';
import StationMarkers        from './StationMarkers';
import useStations           from '../../hooks/useStations';

const mapStyle = { width: '100%', height: '100vh' };
const dublin   = { lat: 53.346, lng: -6.26 };

interface Props {
  searchLocation: google.maps.LatLngLiteral | null;  // 从 App 传来
}

export default function GoogleMapContainer({ searchLocation }: Props) {
  const stations = useStations();

  // API 脚本已由 <LoadScript> 提前加载，这里肯定能访问 google
  return (
    <GoogleMap
      mapContainerStyle={mapStyle}
      center={searchLocation ?? dublin}      // 有搜索点 → 以它为中心
      zoom={searchLocation ? 16 : 14}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy',
        clickableIcons: false,
        styles: [
          { featureType: 'poi',     elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      }}
    >
      {/* 站点 Marker */}
      <StationMarkers stations={stations} />

      {/* 搜索出来的位置 Marker（有值才渲染） */}
      {searchLocation && (
        <Marker
          position={searchLocation}
          icon={{
            url: '/img/target.png',
            scaledSize: new google.maps.Size(32, 32),
          }}
        />
      )}
    </GoogleMap>
  );
}
