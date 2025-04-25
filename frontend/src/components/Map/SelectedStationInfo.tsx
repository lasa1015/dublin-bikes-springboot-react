import { InfoWindow } from '@react-google-maps/api';        // 引入 Google 地图的信息窗组件
import { useSelectedStation } from '../../contexts/SelectedStationContext'; // 引入选中车站的上下文
import { useRoute } from '../../contexts/RouteContext';      // 路线规划上下文
import { useLeftPanel } from '../../contexts/LeftPanelContext'; // ✅ 引入全局面板控制 context（新增）

import './SelectedStationInfo.css';

/* ---------- Props 类型定义 ---------- */
interface Props {
  openInfoWindow: boolean;
  setOpenInfoWindow: (open: boolean) => void;
}

const SelectedStationInfo = ({ openInfoWindow, setOpenInfoWindow }: Props) => {

  // 获取当前选中的车站
  const { selectedStation } = useSelectedStation();

  // 获取路径规划状态
  const {
    departureNumber,
    arrivalNumber,
    setDepartureNumber,
    setArrivalNumber,
  } = useRoute();

  // 获取打开左侧预测面板的方法
  const { openPanel } = useLeftPanel();

  //  没选站 或者窗口不显示 就不渲染
  if (!selectedStation || !openInfoWindow) return null;

  // 判断当前站点是否是出发 / 到达站
  const isDeparture = selectedStation.number === departureNumber;
  const isArrival   = selectedStation.number === arrivalNumber;

  return (
    <InfoWindow
      position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }}
      onCloseClick={() => setOpenInfoWindow(false)}  //  关闭信息窗
      options={{
        pixelOffset: new window.google.maps.Size(0, -47)
      }}
    >
      <div id="stand_info">
        <div style={{ fontSize: '15px' }}>Station No. {selectedStation.number}</div>
        <h2>{selectedStation.name?.toUpperCase()}</h2>
        <h4>{selectedStation.status === 'OPEN' ? 'OPEN' : 'CLOSED'}</h4>

        <div><span className="label">Available bike stands:</span> {selectedStation.availableBikeStands}</div>
        <div><span className="label">Available bikes:</span> {selectedStation.availableBikes}</div>
        <div><span className="label">Mechanical bikes:</span> {selectedStation.mechanicalBikes}</div>
        <div><span className="label">Electrical bikes:</span> {selectedStation.electricalBikes}</div>

        <div>
          <span className="label">Credit cards accepted:</span>
          {selectedStation.banking ? (
            <>
              <img src="/img/green_tick.png" alt="yes" />
            </>
          ) : (
            <>
              <img src="/img/red_cross.png" alt="no" />
            </>
          )}
        </div>

        {/*  机器学习预测按钮 —— 打开预测面板 */}
        <button
          id="ml_prediction_btn"
          onClick={() => openPanel('prediction')}
        >
          AI Forecast: Bikes & Stands
        </button>

        <div style={{ marginTop: 10 }}>
          <button
            className={`plan-btn ${isDeparture ? 'disabled' : ''}`}
            onClick={() => setDepartureNumber(selectedStation.number)}
            disabled={isDeparture}
          >
            Set as Departure
          </button>
          <button
            className={`plan-btn ${isArrival ? 'disabled' : ''}`}
            onClick={() => setArrivalNumber(selectedStation.number)}
            disabled={isArrival}
            style={{ marginLeft: 10 }}
          >
            Set as Arrival
          </button>
        </div>
      </div>
    </InfoWindow>
  );
};

export default SelectedStationInfo;
