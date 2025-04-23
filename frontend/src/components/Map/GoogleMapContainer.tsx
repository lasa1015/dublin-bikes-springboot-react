// src/components/Map/GoogleMapContainer.tsx

import { useRef } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { useRoute } from '../../contexts/RouteContext';
import { mapStyle, defaultCenter, mapOptions } from './config/mapOptions';
import useDrawOverlayCircles from './hooks/useDrawOverlayCircles';
import useRoutePlanner from './hooks/useRoutePlanner';

import StationMarkers from './StationMarkers';
import MLPredictionModal from './MLPredictionModal';

import { usePredictionModal } from '../../contexts/PredictionModalContext'; //  新增

export default function GoogleMapContainer() {

  const mapRef = useRef<google.maps.Map | null>(null);

  useDrawOverlayCircles(mapRef);

  useRoutePlanner(mapRef);

  const { selectedStation } = usePredictionModal();   // 只需要这一个
  const showModal = !!selectedStation;                // 有站点就显示
  

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

      {/* 弹窗统一控制 */}
      {showModal && 
        <MLPredictionModal />
      }
    </>
  );
}
