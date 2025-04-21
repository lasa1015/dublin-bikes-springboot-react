import React from 'react';

interface Props {
  showBikes: boolean;
  showStands: boolean;
  onToggleBikes: () => void;
  onToggleStands: () => void;
}

export default function ToggleOverlayButtons({
  showBikes,
  showStands,
  onToggleBikes,
  onToggleStands,
}: Props) {
  return (
    <div style={{ position: 'absolute', top: 80, left: 20, zIndex: 10 }}>
      <button
        onClick={onToggleBikes}
        style={{
          backgroundColor: showBikes ? '#4caf50' : '#e0e0e0',
          color: showBikes ? 'white' : 'black',
          padding: '8px 12px',
          marginRight: '8px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Bikes Distribution
      </button>

      <button
        onClick={onToggleStands}
        style={{
          backgroundColor: showStands ? '#2196f3' : '#e0e0e0',
          color: showStands ? 'white' : 'black',
          padding: '8px 12px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Stands Distribution
      </button>
    </div>
  );
}
