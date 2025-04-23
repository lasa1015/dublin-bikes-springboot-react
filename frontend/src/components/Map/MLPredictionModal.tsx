// src/components/Map/MLPredictionModal.tsx

import './MLPredictionModal.css';
import { usePredictionModal } from '../../contexts/PredictionModalContext';  //  使用上下文统一管理弹窗
import { CurrentStation } from '../../contexts/StationContext';               //  统一导入车站类型

// 函数组件：MLPredictionModal（显示预测数据弹窗）
export default function MLPredictionModal() {
  //  从上下文中获取当前车站与关闭函数
  const { selectedStation: station, closeModal } = usePredictionModal();

  //  如果没有传入 station，不渲染内容（避免出错）
  if (!station) return null;

  return (
    <div className="ml-modal-backdrop">
      <div className="ml-modal-content">
        
        {/* 右上角关闭按钮 */}
        <button className="close-btn" onClick={closeModal}>×</button>
        
        {/* 标题 */}
        <h2>Predicted Availability</h2>
        
        {/* 显示当前预测车站 */}
        <p>Forecast for: <strong>{station.name}</strong></p>
        
        {/* 预测图表或数据展示区域（未来填充） */}
        <p>(Prediction chart or data will go here.)</p>
      </div>
    </div>
  );
}
