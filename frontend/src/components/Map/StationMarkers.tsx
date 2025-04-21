import { Marker, InfoWindow } from '@react-google-maps/api';
import { CurrentStation } from '../../hooks/useStations';
import { useState } from 'react';
import InfoWindowContent from './InfoWindowContent';
import { useRoute } from '../../contexts/RouteContext';

interface Props {
  stations: CurrentStation[];
}

const StationMarkers = ({ stations }: Props) => {
  const [selectedStation, setSelectedStation] = useState<CurrentStation | null>(null);
  const { departureNumber, arrivalNumber } = useRoute();

  return (
    <>
      {stations.map((station) => {
        /** 是否为当前规划中的起点 / 终点 */
        const isDeparture = station.number === departureNumber;
        const isArrival   = station.number === arrivalNumber;

        /* 根据身份选择不同图标 */
        let iconUrl = '/img/bikeicon.png';
        if (isDeparture) iconUrl = '/img/bikeicon_a.png';
        else if (isArrival) iconUrl = '/img/bikeicon_b.png';

        return (
          <Marker
            key={station.number}
            position={{ lat: station.latitude, lng: station.longitude }}
            icon={{
              url: iconUrl,
              scaledSize: new window.google.maps.Size(32, 43),
            }}
            onClick={() => setSelectedStation(station)}
          />
        );
      })}

      {selectedStation && (
        <InfoWindow
          position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }}
          onCloseClick={() => setSelectedStation(null)}
        >
          <InfoWindowContent station={selectedStation} />
        </InfoWindow>
      )}
    </>
  );
};

export default StationMarkers;
