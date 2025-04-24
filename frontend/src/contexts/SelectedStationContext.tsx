import { createContext, useContext, useState, ReactNode } from 'react';
import { CurrentStation } from './StationContext'; // 复用你已有的 CurrentStation 类型

interface SelectedStationContextValue {
  selectedStation: CurrentStation | null;
  setSelectedStation: (station: CurrentStation | null) => void;
}

// 创建 Context，初始值是 undefined，等 Provider 提供实际数据
const SelectedStationContext = createContext<SelectedStationContextValue | undefined>(undefined);

// Provider 组件，外面包一层，里面所有组件都可以用这个 context
export const SelectedStationProvider = ({ children }: { children: ReactNode }) => {
  
  const [selectedStation, setSelectedStation] = useState<CurrentStation | null>(null);

  return (
    <SelectedStationContext.Provider value={{ selectedStation, setSelectedStation }}>
      {children}
    </SelectedStationContext.Provider>
  );
};

// 自定义 Hook，调用方便一些
export const useSelectedStation = () => {
  const context = useContext(SelectedStationContext);
  if (!context) {
    throw new Error('useSelectedStation 必须在 SelectedStationProvider 内使用');
  }
  return context;
};
