import { useEffect, useState } from 'react'
import './App.css'

interface AirQuality {
  recordedTime: string
  longitude: number
  latitude: number
  aqi: number
  pm25: number
  pm10: number
}

function App() {
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null)

  useEffect(() => {
    fetch('/api/airquality/latest')
      .then(res => res.json())
      .then(data => {
        setAirQuality(data)
      })
      .catch(err => {
        console.error('获取空气质量失败:', err)
      })
  }, [])

  return (
    <>
      <h1>当前空气质量（Dublin）</h1>
      {airQuality ? (
        <div style={{ textAlign: 'left', backgroundColor: '#f4f4f4', padding: '1rem', borderRadius: '10px' }}>
          <p><strong>时间：</strong>{new Date(airQuality.recordedTime).toLocaleString()}</p>
          <p><strong>位置：</strong>经度 {airQuality.longitude}, 纬度 {airQuality.latitude}</p>
          <p><strong>AQI：</strong>{airQuality.aqi}</p>
          <p><strong>PM2.5：</strong>{airQuality.pm25}</p>
          <p><strong>PM10：</strong>{airQuality.pm10}</p>
        </div>
      ) : (
        <p>正在加载空气质量数据...</p>
      )}
    </>
  )
}

export default App
