import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// TypeScript 中最核心和常见的一种语法：接口（interface）定义。
// 它不是代码运行时会执行的东西，而是 用于为对象指定结构和类型，帮助开发者在写代码时避免类型错误
// 如果你漏了某个字段、或者字段类型写错，编辑器就会立刻报错。这就是 TypeScript 的强类型系统的优势。

// 定义 CurrentStation 接口，规定每个车站对象应该包含哪些字段，以及它们的数据类型
// *  属性名: 类型;
// * 当你从后端拿到一大堆字段时，只要包含了接口中要求的字段，多出的字段会被自动忽略掉（除非你显式检查类型）。
// * 在 TypeScript 里，你定义的接口属性名（比如 availableBikes）必须和从后端 get 的数据中的字段名一模一样，才能正确对应上
// export interface 把这个“类型定义”导出去，别的文件可以导入使用 import { WeatherData } from '';
export interface CurrentStation {
  number: number;
  status: string;
  latitude: number;
  longitude: number;
  availableBikes: number;
  availableBikeStands: number;
  capacity: number;
  name: string;
}

// 定义上下文的结构：包含一个 stations 数组
interface StationContextValue {
  stations: CurrentStation[];
}

// 创建上下文
const StationContext = createContext<StationContextValue | undefined>(undefined);

// 提供者组件：用于包裹整个 App，集中管理车站数据
export const StationProvider = ({ children }: { children: ReactNode }) => {

  // * const [X, setX] = useState<类型>(初始值); 

  // const	用来定义一个常量（不可重新赋值）
  // [stations, setStations]	这是数组解构赋值语法，useState() 返回一个数组，里面有两个东西：
  // 1. 当前的状态值（stations） 2. 修改状态的函数（setStations）
  // 使用 React 提供的 useState Hook，表示：
  // * 创建一个类型为 CurrentStation[]（车站对象的数组）的状态变量，并把它的初始值设为空数组 []
  const [stations, setStations] = useState<CurrentStation[]>([]);
  
  // useEffect 是 React 的副作用钩子，在组件首次挂载时自动执行其中的逻辑
  useEffect(() => {

    // 向后端发送 GET 请求，获取所有当前车站信息
    fetch('/api/current-bike/all')
      .then(res => res.json())    // 把响应体解析成 JSON 数据
      .then(data => {
        console.log('站点数据:', data);   // 打印接口返回的车站数据，方便调试
        setStations(data);    // 把返回的数据设置到 stations 状态中，触发组件更新
      })
      .catch(err => console.error('获取车站数据失败:', err));
  }, []);  // 依赖项为空数组，表示只在组件首次加载时执行一次该副作用


  return (
    <StationContext.Provider value={{ stations }}>
      {children}
    </StationContext.Provider>
  );
};

// 自定义 Hook：供组件使用
export const useStationContext = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error('useStationContext 必须在 StationProvider 内使用');
  }
  return context;
};
