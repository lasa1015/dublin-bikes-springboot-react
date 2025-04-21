// src/components/Map/Legend.tsx
export default function Legend() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '130px',
        right: '60px',
        width: '70px',
        background: 'rgba(255, 255, 255, 0.6)',
        padding: '10px 14px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',  // 👈 垂直排列
        gap: '10px',
        alignItems: 'flex-start',
        zIndex: 10,
        fontSize: '12px',
        color: '#5a5a5a',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <LegendItem color="#4caf50" label="n >= 15" />
      <LegendItem color="#ff9800" label="n >= 7" />
      <LegendItem color="#f44336" label="n >= 1" />
      <LegendItem color="#000000" label="n  = 0" />
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          backgroundColor: color,
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '1px solid #fff',
          display: 'inline-block',
          marginRight: 5,
          opacity: 0.65, // 👈 添加透明度
        }}
      />
      <span>{label}</span>
    </div>
  );
}
