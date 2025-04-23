import { useRoute } from '../../contexts/RouteContext';   // 引入上下文，管理出发站和到达站
import { CurrentStation } from '../../hooks/useStations';  // 引入车站数据的类型定义
import './InfoWindowContent.css';  // 引入样式表

// 定义组件的 Props 类型，要求传入一个 station（当前车站对象）
interface Props {

  station: CurrentStation;
}

//* const InfoWindowContent = ... 这表示定义一个常量变量 InfoWindowContent，它是一个函数组件
//* = ({ station }: Props) => { ... } 这部分是一个箭头函数。(参数) => { 函数体 }
// * { station }  这是对象解构（Destructuring），意思是我们传进来的 props 对象里只取出 station 这一项。
// * 正常方式写 InfoWindowContent = (props: Props) => { , props 是整个传进来的对象，用 props.station 去访问
const InfoWindowContent = ({ station }: Props) => {

  // 从全局上下文中获取当前的出发站编号、到达站编号，以及设置它们的函数
  const {
    departureNumber,
    arrivalNumber,
    setDepartureNumber,
    setArrivalNumber
  } = useRoute();

  // 判断当前 station 是否是“出发站”或“到达站”
  const isDeparture = station.number === departureNumber;
  const isArrival   = station.number === arrivalNumber;

  return (
    <div id="stand_info">
   
      <div style={{ fontSize: '15px' }}>Station No. {station.number}</div>
   
      <h2>{station.name?.toUpperCase()}</h2>

      {/* ==	宽松等于（Loose Equality）	比较两个值是否相等，会自动转换类型 ，  '5' == 5* true/}
      {/* ===	严格等于（Strict Equality）	比较两个值是否完全相等，值和类型都要一样 '5' === 5  false*/}
      {/* 用 === 更安全*/}
      <h4>{station.status === 'OPEN' ? 'OPEN' : 'CLOSED'}</h4>
 
      <div><span className="label">Available bike stands:</span> {station.availableBikeStands}</div>

      <div><span className="label">Available bikes:</span> {station.availableBikes}</div>

      <div><span className="label">Mechanical bikes:</span> {station.mechanicalBikes}</div>
     
      <div><span className="label">Electrical bikes:</span> {station.electricalBikes}</div>

      <div><span className="label">Credit cards accepted:</span>

        {station.banking ? (
          <img src="/img/green_tick.png" alt="yes" />  // 支持信用卡，显示绿色对勾
        ) : (
          <img src="/img/red_cross.png" alt="no" />  // 不支持信用卡，显示红叉
        )}

      </div>

      <button id="ml_prediction_btn">ML Future Availability Prediction</button>

      <div style={{ marginTop: 10 }}>
        
        {/* 设为出发站按钮，若已是出发站则禁用 */}
        <button
          // 总是会有一个类叫 "plan-btn"；
          // 如果 isDeparture 为 true，再加一个类叫 "disabled"；
          // 如果 isDeparture 为 false，就什么都不加（加个空字符串）；
          //* 模板字符串是用 反引号 （不是单引号 '） 包起来的字符串, $ 符号 + 花括号 ${} 用来插入变量
          className={`plan-btn ${isDeparture ? 'disabled' : ''}`}
          onClick={() => setDepartureNumber(station.number)}
          // disabled 是 HTML 中 button、input 等元素的一个属性，禁用这个元素，让它不能被点击或操作
          // 如果 isDeparture 是 true，就禁用按钮（不能点击）； 如果 isDeparture 是 false，就启用按钮（可以点击）。
          disabled={isDeparture}
        >
          Set as Departure
        </button>

        {/* 设置为到达站的按钮，若已是到达站则禁用 */}
        <button
          className={`plan-btn ${isArrival ? 'disabled' : ''}`}
          onClick={() => setArrivalNumber(station.number)}
          disabled={isArrival}
          style={{ marginLeft: 10 }}
        >
          Set as Arrival
        </button>
      </div>
    </div>
  );
};

// 导出组件，供其他文件使用
export default InfoWindowContent;
