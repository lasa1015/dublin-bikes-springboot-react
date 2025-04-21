import { useEffect, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import StationMarkers from './StationMarkers';
import useStations from '../../hooks/useStations';
import { useRoute } from '../../contexts/RouteContext';

const mapStyle = { width: '100%', height: '100vh' };
const dublin   = { lat: 53.346, lng: -6.26 };

interface Props {
  searchLocation : google.maps.LatLngLiteral | null;
  showBikesLayer : boolean;
  showStandsLayer: boolean;
}

export default function GoogleMapContainer({
  searchLocation,
  showBikesLayer,
  showStandsLayer,
}: Props) {
  const stations = useStations();
  const mapRef   = useRef<google.maps.Map | null>(null);

  /* -------------------------------- 图层圆圈 -------------------------------- */
  const bikeCirclesRef  = useRef<google.maps.Circle[]>([]);
  const standCirclesRef = useRef<google.maps.Circle[]>([]);

  /* --------------------------- 路线相关（来自 context） --------------------------- */
  const {
    departureNumber,
    arrivalNumber,
    routeTrigger,
    routeResult,
    setRouteResult,
  } = useRoute();

  /* ------------------------ 搜索框定位（平移地图） ------------------------ */
  useEffect(() => {
    if (searchLocation && mapRef.current) {
      mapRef.current.panTo(searchLocation);
    }
  }, [searchLocation]);

  /* --------------------------- 绘制/更新圆圈图层 --------------------------- */
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // 清理旧图层
    bikeCirclesRef.current.forEach(c => c.setMap(null));
    standCirclesRef.current.forEach(c => c.setMap(null));
    bikeCirclesRef.current  = [];
    standCirclesRef.current = [];

    const getColor = (c: number) =>
      c > 15 ? '#4caf50' : c > 7 ? '#ff9800' : c >= 1 ? '#f44336' : '#000000';

    if (showBikesLayer) {
      bikeCirclesRef.current = stations.map(st => {
        if (!st.availableBikes) return null;
        const color = getColor(st.availableBikes);
        return new google.maps.Circle({
          map,
          center       : { lat: st.latitude, lng: st.longitude },
          radius       : st.availableBikes * 10,
          fillColor    : color,
          fillOpacity  : 0.35,
          strokeColor  : '#ffffff',
          strokeOpacity: 0.8,
          strokeWeight : 1,
          clickable    : false,
        });
      }).filter(Boolean) as google.maps.Circle[];
    }

    if (showStandsLayer) {
      standCirclesRef.current = stations.map(st => {
        if (!st.availableBikeStands) return null;
        const color = getColor(st.availableBikeStands);
        return new google.maps.Circle({
          map,
          center       : { lat: st.latitude, lng: st.longitude },
          radius       : st.availableBikeStands * 8,
          fillColor    : color,
          fillOpacity  : 0.35,
          strokeColor  : '#ffffff',
          strokeOpacity: 1,
          strokeWeight : 0.5,
          clickable    : false,
        });
      }).filter(Boolean) as google.maps.Circle[];
    }
  }, [stations, showBikesLayer, showStandsLayer]);

  /* ------------------------------- 规划路线 ------------------------------- */
  useEffect(() => {
    if (!routeTrigger) return;                        // 仅在点 GO 后触发
    if (!departureNumber || !arrivalNumber || !mapRef.current) return;

    const depStation = stations.find(s => s.number === departureNumber);
    const arrStation = stations.find(s => s.number === arrivalNumber);
    if (!depStation || !arrStation) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin     : { lat: depStation.latitude, lng: depStation.longitude },
        destination: { lat: arrStation.latitude, lng: arrStation.longitude },
        travelMode : google.maps.TravelMode.BICYCLING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setRouteResult(result);
        } else {
          console.error('路线规划失败:', status);
          setRouteResult(null);
        }
      }
    );

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [routeTrigger]);

  /* ---------------------------------------------------------------------- */
  return (
    <GoogleMap
      mapContainerStyle={mapStyle}
      center={searchLocation ?? dublin}
      zoom={searchLocation ? 16 : 14}
      onLoad={map => (mapRef.current = map)}
      options={{
        disableDefaultUI: true,
        zoomControl     : true,
        gestureHandling : 'greedy',
        clickableIcons  : false,
        styles: [
          { featureType: 'poi',     elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      }}
    >
      {/* 车站固定 Marker */}
      <StationMarkers stations={stations} />

      {/* 搜索得到的临时 Marker */}
      {searchLocation && (
        <Marker position={searchLocation} />
      )}

      {/* 路线渲染，关闭默认 A/B 标记 */}
      {routeResult && (
        <DirectionsRenderer
          directions={routeResult}
          options={{ suppressMarkers: true,   // ← 关键：不绘制 A/B 标记
          suppressBicyclingLayer: true}}
        />
      )}
    </GoogleMap>
  );
}
