// src/components/Map/Legend.tsx
import './Legend.css';
import LegendItem from './LegendItem';

// 引入 OverlayContext，用于获取当前图层状态
import { useOverlay } from '../../contexts/OverlayContext';

export default function Legend() {

  // * 从上下文中读取两个状态值（是否显示借车/还车图层）
  const { showBikesLayer, showStandsLayer } = useOverlay();

  // 如果两个图层都没开启，就不渲染组件（返回 null）
  if (!showBikesLayer && !showStandsLayer) return null;

  return (
    <div className="legend-container">

      {/* 调用 LegendItem 这个子组件，并传给它两个参数 color 和 label 的值 */}
      {/* 这些传进去的参数，React 会自动封装成一个对象传给子组件 */}
      <LegendItem color="#4caf50" label="n >= 15" />
      <LegendItem color="#ff9800" label="n >= 7" />
      <LegendItem color="#f44336" label="n >= 1" />
      <LegendItem color="#000000" label="n  = 0" />
    </div>
  );
}
