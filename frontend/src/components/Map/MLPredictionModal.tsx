// src/components/Map/MLPredictionModal.tsx
import './MLPredictionModal.css';

import { usePredictionModal } from '../../contexts/PredictionModalContext';  //  使用上下文统一管理弹窗
import { useStationContext }   from '../../contexts/StationContext';        //  拿到全部站点列表，渲染下拉框
// ↑ 你之前文件里只有上面那一行；多引入 useStationContext

export default function MLPredictionModal() {
  //  从上下文中获取当前车站、关闭函数，以及能手动切换车站的 setSelectedStation
  const { selectedStation: station, closeModal, setSelectedStation } = usePredictionModal();

  //  所有车站，用于渲染 <select>
  const { stations } = useStationContext();

  //  如果还没选站(理论不会出现)，直接返回 null
  if (!station) return null;

  /* ----------------------- UI ----------------------- */
  return (
    <div className="ml-modal-backdrop">
      <div className="ml-modal-content">

        {/* 关闭按钮 */}
        <button className="close-btn" onClick={closeModal}>×</button>

        {/* 标题 */}
        <h2>Predicted Availability</h2>

        {/* 站点选择下拉框 —— 选中项与 selectedStation 同步 */}
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="station-select"><strong>Select station:</strong>&nbsp;</label>
          <select
            id="station-select"
            value={station.number}
            onChange={e => {
              const num = Number(e.target.value);
              const newSt = stations.find(s => s.number === num);
              newSt && setSelectedStation(newSt);   // ⚠️ 调用上下文函数，更新当前弹窗站点
            }}
          >
            {stations.map(s => (
              <option key={s.number} value={s.number}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* 当前选中站点名称 */}
        <p>Forecast for: <strong>{station.name}</strong></p>

        {/* 这里未来放预测图表 */}
        <p>(Prediction chart or data will go here.)</p>
      </div>
    </div>
  );
}
