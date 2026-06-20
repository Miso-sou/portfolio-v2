import { Rnd } from 'react-rnd';
import { useWindowStore } from '../../store/windowStore.js';

export default function Window({ app }) {
  const win = useWindowStore((s) => s.windows[app.id]);
  const { focusWindow, closeWindow, updateBounds } = useWindowStore();

  if (!win || !win.isOpen) return null;

  return (
    <Rnd
      size={{ width: win.width, height: win.height }}
      position={{ x: win.x, y: win.y }}
      minWidth={app.minSize.width}
      minHeight={app.minSize.height}
      bounds="parent"
      dragHandleClassName="window-titlebar"
      disableDragging={false}
      enableResizing={true}
      style={{ zIndex: win.zIndex }}
      onDragStop={(e, d) => updateBounds(app.id, { x: d.x, y: d.y })}
      onResizeStop={(e, dir, ref, delta, pos) =>
        updateBounds(app.id, { width: ref.offsetWidth, height: ref.offsetHeight, ...pos })
      }
      onMouseDown={() => focusWindow(app.id)}
    >
      <div className="flex flex-col w-full h-full border-2 border-os-ink shadow-retro bg-os-window">
        <div className="window-titlebar flex items-center justify-between px-2 py-1.5 bg-os-accent border-b-2 border-os-ink cursor-move select-none">
          <span className="font-display text-[10px] truncate pr-2">{app.title}</span>
          <button
            onClick={() => closeWindow(app.id)}
            className="w-5 h-5 border-2 border-os-ink font-display text-[8px] flex items-center justify-center shrink-0 bg-os-window hover:bg-os-bg active:shadow-none cursor-pointer"
          >
            X
          </button>
        </div>
        <div
          className="flex-1 overflow-auto retro-scrollbar font-body p-3"
          style={{ containerType: 'inline-size', fontSize: 'clamp(0.875rem, 2.4cqw, 1.25rem)' }}
        >
          <app.component />
        </div>
      </div>
    </Rnd>
  );
}