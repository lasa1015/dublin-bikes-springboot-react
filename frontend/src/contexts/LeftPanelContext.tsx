// 引入 React 的创建上下文函数（createContext）、Hook（useContext, useState）、类型（ReactNode）
import { createContext, useContext, useState, ReactNode } from 'react';

// 定义支持的面板类型 —— 'weather' 表示天气面板，'prediction' 表示机器学习预测面板，null 表示没有打开任何面板
type LeftPanelType = 'weather' | 'prediction' | null;

// 定义 context 共享的数据结构 
interface LeftPanelContextValue {
  currentPanel: LeftPanelType;                            // 当前打开的面板类型
  openPanel: (panel: Exclude<LeftPanelType, null>) => void;  // 打开某个面板（不能传 null）
  closePanel: () => void;                                 // 关闭当前面板
}

// 创建上下文对象 —— 默认值是 undefined，说明必须包在 Provider 内才能用
const LeftPanelContext = createContext<LeftPanelContextValue | undefined>(undefined);

// LeftPanelProvider 是上下文的“提供者”，用于在组件树中共享状态
export const LeftPanelProvider = ({ children }: { children: ReactNode }) => {

  // 状态：当前打开的面板。初始为 null，表示没有打开任何面板
  const [currentPanel, setCurrentPanel] = useState<LeftPanelType>(null);

  // 打开面板的函数 —— 接收 'weather' 或 'prediction'，更新当前状态
  const openPanel = (panel: Exclude<LeftPanelType, null>) => setCurrentPanel(panel);
  
  // 关闭面板的函数 —— 设置当前状态为 null，表示无面板显示
  const closePanel = () => setCurrentPanel(null);

  // 提供 context 给子组件
  return (
    <LeftPanelContext.Provider value={{ currentPanel, openPanel, closePanel }}>
      {children}
    </LeftPanelContext.Provider>
  );
};

// 自定义 Hook，用于在组件中使用面板上下文
export const useLeftPanel = () => {
  const context = useContext(LeftPanelContext);     // 从上下文读取值

  // 如果使用这个 Hook 的组件没有被 LeftPanelProvider 包裹，就抛出错误
  if (!context) {
    throw new Error('useLeftPanel 必须在 LeftPanelProvider 内使用');
  }

  // 返回当前 context 值
  return context;
};
