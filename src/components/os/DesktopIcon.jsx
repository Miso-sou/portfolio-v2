import { useState, useCallback, useRef } from 'react';
import { useWindowStore } from '../../store/windowStore.js';
import WeatherIcon from './WeatherIcon.jsx';

const DRAG_THRESHOLD = 5;

function FallbackIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12">
      <rect width="48" height="48" fill="#F1DAEC" stroke="#3C5564" strokeWidth="3" />
    </svg>
  );
}

function IconImage({ app }) {
  const [imgError, setImgError] = useState(false);

  if (app.dynamicIcon) {
    return <WeatherIcon className="w-12 h-12 pointer-events-none" />;
  }

  if (!app.icon || imgError) {
    return <FallbackIcon />;
  }

  return (
    <img
      src={app.icon}
      className="w-13 h-13 pointer-events-none"
      alt={app.title}
      draggable={false}
      onError={() => setImgError(true)}
    />
  );
}

export default function DesktopIcon({ app, isSelected, onSelect, position, onDragEnd }) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [dragOffset, setDragOffset] = useState(null);
  const dragRef = useRef(null);

  const handlePointerDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        iconX: position.x,
        iconY: position.y,
        dragging: false,
      };
    },
    [position]
  );

  const handlePointerMove = useCallback((e) => {
    const ds = dragRef.current;
    if (!ds) return;

    const dx = e.clientX - ds.startX;
    const dy = e.clientY - ds.startY;

    if (!ds.dragging && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return;

    ds.dragging = true;
    setDragOffset({ dx, dy });
  }, []);

  const handlePointerUp = useCallback(
    (e) => {
      const ds = dragRef.current;
      dragRef.current = null;

      if (!ds) return;

      if (ds.dragging) {
        const dx = e.clientX - ds.startX;
        const dy = e.clientY - ds.startY;
        setDragOffset(null);
        onDragEnd(app.id, { x: ds.iconX + dx, y: ds.iconY + dy });
      } else {
        // Was a click, not a drag
        onSelect(app.id);
      }
    },
    [app.id, onDragEnd, onSelect]
  );

  const handleDoubleClick = useCallback(
    (e) => {
      e.stopPropagation();
      openWindow(app.id, app);
    },
    [app.id, app, openWindow]
  );

  const currentX = position.x + (dragOffset?.dx || 0);
  const currentY = position.y + (dragOffset?.dy || 0);

  return (
    <div
      className="absolute w-20 flex flex-col items-center gap-1 p-1 cursor-pointer select-none group"
      style={{ left: currentX, top: currentY, zIndex: dragOffset ? 1000 : 1 }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      <IconImage app={app} />
      <span
        className={`font-display text-[7px] text-center leading-tight break-words w-full pointer-events-none ${
          isSelected ? 'bg-os-ink text-os-accent px-0.5' : 'text-os-ink'
        }`}
      >
        {app.title}
      </span>
    </div>
  );
}
