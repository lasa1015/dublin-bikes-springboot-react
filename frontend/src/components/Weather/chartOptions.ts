
// 通用图表样式配置（温度图与风速图共用）
export const baseChartOptions = {
  legend: 'none',
  curveType: 'none',
  lineWidth: 2,
  pointSize: 4,

  hAxis: {
    textStyle: { fontSize: 12.5 },
    gridlines: {
      color: '#cccccc',
      count: 4,
    },
  },

  vAxis: {
    textStyle: { fontSize: 11 },
    gridlines: {
      color: '#cccccc',
      count: 5,
    },
  },

  chartArea: {
    width: '87%',
    height: '70%',
    top: 40,
  },

  titleTextStyle: {
    fontSize: 16,
    bold: true,
    color: '#333',
  },

  backgroundColor: 'transparent',
};
