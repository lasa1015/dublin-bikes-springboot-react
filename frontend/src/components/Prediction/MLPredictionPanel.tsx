import './MLPredictionPanel.css';

import { useStationContext } from '../../contexts/StationContext';
import { useSelectedStation } from '../../contexts/SelectedStationContext';
import { useLeftPanel } from '../../contexts/LeftPanelContext';
import usePrediction, { PredictionResult } from './usePrediction';
import { Chart } from 'react-google-charts';
import { useState } from 'react';

export default function MLPredictionPanel() {
  const { currentPanel, closePanel } = useLeftPanel();
  const { selectedStation, setSelectedStation } = useSelectedStation();
  const { stations } = useStationContext();

  // -------------- 1. 取得全部预测 -----------------
  const predictions = usePrediction(selectedStation);   // 可能跨多天

  // -------------- 2. 日期下拉 ----------------------
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);       // 默认今天：YYYY-MM-DD
  });

  const availableDates = Array.from({ length: 4 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const isToday = selectedDate === todayStr;

  // -------------- 3. 统一排序 ----------------------
  const sorted = [...predictions].sort(
    (a, b) => new Date(a.forecastTime).getTime() - new Date(b.forecastTime).getTime()
  );

  // -------------- 4. 过滤出应显示的 8 条 ------------
  let filtered: PredictionResult[] = [];

  if (isToday) {
    // 今天：从今天 00:00 往后取最早的 8 条，不够就自然跨到明天
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    filtered = sorted
      .filter(p => new Date(p.forecastTime) >= todayMidnight)
      .slice(0, 8);
  } else {
    // 非今天：只能取选定日期 00:00 起连续 8 条
    const thatMidnight = new Date(`${selectedDate}T00:00:00`);
    filtered = sorted
      .filter(
        p =>
          p.forecastTime.slice(0, 10) === selectedDate && // 同一天
          new Date(p.forecastTime) >= thatMidnight
      )
      .slice(0, 8);
  }

  // -------------- 5. 组装图表数据 ------------------
  const bikesChartData = [
    ['Time', 'Available Bikes'],
    ...filtered.map(p => [
      new Date(p.forecastTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      p.availableBikes,
    ]),
  ];

  const standsChartData = [
    ['Time', 'Available Stands'],
    ...filtered.map(p => [
      new Date(p.forecastTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      p.availableBikeStands,
    ]),
  ];

  // 面板未打开或未选站点 ⇒ 不渲染
  if (currentPanel !== 'prediction' || !selectedStation) return null;

  // -------------- 6. 渲染 --------------------------
  return (
    <div className="ml-modal-backdrop">
      <div className="ml-modal-content">
        <button className="close-btn" onClick={closePanel}>×</button>

        <div className='title'>Bikes & Stands Availability Forecast</div>

        <hr className="section-divider" />

{/* 筛选区域（车站 + 日期） */}
<div className="ml-select-row">
  <div className="ml-select-group">
    <label className="ml-label">Station:</label>
    <select
      value={selectedStation.number}
      onChange={e => {
        const num = Number(e.target.value);
        const st = stations.find(s => s.number === num);
        st && setSelectedStation(st);
      }}
    >
      {stations.map(s => (
        <option key={s.number} value={s.number}>{s.name}</option>
      ))}
    </select>
  </div>

  <div className="ml-select-group">
    <label className="ml-label">Date:</label>
    <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
      {availableDates.map(d => (
        <option key={d} value={d}>{d}</option>
      ))}
    </select>
  </div>
</div>


        {/* 图表 */}
        {filtered.length > 0 ? (
          <div className="ml-chart-container">
           
           <div className="chart-wrapper">
            <Chart
  chartType="ColumnChart"
  data={bikesChartData}
  width="100%"
  height="100%"
  options={{
    title: 'Available Bikes',
    legend: { position: 'none' },
    colors: ['#00b792'],
    chartArea: { left: 20, top: 40, width: '92%', height: '70%' },
    bar: { groupWidth: '45%' },
    vAxis: {
      textStyle: { fontSize: 12 },
      format: '0',
      maxValue: selectedStation?.capacity ?? 40,
      minValue: 0, 
    },
    hAxis: {
      textStyle: { fontSize: 12 },
      gridlines: {
        color: '#cccccc',
        count: 4,
      },
    },
    titleTextStyle: {
    
      fontSize: 16,
      bold: true,
      color: '#333',
    },

  }}
/>
</div>
<div className="chart-wrapper">
<Chart
  chartType="ColumnChart"
  data={standsChartData}
  width="100%"
  height="100%"
  options={{
    title: 'Available Bike Stands',
    legend: { position: 'none' },
    colors: ['#ff9866'],
    chartArea: { left: 20, top: 40, width: '92%', height: '75%' },
    bar: { groupWidth: '45%' },
    vAxis: {
      textStyle: { fontSize: 12 },
      format: '0',
      maxValue: selectedStation?.capacity ?? 40,
      minValue: 0, 
    }, 
    titleTextStyle: {
      fontSize: 16,
      bold: true,
      color: '#333',
    },
    hAxis: {
      textStyle: { fontSize: 12 },
      gridlines: {
        color: '#cccccc',
        count: 4,
      },
    },

  }}
/>
</div>

          </div>
        ) : (
          <p>没有足够的预测数据。</p>
        )}
      </div>
    </div>
  );
}
