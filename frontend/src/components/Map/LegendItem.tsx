import './Legend.css';


// 函数参数是用对象解构的方式，直接解构出 color 和 label；
// 后面 : { color: string; label: string } 是告诉 TypeScript：这两个参数都是字符串类型。
export default function LegendItem({ color, label,}: { color: string;  label: string;}) {

  return (
    <div className="legend-item">

      {/* 彩色小圆圈 */}
      <span className="legend-color" style={{ backgroundColor: color }} />
     
      {/* 说明文字 */}
      <span>{label}</span>
    </div>
  );
}
