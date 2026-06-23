import { create } from 'zustand';

let zCounter = 1;
let openCount = 0;

export const useWindowStore = create((set) => ({
  windows: {}, // { [appId]: { x, y, width, height, zIndex, isOpen } }

  // Remembers last bounds even after close — only cleared on full page reload
  _savedBounds: {}, // { [appId]: { x, y, width, height } }

  openWindow: (appId, app) =>
    set((state) => {
      const existing = state.windows[appId];
      if (existing?.isOpen) {
        return {
          windows: {
            ...state.windows,
            [appId]: { ...existing, zIndex: ++zCounter },
          },
        };
      }

      // Prefer saved bounds from a previous session, fall back to defaults
      const saved = state._savedBounds[appId];
      const offset = (openCount++ % 6) * 24;

      return {
        windows: {
          ...state.windows,
          [appId]: {
            x: saved?.x ?? 60 + offset,
            y: saved?.y ?? 60 + offset,
            width: saved?.width ?? app.defaultSize.width,
            height: saved?.height ?? app.defaultSize.height,
            isOpen: true,
            zIndex: ++zCounter,
          },
        },
      };
    }),

  closeWindow: (appId) =>
    set((state) => {
      const win = state.windows[appId];
      const { [appId]: _, ...rest } = state.windows;
      return {
        windows: rest,
        // Stash position & size so it re-opens in the same spot
        _savedBounds: {
          ...state._savedBounds,
          [appId]: win
            ? { x: win.x, y: win.y, width: win.width, height: win.height }
            : state._savedBounds[appId],
        },
      };
    }),

  focusWindow: (appId) =>
    set((state) => ({
      windows: { ...state.windows, [appId]: { ...state.windows[appId], zIndex: ++zCounter } },
    })),

  updateBounds: (appId, bounds) =>
    set((state) => ({
      windows: { ...state.windows, [appId]: { ...state.windows[appId], ...bounds } },
    })),
}));