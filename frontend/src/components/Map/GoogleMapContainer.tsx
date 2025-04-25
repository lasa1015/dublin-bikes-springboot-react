import { useRef } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { useRoute } from '../../contexts/RouteContext';
import { mapStyle, defaultCenter, mapOptions } from './config/mapOptions';
import useDrawOverlayCircles from './hooks/useDrawOverlayCircles';
import useRoutePlanner from './hooks/useRoutePlanner';
import StationMarkers from './StationMarkers';

export default function GoogleMapContainer() {
  const mapRef = useRef<google.maps.Map | null>(null);

  useDrawOverlayCircles(mapRef);
  useRoutePlanner(mapRef);

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapStyle}
        center={defaultCenter}
        zoom={14}
        onLoad={map => { mapRef.current = map; }}  // 修改：去除返回值，确保返回 void
        options={mapOptions}
      >
        <StationMarkers /> 

        {useRoute().routeResult && (
          <DirectionsRenderer
            directions={useRoute().routeResult ?? undefined}  
            options={{ suppressMarkers: true, suppressBicyclingLayer: true }}
          />
        )}
      </GoogleMap>
    </>
  );
}
