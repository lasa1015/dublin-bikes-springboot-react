// 地图容器样式：宽度 100%，高度填满整个视口高度（vh 表示视口高度单位）
export const mapStyle = { width: '100%', height: '100vh' };

// 地图默认中心点：都柏林
export const defaultCenter = { lat: 53.346, lng: -6.26 };

// 地图的详细配置项（类型为 Google Maps 官方定义的 MapOptions）
export const mapOptions: google.maps.MapOptions = {

  disableDefaultUI: true,      // 禁用所有默认 UI 控件（如缩放按钮、地图类型切换按钮等）

  zoomControl: true,           // 单独启用“缩放控件”（因为默认 UI 被禁了，这里手动打开缩放功能）

  gestureHandling: 'greedy',   // 鼠标/触控手势响应设置为 "贪婪模式"，意思是滚轮滚动地图会立即响应，不会被页面滚动打断

  clickableIcons: false,       // 禁用点击地图上的默认兴趣点图标（比如餐厅、商店等的提示）

  styles: [
    {
      featureType: 'poi',      // poi = point of interest（兴趣点，比如商场、景点）
      elementType: 'labels',    // 只作用于“兴趣点”的文字标签
      stylers: [{ visibility: 'off' }],   // 把这些兴趣点的文字标签隐藏掉（界面更干净）
    },
    // {
    //   featureType: 'transit',  // transit = 公共交通（地铁站、公交站等）
    //   elementType: 'labels',   // 同样只隐藏文字标签
    //   stylers: [{ visibility: 'off' }],
    // },
  ],
};
