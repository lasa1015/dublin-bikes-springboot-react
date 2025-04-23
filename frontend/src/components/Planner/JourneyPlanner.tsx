import './JourneyPlanner.css';


// 全局上下文：用于管理路线相关状态（出发站/到达站、触发路线等）
import { useRoute } from '../../contexts/RouteContext';

// 获取所有站点数据（从后端获取，包含编号、坐标、名称等）
import { useStationContext } from '../../contexts/StationContext';


export default function JourneyPlanner() {
  const { stations } = useStationContext();



  const {
    departureNumber,       // 当前选中的出发站编号
    arrivalNumber,         // 当前选中的到达站编号
    setDepartureNumber,    // 设置出发站编号
    setArrivalNumber,      // 设置到达站编号
    fireRoute,             // 触发路径规划
    clearAll,              // 一键清除所有状态（出发站、到达站）
  } = useRoute();

  

  // 点击 GO：如果出发站和到达站都有选中，则触发路线规划
  const handleGoClick = () => {
    if (!departureNumber || !arrivalNumber) return;
    fireRoute();
  };

  // 点击 CLEAR：调用上下文提供的 clearAll 一键清空所有路线状态
  const handleClearClick = () => clearAll();

  /* ---------- 组件 UI ---------- */
  return (
    <div id="journey_planner">
      <img id="title" src="/img/title.png" alt="logo" />

            

      {/* 出发站选择下拉框 */}
      <label>DEPARTURE STATION</label>
      <select
        value={departureNumber ?? ''}
        onChange={e => setDepartureNumber(Number(e.target.value))}
      >
        <option value="">Select a station</option>
        {stations.map(s => (
          <option key={s.number} value={s.number}>
            {s.name}
          </option>
        ))}
      </select>

      {/* 到达站选择下拉框 */}
      <label>ARRIVAL STATION</label>
      <select
        value={arrivalNumber ?? ''}
        onChange={e => setArrivalNumber(Number(e.target.value))}
      >
        <option value="">Select a station</option>
        {stations.map(s => (
          <option key={s.number} value={s.number}>
            {s.name}
          </option>
        ))}
      </select>

      {/* 操作按钮区 */}
      <button id="go_btn" type="button" onClick={handleGoClick}>
        GO
      </button>
      <button
        id="go_btn"
        type="button"
        style={{ marginTop: 8 }}
        onClick={handleClearClick}
      >
        CLEAR
      </button>
    </div>
  );
}
