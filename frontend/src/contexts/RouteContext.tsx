import { createContext, useContext, useState, ReactNode } from 'react';

// 定义全局上下文 RouteContext 的结构类型（TypeScript 接口）
// 这个接口决定了 Context 中包含哪些状态值（数据）和操作方法（函数）
interface RouteContextType {

  departureNumber : number | null;                     // 当前选中的“出发站”编号

  arrivalNumber   : number | null;                     // 当前选中的“到达站”编号

  routeTrigger    : number;                            // 触发值，每点击一次“GO”按钮就 +1，用来强制触发路线重新计算

  routeResult     : google.maps.DirectionsResult | null; // 规划好的路线对象（由 Google DirectionsService 返回）

  // —— 修改这些值的函数 —— //
  setDepartureNumber: (num: number) => void;           // 设置出发站编号

  setArrivalNumber  : (num: number) => void;           // 设置到达站编号
  
  fireRoute         : () => void;                      // 触发重新规划路线
  
  setRouteResult    : (res: google.maps.DirectionsResult | null) => void; // 设置路线结果

  clearAll        : () => void;                      // 一键清除所有状态（出发站、到达站）
}

// 创建 RouteContext，并指定初始值为 undefined（表示还未提供上下文时是无效状态）
export const RouteContext = createContext<RouteContextType | undefined>(undefined);

// 创建 RouteProvider 组件，它是一个“上下文提供者”
export function RouteProvider({ children }: { children: ReactNode }) {

  // 当前出发站编号（初始为 null）
  const [departureNumber, _setDepartureNumber] = useState<number | null>(null);

  // 当前到达站编号（初始为 null）
  const [arrivalNumber  , _setArrivalNumber  ] = useState<number | null>(null);

  // 点击“GO”按钮的次数（每次点击都 +1，触发路线重新计算）
  const [routeTrigger , setRouteTrigger ] = useState(0);

  // 当前路线规划的返回结果（DirectionsResult）
  const [routeResult  , setRouteResult  ] = useState<google.maps.DirectionsResult | null>(null);


  // 设定出发站时，更新出发编号，并清除旧路线结果
  const setDepartureNumber = (num: number) => {
    _setDepartureNumber(num);    // 更新出发编号
    setRouteResult(null);        // 清空路线结果
  };

  // 设定终点站时，更新到达编号，并清除旧路线结果
  const setArrivalNumber = (num: number) => {
    _setArrivalNumber(num);      // 更新到达编号
    setRouteResult(null);        // 清空路线结果
  };

  const clearAll = () => {
    _setDepartureNumber(null);   // 清空出发编号  
    _setArrivalNumber(null);   // 清空到达编号
    setRouteResult(null);        // 清空路线结果  

  }

  // 用户点击“GO”按钮时，触发值 +1，强制刷新路线
  const fireRoute = () => setRouteTrigger(prev => prev + 1);

  // 把所有状态和操作函数包装成一个对象，通过 Context Provider 提供出去
  return (
    <RouteContext.Provider
      value={{
        departureNumber,
        arrivalNumber,
        routeTrigger,
        routeResult,
        setDepartureNumber,
        setArrivalNumber,
        fireRoute,
        setRouteResult,
        clearAll
      }}
    >
      {/* 所有使用该 Provider 的子组件都能访问上面这些值 */}
      {children}
    </RouteContext.Provider>
  );
}

// 创建一个自定义 Hook：useRoute，用于访问 RouteContext
// 注意：只能在 <RouteProvider> 包裹的组件树中使用该 Hook
export function useRoute() {
  const ctx = useContext(RouteContext);
  if (!ctx) throw new Error('useRoute must be used within RouteProvider'); // 防止意外调用
  return ctx;
}
