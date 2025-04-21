import { useRoute } from '../../contexts/RouteContext';
import { CurrentStation } from '../../hooks/useStations';
import './InfoWindowContent.css';

interface Props {
  station: CurrentStation;
}

const InfoWindowContent = ({ station }: Props) => {
  const { setDepartureNumber, setArrivalNumber } = useRoute();

  return (
    <div id="stand_info">
      <div style={{ fontSize: '15px' }}>Station No. {station.number}</div>
      <h2>{station.name?.toUpperCase()}</h2>
      <h4>{station.status === 'OPEN' ? 'OPEN' : 'CLOSED'}</h4>

      <div><strong>Total capacity:</strong> {station.capacity}</div>
      <div><strong>Available bike stands:</strong> {station.availableBikeStands}</div>
      <div><strong>Available bikes:</strong> {station.availableBikes}</div>
      <div><strong>Mechanical bikes:</strong> {station.mechanicalBikes}</div>
      <div><strong>Electrical bikes:</strong> {station.electricalBikes}</div>

      <div style={{ marginTop: '6px' }}>
        Credit cards accepted:
        {station.banking ? (
          <img src="/img/green_tick.png" alt="yes" />
        ) : (
          <img src="/img/red_cross.png" alt="no" />
        )}
      </div>

      <button id="ml_prediction_btn">ML Future Availability Prediction</button>

      <div style={{ marginTop: 10 }}>
        <button className="plan-btn" onClick={() => setDepartureNumber(station.number)}>
          DEPARTURE STATION
        </button>
        <button className="plan-btn" style={{ marginLeft: 8 }} onClick={() => setArrivalNumber(station.number)}>
          ARRIVAL STATION
        </button>
      </div>
    </div>
  );
};

export default InfoWindowContent;
