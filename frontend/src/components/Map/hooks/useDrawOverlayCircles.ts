import { useEffect, useRef } from 'react';

// 引入图层控制的上下文，用于获取当前哪些图层需要显示
import { useOverlay } from '../../../contexts/OverlayContext';

// 自定义 Hook：获取所有站点数据（包含可用自行车数、可还空位数等）
import useStations from '../../../hooks/useStations';

// 根据当前图层显示状态，在地图上绘制“借车图层”和“还车图层”的圆圈
// @param mapRef 地图实例的引用（GoogleMap 加载完成时写入的 ref）
export default function useDrawOverlayCircles(mapRef: React.RefObject<google.maps.Map | null>) {

  // 获取当前所有车站数据
  const stations = useStations();

  // 获取当前图层状态（是否显示借车图层、是否显示还车图层）
  const { showBikesLayer, showStandsLayer } = useOverlay();

  // 可借车数量圆圈
  const bikeCirclesRef = useRef<google.maps.Circle[]>([]);

  // 可还车位数量圆圈
  const standCirclesRef = useRef<google.maps.Circle[]>([]);


  useEffect(() => {

    // 地图未加载完成时不执行
    if (!mapRef.current) return;

    const map = mapRef.current;

    // 清除旧圆圈（从地图上移除）
    bikeCirclesRef.current.forEach(c => c.setMap(null));
    standCirclesRef.current.forEach(c => c.setMap(null));

    // 清空引用数组
    bikeCirclesRef.current = [];
    standCirclesRef.current = [];

    // 辅助函数：根据数量返回对应的颜色和半径系数
    const getColorAndRadius = (c: number) => {
      if (c > 15) return { color: '#4caf50', factor: 9 };     // 绿色
      if (c > 7)  return { color: '#ff9800', factor: 10 };     // 橙色
      if (c >= 1) return { color: '#f44336', factor: 10 };     // 红色    
      return             { color: '#000000', factor: 10 };     // 黑色
    }  

    const minRadius = 30; // 圆圈最小半径

    // 如果需要显示借车图层，则为每个车站绘制一个圆圈，表示可借车数量
    if (showBikesLayer) {

      bikeCirclesRef.current = stations.map(st => {        

        const { color, factor } = getColorAndRadius(st.availableBikes);


        return new google.maps.Circle({
          map, // 绑定地图
          center: { lat: st.latitude, lng: st.longitude },  // 圆心为车站坐标
          radius: Math.max(st.availableBikes * factor, minRadius),  // 半径按可借车数量乘以系数
          fillColor: color,   // 填充颜色
          fillOpacity: 0.35,
          strokeColor: '#fff', // 描边白色
          strokeOpacity: 0.55,
          strokeWeight: 1,
          clickable: false, // 圆圈不可点击
        });
      }).filter(Boolean) as google.maps.Circle[]; // 过滤掉 null 项
    }

    // 如果需要显示还车图层，同理绘制可还空位的圆圈
    if (showStandsLayer) {
      standCirclesRef.current = stations.map(st => {
        
        
        const { color, factor } = getColorAndRadius(st.availableBikeStands);

        return new google.maps.Circle({
          map,
          center: { lat: st.latitude, lng: st.longitude },
          radius: Math.max(st.availableBikeStands * factor, minRadius),

          fillColor:color,
          fillOpacity: 0.35,
          strokeColor: '#fff',
          strokeOpacity: 0.55,
          strokeWeight: 1,
          clickable: false,
        });
      }).filter(Boolean) as google.maps.Circle[];
    }

  }, [stations, showBikesLayer, showStandsLayer]); // 依赖项变化时重新执行 useEffect
}
