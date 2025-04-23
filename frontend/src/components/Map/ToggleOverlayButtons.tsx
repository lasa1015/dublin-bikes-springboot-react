// 引入样式文件，控制按钮的外观和布局
import './ToggleOverlayButtons.css';

// 引入 Overlay 上下文 Hook，用于获取当前图层状态和操作函数
import { useOverlay } from '../../contexts/OverlayContext';


export default function ToggleOverlayButtons() {

  //* 从 OverlayContext 中解构出状态变量和操作函数
  const {
    showBikesLayer,     // 是否显示“自行车数量”图层
    showStandsLayer,    // 是否显示“空位数量”图层
    toggleBikes,        // 切换“自行车图层”的函数
    toggleStands,       // 切换“空位图层”的函数
  } = useOverlay();

  return (

    <div className="toggle-overlay-buttons">
      
      {/* 第一个按钮：用于切换“Bike Map”图层 */}
      <button
        className={showBikesLayer ? 'active' : ''}  // 如果 showBikesLayer 是 true，就加上 'active' 类名
        onClick={toggleBikes}                       // 点击按钮时调用上下文中的 toggleBikes 函数
      >
        Bike Map
      </button>

      {/* 第二个按钮：用于切换“Stand Map”图层 */}
      <button
        className={showStandsLayer ? 'active' : ''}  // 如果 showStandsLayer 是 true，就加上 'active' 类名
        onClick={toggleStands}                       // 点击按钮时调用上下文中的 toggleStands 函数
      >
        Stand Map
      </button>
    </div>
  );
}
