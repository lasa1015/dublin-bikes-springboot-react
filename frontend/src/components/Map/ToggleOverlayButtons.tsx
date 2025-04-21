import './ToggleOverlayButtons.css';

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
    <div className="toggle-overlay-buttons">
      <button
        className={showBikes ? 'active' : ''}
        onClick={onToggleBikes}
      >
        Bike Map
      </button>
      <button
        className={showStands ? 'active' : ''}
        onClick={onToggleStands}
      >
        Stand Map
      </button>
    </div>
  );
}
