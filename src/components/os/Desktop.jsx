import { useState, useCallback } from 'react';
import { APPS } from '../../config/apps.js';
import { useWindowStore } from '../../store/windowStore.js';
import GifClockWidget from '../widgets/GifClockWidget.jsx';
import DesktopIcon from './DesktopIcon.jsx';
import Window from './Window.jsx';

const appList = Object.values(APPS);

const STORAGE_KEY = 'desktop-icon-positions';
const ICON_HEIGHT = 90; // approx icon + label height
const ICON_WIDTH = 80; // w-20 = 80px
const ICON_GAP = 104; // vertical spacing between default icons
const WIDGET_PADDING = 20; // breathing room around widget

/* ── Default icon positions (vertical column, left side) ── */
function getDefaultPositions() {
  const positions = {};
  appList.forEach((app, i) => {
    positions[app.id] = { x: 24, y: 32 + i * ICON_GAP };
  });
  return positions;
}

/* ── LocalStorage helpers ── */
function loadPositions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults so new apps always get a position
      return { ...getDefaultPositions(), ...parsed };
    }
  } catch {
    /* ignore corrupt data */
  }
  return getDefaultPositions();
}

function savePositions(positions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    /* quota exceeded, ignore */
  }
}

/* ── Widget overlap detection ── */
function isOverlappingWidget(iconX, iconY) {
  const widget = document.getElementById('gif-clock-widget');
  if (!widget) return false;

  const wr = widget.getBoundingClientRect();

  // Icon rect
  const iLeft = iconX;
  const iTop = iconY;
  const iRight = iconX + ICON_WIDTH;
  const iBottom = iconY + ICON_HEIGHT;

  // Widget rect with padding
  const wLeft = wr.left - WIDGET_PADDING;
  const wTop = wr.top - WIDGET_PADDING;
  const wRight = wr.right + WIDGET_PADDING;
  const wBottom = wr.bottom + WIDGET_PADDING;

  return !(iRight < wLeft || iLeft > wRight || iBottom < wTop || iTop > wBottom);
}

export default function Desktop() {
  const windows = useWindowStore((s) => s.windows);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [iconPositions, setIconPositions] = useState(loadPositions);

  const handleDesktopClick = useCallback(() => {
    setSelectedIcon(null);
  }, []);

  const handleSelectIcon = useCallback((appId) => {
    setSelectedIcon(appId);
  }, []);

  const handleIconDragEnd = useCallback((appId, newPos) => {
    // Clamp to desktop bounds
    const clampedX = Math.max(0, Math.min(newPos.x, window.innerWidth - ICON_WIDTH));
    const clampedY = Math.max(0, Math.min(newPos.y, window.innerHeight - ICON_HEIGHT));

    // Prevent dropping on top of the widget — snap back
    if (isOverlappingWidget(clampedX, clampedY)) return;

    setIconPositions((prev) => {
      const next = { ...prev, [appId]: { x: clampedX, y: clampedY } };
      savePositions(next);
      return next;
    });
  }, []);

  const openWindowIds = Object.keys(windows).filter((id) => windows[id]?.isOpen);

  return (
    <div
      className="w-screen h-screen relative overflow-hidden bg-os-bg"
      onClick={handleDesktopClick}
    >
      {/* Clock widget */}
      <GifClockWidget />

      {/* Desktop icons (each absolutely positioned) */}
      {appList.map((app) => (
        <DesktopIcon
          key={app.id}
          app={app}
          isSelected={selectedIcon === app.id}
          onSelect={handleSelectIcon}
          position={iconPositions[app.id]}
          onDragEnd={handleIconDragEnd}
        />
      ))}

      {/* Open windows */}
      {openWindowIds.map((id) => (
        <Window key={id} app={APPS[id]} />
      ))}
    </div>
  );
}
