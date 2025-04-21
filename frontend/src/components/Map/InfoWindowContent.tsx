import { useRoute } from '../../contexts/RouteContext';
import { CurrentStation } from '../../hooks/useStations';
import './InfoWindowContent.css';

interface Props {
  station: CurrentStation;
}

const InfoWindowContent = ({ station }: Props) => {
  const {
    departureNumber,
    arrivalNumber,
    setDepartureNumber,
    setArrivalNumber
  } = useRoute();

  const isDeparture = station.number === departureNumber;
  const isArrival   = station.number === arrivalNumber;

  return (
    <div id="stand_info">
      <div style={{ fontSize: '15px' }}>Station No. {station.number}</div>
      <h2>{station.name?.toUpperCase()}</h2>
      <h4>{station.status === 'OPEN' ? 'OPEN' : 'CLOSED'}</h4>

      <div><span className="label">Available bike stands:</span> {station.availableBikeStands}</div>
      <div><span className="label">Available bikes:</span> {station.availableBikes}</div>
      <div><span className="label">Mechanical bikes:</span> {station.mechanicalBikes}</div>
      <div><span className="label">Electrical bikes:</span> {station.electricalBikes}</div>

      <div><span className="label">Credit cards accepted:</span>
        {station.banking ? (
          <img src="/img/green_tick.png" alt="yes" />
        ) : (
          <img src="/img/red_cross.png" alt="no" />
        )}
      </div>

      <button id="ml_prediction_btn">ML Future Availability Prediction</button>

      <div style={{ marginTop: 10 }}>
      <button
  className={`plan-btn ${isDeparture ? 'disabled' : ''}`}
  onClick={() => setDepartureNumber(station.number)}
  disabled={isDeparture}
>
  Set as Departure
</button>

<button
  className={`plan-btn ${isArrival ? 'disabled' : ''}`}
  onClick={() => setArrivalNumber(station.number)}
  disabled={isArrival}
  style={{ marginLeft: 8 }}
>
  Set as Arrival
</button>
      </div>
    </div>
  );
};

export default InfoWindowContent;
