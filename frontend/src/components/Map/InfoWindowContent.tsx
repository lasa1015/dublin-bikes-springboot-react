import { CurrentStation } from '../../hooks/useStations';
import './InfoWindowContent.css';

interface Props {
  station: CurrentStation;
}

const InfoWindowContent = ({ station }: Props) => {
  return (
    <div id="stand_info">
      {/* 编号 */}
      <div style={{ fontSize: '15px' }}>Station No. {station.number}</div>

      {/* 标题（橘色） */}
      <h2>{station.name?.toUpperCase()}</h2>

      {/* 状态 */}
      <h4>{station.status === 'OPEN' ? 'OPEN' : 'CLOSED'}</h4>

      {/* 各种信息 */}
      <div>
  <strong>Total capacity:</strong> <span className="value">{station.capacity}</span>
</div>
<div>
  <strong>Available bike stands:</strong> <span className="value">{station.availableBikeStands}</span>
</div>
<div>
  <strong>Available bikes:</strong> <span className="value">{station.availableBikes}</span>
</div>
<div>
  <strong>Mechanical bikes:</strong> <span className="value">{station.mechanicalBikes}</span>
</div>
<div>
  <strong>Electrical bikes:</strong> <span className="value">{station.electricalBikes}</span>
</div>

      {/* 信用卡图标 */}
      <div style={{ marginTop: '6px' }}>
        Credit cards accepted:
        {station.banking ? (
          <img src="/img/green_tick.png" alt="yes" />
        ) : (
          <img src="/img/red_cross.png" alt="no" />
        )}
      </div>

      {/* 按钮 */}
      <button id="ml_prediction_btn">ML Availability Prediction</button>
    </div>
  );
};

export default InfoWindowContent;
