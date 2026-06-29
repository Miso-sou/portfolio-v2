import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const TRACKS = [
  {
    title: 'Lofi Hip Hop Radio',
    artist: 'Laut.fm 24/7 Live',
    url: 'https://lofi.stream.laut.fm/lofi',
  },
  {
    title: 'Nightwave Plaza',
    artist: 'Vaporwave Radio',
    url: 'https://radio.plaza.one/mp3',
  },
  {
    title: 'Lofi Study & Chill',
    artist: '0nlineRadio',
    url: 'https://0nlineradio.radioho.st/0r-lo-fi',
  },
  {
    title: 'Workday Lounge',
    artist: 'Epic Lounge',
    url: 'https://stream.epic-lounge.com/workday-lounge',
  },
  {
    title: 'Chillhop Beats',
    artist: 'B3cks Radio',
    url: 'https://radio.b3ck.com/listen/b3cks-radio/radio.mp3',
  }
];

export const useMusicStore = create(
  persist(
    (set) => ({
      currentTrackIndex: 0,
      isPlaying: false,
      volume: 0.1,
      progress: 0,
      duration: 0,
      
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (vol) => set({ volume: vol }),
      setProgress: (prog) => set({ progress: prog }),
      setDuration: (dur) => set({ duration: dur }),
      
      nextTrack: () => set((state) => ({
        currentTrackIndex: (state.currentTrackIndex + 1) % TRACKS.length,
        progress: 0,
        isPlaying: true
      })),
      
      prevTrack: () => set((state) => ({
        currentTrackIndex: (state.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length,
        progress: 0,
        isPlaying: true
      })),
      
      setTrack: (index) => set({ currentTrackIndex: index, progress: 0, isPlaying: true }),
    }),
    {
      name: 'music-player-storage',
      partialize: (state) => ({
        volume: state.volume,
        currentTrackIndex: state.currentTrackIndex,
      }),
    }
  )
);
