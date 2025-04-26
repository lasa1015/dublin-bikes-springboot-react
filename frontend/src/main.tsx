// React 提供了组件、hooks 等核心功能
import React from 'react';

// ReactDOM 提供了将 React 组件渲染到真实 DOM 的功能
import ReactDOM from 'react-dom/client';

// 导入你自己写的主组件 App，它是整个应用的根组件
import App from './App.tsx';

// 导入全局样式文件，控制页面的整体样式
import './index.css';

// 屏蔽 console.log 的代码
console.log = () => {};

// 创建一个 React 根节点，并将 <App /> 挂载到 HTML 中 id 为 'root' 的元素上
// .render(...) 把你写的 React 组件渲染到这个根节点中
ReactDOM.createRoot(document.getElementById('root')!).render(

  // <React.StrictMode> 是一个开发模式下的工具，不会渲染任何内容，只会帮助你发现潜在问题：
  // - 检查副作用是否安全
  // - 检查老 API 是否被废弃
  // - 在开发时对函数组件执行两次 render（不会影响生产环境）

  <React.StrictMode>  
    <App />
  </React.StrictMode>
);
