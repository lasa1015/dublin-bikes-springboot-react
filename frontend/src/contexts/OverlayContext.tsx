// 引入 React 中管理状态和上下文相关的函数和类型
import { createContext, useContext, useState, ReactNode } from 'react';

// 定义上下文中需要共享的数据结构（类型）
interface OverlayContextType {
  showBikesLayer: boolean;      // 是否显示“可借车”图层
  showStandsLayer: boolean;     // 是否显示“可还车位”图层
  toggleBikes: () => void;      // 切换“可借车图层”的显示状态（互斥逻辑）
  toggleStands: () => void;     // 切换“可还车图层”的显示状态（互斥逻辑）
}

// 创建 Context 对象，初始值设为 undefined，类型是 OverlayContextType 或 undefined
const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

// 提供器组件：用于在外层包裹组件，让它们可以共享这个上下文
export const OverlayProvider = ({ children }: { children: ReactNode }) => {

  // 变量：是否显示“可借车图层”
  const [showBikesLayer, setShowBikesLayer] = useState(false);

  // 变量：是否显示“可还车位图层”
  const [showStandsLayer, setShowStandsLayer] = useState(false);

  // 函数： 点击“Bike Map”按钮时触发
  // 如果图层已经显示，就关闭；如果没显示，就打开它并关闭另一个
  const toggleBikes = () => {

    setShowStandsLayer(false);          // 先关闭另一个
    setShowBikesLayer(prev => !prev);   // 再反转自己的状态
  };

  // 函数： 点击“Stand Map”按钮时触发
  const toggleStands = () => {

    setShowBikesLayer(false);
    setShowStandsLayer(prev => !prev); 
  };

  // 向下层组件提供状态和操作函数
  return (

    <OverlayContext.Provider
      
    //* 这 4 个 变量+函数 就是 通过 useOverlay() 拿到的全部内容
      value={{
        showBikesLayer,     // 当前借车图层是否可见
        showStandsLayer,    // 当前还车图层是否可见
        toggleBikes,        // 切换借车图层函数
        toggleStands        // 切换还车图层函数
      }}
    >
      {children}  {/* 所有被包裹的组件都可以通过 useOverlay() 获取这些值 */}
    </OverlayContext.Provider>
  );
};

// 自定义 Hook，方便在组件中直接使用 useOverlay()
// 这是最推荐的方式：比 useContext(OverlayContext) 更简洁、更统一
export const useOverlay = () => {

  const context = useContext(OverlayContext);  // 从上下文中获取当前值

  if (!context) {
    // 如果组件没有被 OverlayProvider 包裹，强行调用会报错，避免出错时难以定位
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;  // 返回共享的状态和方法
};
