import { create } from 'zustand';

let zCounter = 1;
let openCount = 0;

export const useWindowStore = create((set) => ({
  windows: {}, // { [appId]: { x, y, width, height, zIndex, isOpen } }

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
      const offset = (openCount++ % 6) * 24;
      return {
        windows: {
          ...state.windows,
          [appId]: {
            x: 60 + offset,
            y: 60 + offset,
            width: app.defaultSize.width,
            height: app.defaultSize.height,
            isOpen: true,
            zIndex: ++zCounter,
          },
        },
      };
    }),

  closeWindow: (appId) =>
    set((state) => {
      const { [appId]: _, ...rest } = state.windows;
      return { windows: rest };
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