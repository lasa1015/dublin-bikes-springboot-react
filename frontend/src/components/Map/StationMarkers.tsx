import { Marker, InfoWindow } from '@react-google-maps/api';
import { CurrentStation } from '../../hooks/useStations';
import { useState } from 'react';
import InfoWindowContent from './InfoWindowContent'; // ✅ 引入

interface Props {
  stations: CurrentStation[];
}

const StationMarkers = ({ stations }: Props) => {
  const [selectedStation, setSelectedStation] = useState<CurrentStation | null>(null);

  return (
    <>
      {stations.map((station) => (
        <Marker
          key={station.number}
          position={{ lat: station.latitude, lng: station.longitude }}
          icon={{
            url: selectedStation?.number === station.number
              ? '/img/bikeicon_active.png'
              : '/img/bikeicon.png',
            scaledSize: new window.google.maps.Size(30, 41),
          }}
          onClick={() => setSelectedStation(station)}
        />
      ))}

      {selectedStation && (
        <InfoWindow
          position={{ lat: selectedStation.latitude,  lng: selectedStation.longitude }}
          onCloseClick={() => setSelectedStation(null)}
        >
          <InfoWindowContent station={selectedStation} />
        </InfoWindow>
      )}
    </>
  );
};

export default StationMarkers;
