import { useCallback, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import vinylGif from '../assets/vinyl player.gif';
import { useMusicStore, TRACKS } from '../store/musicStore.js';

const PlayingIndicator = () => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '.' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  // Use a fixed width so it doesn't shift the title text
  return <span className="inline-block w-4 text-left font-display text-os-accent">{dots}</span>;
};

export default function MusicPlayerApp() {
  const currentTrackIndex = useMusicStore((s) => s.currentTrackIndex);
  const isPlaying = useMusicStore((s) => s.isPlaying);
  const volume = useMusicStore((s) => s.volume);

  const togglePlay = useMusicStore((s) => s.togglePlay);
  const nextTrack = useMusicStore((s) => s.nextTrack);
  const prevTrack = useMusicStore((s) => s.prevTrack);
  const setVolume = useMusicStore((s) => s.setVolume);
  const setTrack = useMusicStore((s) => s.setTrack);

  const track = TRACKS[currentTrackIndex];

  return (
    <div className="flex flex-col h-full bg-os-window">
      {/* Vinyl display */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="p-2 bg-os-accent/10 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]">
          <img
            src={vinylGif}
            alt="Vinyl player"
            className="w-24 h-24 opacity-95 drop-shadow-sm"
            draggable={false}
          />
        </div>
      </div>

      {/* Track info with animated dots */}
      <div className="text-center mt-1 px-4">
        <div className="font-display text-[12px] text-os-ink truncate flex items-center justify-center gap-1 leading-snug">
          {isPlaying && <PlayingIndicator />}
          {track.title}
        </div>
        <div className="text-[11px] font-body text-os-ink/60 truncate mt-0.5">{track.artist}</div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mt-3">
        <button
          onClick={prevTrack}
          className="p-1.5 text-os-ink/80 hover:text-os-accent hover:bg-os-ink/5 rounded-full transition-colors active:scale-95 cursor-pointer"
          title="Previous Station"
        >
          <SkipBack size={20} fill="currentColor" />
        </button>
        
        <button
          onClick={togglePlay}
          className="p-3 bg-os-accent text-os-bg hover:bg-os-ink hover:text-os-bg rounded-full transition-all active:scale-95 shadow-md shadow-os-accent/30 cursor-pointer flex items-center justify-center"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={22} fill="currentColor" />
          ) : (
            <Play size={22} fill="currentColor" className="ml-0.5" />
          )}
        </button>
        
        <button
          onClick={nextTrack}
          className="p-1.5 text-os-ink/80 hover:text-os-accent hover:bg-os-ink/5 rounded-full transition-colors active:scale-95 cursor-pointer"
          title="Next Station"
        >
          <SkipForward size={20} fill="currentColor" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 px-6 mt-3">
        <Volume2 size={14} className="text-os-ink/60" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 cursor-pointer custom-slider"
        />
        <span className="font-display text-[8px] text-os-ink/70 w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-auto retro-scrollbar border-t border-os-ink/10 pt-1.5 mt-3 bg-os-bg/40">
        <div className="font-display text-[9px] text-os-ink/50 mb-2 px-4 pt-2">RADIO STATIONS</div>
        
        {TRACKS.map((t, i) => (
          <div
            key={i}
            onClick={() => setTrack(i)}
            className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-all ${
              i === currentTrackIndex
                ? 'bg-os-accent/10 border-l-4 border-os-accent'
                : 'hover:bg-os-ink/5 border-l-4 border-transparent'
            }`}
          >
            <div className={`w-4 text-center ${i === currentTrackIndex ? 'text-os-accent' : 'text-os-ink/40'}`}>
              {i === currentTrackIndex && isPlaying ? (
                <div className="flex gap-[2px] justify-center h-3 items-end">
                  <div className="w-1 bg-os-accent animate-[bounce_1s_infinite_0ms]"></div>
                  <div className="w-1 bg-os-accent animate-[bounce_1s_infinite_200ms]"></div>
                  <div className="w-1 bg-os-accent animate-[bounce_1s_infinite_400ms]"></div>
                </div>
              ) : (
                <span className="font-display text-[9px]">{i + 1}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className={`font-body text-[15px] truncate leading-tight ${
                i === currentTrackIndex ? 'text-os-accent font-bold' : 'text-os-ink/90'
              }`}>
                {t.title}
              </div>
              <div className="font-display text-[7px] text-os-ink/50 truncate leading-tight mt-1">
                {t.artist}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom styles */}
      <style>{`
        /* Smooth, modern range slider */
        .custom-slider {
          -webkit-appearance: none;
          background: transparent;
          height: 16px;
        }
        .custom-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
        }
        :global(.dark) .custom-slider::-webkit-slider-runnable-track {
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: var(--color-os-accent);
          margin-top: -5px;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          transition: transform 0.1s;
        }
        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
}
