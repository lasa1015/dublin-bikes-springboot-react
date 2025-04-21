// src/components/Map/Legend.tsx
export default function Legend() {
  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      background: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 10,
    }}>
      <div><span style={{ background: '#4caf50', width: 12, height: 12, display: 'inline-block' }} /> &nbsp;> 15</div>
      <div><span style={{ background: '#ffeb3b', width: 12, height: 12, display: 'inline-block' }} /> &nbsp;> 7</div>
      <div><span style={{ background: '#ff9800', width: 12, height: 12, display: 'inline-block' }} /> &nbsp;> 1</div>
      <div><span style={{ background: '#f44336', width: 12, height: 12, display: 'inline-block' }} /> &nbsp;≤ 1</div>
    </div>
  );
}
