import { useEffect } from 'react';
import { useRoute } from '../../../contexts/RouteContext';     // 全局上下文，用于管理出发/到达站编号、规划触发器和结果
import useStations from '../../../hooks/useStations';          // 自定义 Hook：获取当前所有车站数据

/**
 * useRoutePlanner Hook：用于在点击 GO 后根据出发站与到达站编号规划路线
 * @param mapRef GoogleMap 实例的引用，用于确保地图已经加载完成
 */
export default function useRoutePlanner(mapRef: React.RefObject<google.maps.Map | null>) {
  
  // 获取当前车站列表（包括编号、经纬度等）
  const stations = useStations();

  // 从上下文中获取路线规划所需的状态和方法
  const {
    departureNumber,   // 出发站编号
    arrivalNumber,     // 到达站编号
    routeTrigger,      // 是否触发了路线规划（点击了 GO）
    routeResult,       // 当前的路线结果（DirectionsResult 对象）
    setRouteResult,    // 用于设置路线结果的函数
  } = useRoute();

  // useEffect：在 routeTrigger 变化时触发，尝试进行路线规划
  useEffect(() => {

    // 没点击 GO，不执行
    if (!routeTrigger) return;

    // 若出发/到达编号未设定 或 地图未加载完成，也不执行
    if (!departureNumber || !arrivalNumber || !mapRef.current) return;

    // 从车站数组中查找对应的出发站和到达站对象
    const depStation = stations.find(s => s.number === departureNumber);
    const arrStation = stations.find(s => s.number === arrivalNumber);
    
    // 如果 depStation（出发站）找不到，或者 arrStation（到达站）找不到，那就什么都不做，直接 return
    if (!depStation || !arrStation) return;

    // 创建 Google 地图提供的 DirectionsService 实例
    const directionsService = new google.maps.DirectionsService();

    // 调用 route() 方法发起路径请求
    directionsService.route(
      {
        origin: { lat: depStation.latitude, lng: depStation.longitude },       // 起点坐标
        destination: { lat: arrStation.latitude, lng: arrStation.longitude },  // 终点坐标
        travelMode: google.maps.TravelMode.BICYCLING,                          // 使用“骑行”模式
      },
      (result, status) => {

        // 如果路线规划成功，更新 routeResult 状态
        if (status === google.maps.DirectionsStatus.OK && result) {
          setRouteResult(result);
        } else {
          // 否则打印错误信息并清空结果
          console.error('路线规划失败:', status);
          setRouteResult(null);
        }
      }
    );

  // 依赖项只有 routeTrigger，否则会重复请求路线
  // 这里关闭 ESLint 的 exhaustive-deps 检查是因为我们知道要监听的只是 trigger
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [routeTrigger]);
}
