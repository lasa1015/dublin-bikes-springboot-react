import { useEffect, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import StationMarkers from './StationMarkers';
import useStations from '../../hooks/useStations';

const mapStyle = { width: '100%', height: '100vh' };
const dublin = { lat: 53.346, lng: -6.26 };

interface Props {
  searchLocation: google.maps.LatLngLiteral | null;
  showBikesLayer: boolean;
  showStandsLayer: boolean;
}

export default function GoogleMapContainer({
  searchLocation,
  showBikesLayer,
  showStandsLayer,
}: Props) {
  const stations = useStations();
  const mapRef = useRef<google.maps.Map | null>(null);
  const bikeCirclesRef = useRef<google.maps.Circle[]>([]);
  const standCirclesRef = useRef<google.maps.Circle[]>([]);

  // 每种颜色对应的放大倍数（你可以手动调）
  const scaleFactors: Record<string, number> = {
    '#4caf50': 1.0,   // 绿色
    '#ff9800': 1.2,   // 橙色
    '#f44336': 1.5,   // 红色 → 稍微大一些
    '#000000': 3.0    // 黑色 → 放大两倍
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    bikeCirclesRef.current.forEach(c => c.setMap(null));
    standCirclesRef.current.forEach(c => c.setMap(null));
    bikeCirclesRef.current = [];
    standCirclesRef.current = [];

    if (showBikesLayer) {
      bikeCirclesRef.current = stations.map(station => {
        const count = station.availableBikes;
        if (count === 0) return null;
        const color = getColor(count);
        const scale = scaleFactors[color] ?? 1.0;

        return new google.maps.Circle({
          map,
          center: { lat: station.latitude, lng: station.longitude },
          radius: count * 10 * scale,
          fillColor: color,
          fillOpacity: 0.35,
          strokeColor: '#ffffff',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          clickable: false,
        });
      }).filter(Boolean) as google.maps.Circle[];
    }

    if (showStandsLayer) {
      standCirclesRef.current = stations.map(station => {
        const count = station.availableBikeStands;
        if (count === 0) return null;
        const color = getColor(count);
        const scale = scaleFactors[color] ?? 1.0;

        return new google.maps.Circle({
          map,
          center: { lat: station.latitude, lng: station.longitude },
          radius: count * 8 * scale,
          fillColor: color,
          fillOpacity: 0.35,
          strokeColor: '#ffffff',
          strokeOpacity: 1,
          strokeWeight: 0.5,
          clickable: false,
        });
      }).filter(Boolean) as google.maps.Circle[];
    }
  }, [stations, showBikesLayer, showStandsLayer]);

  function getColor(count: number) {
    if (count > 15) return '#4caf50';
    if (count > 7) return '#ff9800';
    if (count > 1) return '#f44336';
    return '#000000';
  }

  return (
    <GoogleMap
      mapContainerStyle={mapStyle}
      center={searchLocation ?? dublin}
      zoom={searchLocation ? 16 : 14}
      onLoad={map => { mapRef.current = map; }}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy',
        clickableIcons: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      }}
    >
      <StationMarkers stations={stations} />
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
