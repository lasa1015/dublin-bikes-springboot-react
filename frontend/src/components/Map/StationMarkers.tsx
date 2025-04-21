import { Marker } from '@react-google-maps/api';
import useStations from '../../hooks/useStations';

const StationMarkers = () => {
  const stations = useStations();

  return (
    <>
      {stations.map(station => (
        <Marker
        key={station.number}
        position={{ lat: station.latitude, lng: station.longitude }}
        icon={{
          url: '/img/bikeicon.png', 
          scaledSize: new window.google.maps.Size(29, 40), 
        }}
      />
      ))}
    </>
  );
};

export default StationMarkers;
