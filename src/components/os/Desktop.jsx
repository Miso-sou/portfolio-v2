import { useState, useCallback } from 'react';
import { APPS } from '../../config/apps.js';
import { useWindowStore } from '../../store/windowStore.js';
import GifClockWidget from '../widgets/GifClockWidget.jsx';
import DesktopIcon from './DesktopIcon.jsx';
import Window from './Window.jsx';
import GlobalAudio from './GlobalAudio.jsx';

const appList = Object.values(APPS);

const STORAGE_KEY = 'desktop-icon-positions';
const ICON_HEIGHT = 90; // approx icon + label height
const ICON_WIDTH = 80; // w-20 = 80px
const ICON_GAP_Y = 104; // vertical spacing between default icons
const ICON_GAP_X = 96; // horizontal spacing between columns
const ICON_START_X = 24;
const ICON_START_Y = 32;
const WIDGET_PADDING = 20; // breathing room around widget
const ICON_COLLISION_PAD = 8; // padding between icons for collision check

/* ── Default icon positions (vertical columns, wrapping when exceeding viewport) ── */
function getDefaultPositions() {
  const viewportH = window.innerHeight || 768;
  const maxPerCol = Math.max(1, Math.floor((viewportH - ICON_START_Y) / ICON_GAP_Y));

  const positions = {};
  appList.forEach((app, i) => {
    const col = Math.floor(i / maxPerCol);
    const row = i % maxPerCol;
    positions[app.id] = {
      x: ICON_START_X + col * ICON_GAP_X,
      y: ICON_START_Y + row * ICON_GAP_Y,
    };
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

  const iRight = iconX + ICON_WIDTH;
  const iBottom = iconY + ICON_HEIGHT;

  const wLeft = wr.left - WIDGET_PADDING;
  const wTop = wr.top - WIDGET_PADDING;
  const wRight = wr.right + WIDGET_PADDING;
  const wBottom = wr.bottom + WIDGET_PADDING;

  return !(iRight < wLeft || iconX > wRight || iBottom < wTop || iconY > wBottom);
}

/* ── Icon-to-icon overlap detection ── */
function isOverlappingOtherIcon(appId, x, y, positions) {
  const pad = ICON_COLLISION_PAD;
  const aLeft = x - pad;
  const aTop = y - pad;
  const aRight = x + ICON_WIDTH + pad;
  const aBottom = y + ICON_HEIGHT + pad;

  for (const [id, pos] of Object.entries(positions)) {
    if (id === appId) continue;
    const bRight = pos.x + ICON_WIDTH;
    const bBottom = pos.y + ICON_HEIGHT;
    if (!(aRight < pos.x || aLeft > bRight || aBottom < pos.y || aTop > bBottom)) {
      return true;
    }
  }
  return false;
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

    // Prevent dropping on top of another icon — snap back
    setIconPositions((prev) => {
      if (isOverlappingOtherIcon(appId, clampedX, clampedY, prev)) return prev;
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

      {/* Global background audio */}
      <GlobalAudio />

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
