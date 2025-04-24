// src/components/Map/GoogleMapContainer.tsx

import { useEffect, useRef } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { useRoute } from '../../contexts/RouteContext';
import { mapStyle, defaultCenter, mapOptions } from './config/mapOptions';
import useDrawOverlayCircles from './hooks/useDrawOverlayCircles';
import useRoutePlanner from './hooks/useRoutePlanner';

import StationMarkers from './StationMarkers';
import { useSelectedStation } from '../../contexts/SelectedStationContext';




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
        onLoad={map => (mapRef.current = map)}
        options={mapOptions}
      >
        <StationMarkers /> {/* 不需要再传任何 props */}

        {useRoute().routeResult && (
          <DirectionsRenderer
            directions={useRoute().routeResult}
            options={{ suppressMarkers: true, suppressBicyclingLayer: true }}
          />
        )}
      </GoogleMap>


    </>
  );
}
