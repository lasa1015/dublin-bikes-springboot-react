import { useRoute } from '../../contexts/RouteContext';
import { CurrentStation } from '../../contexts/StationContext';     // 统一从这导入类型
import { usePredictionModal } from '../../contexts/PredictionModalContext'; // ✅ 新增

import './InfoWindowContent.css';

/* ---------- 组件 Props ---------- */
interface Props {
  station: CurrentStation;
}

const InfoWindowContent = ({ station }: Props) => {
  /* ---------- 路线上下文 ---------- */
  const {
    departureNumber,
    arrivalNumber,
    setDepartureNumber,
    setArrivalNumber,
  } = useRoute();

  /* ---------- 预测弹窗上下文 ---------- */
  const { openModal } = usePredictionModal();      // ✅ 直接在这里拿函数

  /* ---------- 判断出发 / 到达 ---------- */
  const isDeparture = station.number === departureNumber;
  const isArrival   = station.number === arrivalNumber;

  /* ---------- UI ---------- */
  return (
    <div id="stand_info">
      <div style={{ fontSize: '15px' }}>Station No. {station.number}</div>
      <h2>{station.name?.toUpperCase()}</h2>
      <h4>{station.status === 'OPEN' ? 'OPEN' : 'CLOSED'}</h4>

      <div><span className="label">Available bike stands:</span> {station.availableBikeStands}</div>
      <div><span className="label">Available bikes:</span> {station.availableBikes}</div>
      <div><span className="label">Mechanical bikes:</span> {station.mechanicalBikes}</div>
      <div><span className="label">Electrical bikes:</span> {station.electricalBikes}</div>

      <div>
  <span className="label">Credit cards accepted:</span>

  {station.banking ? (
    /* ✅ 用片段把 <img> 和注释包起来，成为同一个 JSX 节点 */
    <>
      <img src="/img/green_tick.png" alt="yes" /> {/* 支持信用卡，显示绿色对勾 */}
    </>
  ) : (
    <>
      <img src="/img/red_cross.png" alt="no" />   {/* 不支持信用卡，显示红叉 */}
    </>
  )}
</div>

      {/* 机器学习按钮 —— 直接打开弹窗，不再走 props 传递 */}
      <button id="ml_prediction_btn" onClick={() => openModal(station)}>
        AI Forecast: Bikes & Stands
      </button>

      <div style={{ marginTop: 10 }}>
        {/* 设置为出发站 */}
        <button
          className={`plan-btn ${isDeparture ? 'disabled' : ''}`}
          onClick={() => setDepartureNumber(station.number)}
          disabled={isDeparture}
        >
          Set as Departure
        </button>

        {/* 设置为到达站 */}
        <button
          className={`plan-btn ${isArrival ? 'disabled' : ''}`}
          onClick={() => setArrivalNumber(station.number)}
          disabled={isArrival}
          style={{ marginLeft: 10 }}
        >
          Set as Arrival
        </button>
      </div>
    </div>
  );
};

export default InfoWindowContent;
