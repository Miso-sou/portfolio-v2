import { useState, useRef, useCallback, useEffect } from 'react';
import vinylGif from '../assets/vinyl player.gif';

/**
 * Lo-fi beats music player.
 * Uses native HTML5 Audio for maximum reliability (no YouTube iframe blocks).
 * Tracks are direct MP3 links (royalty-free for demo purposes).
 */

const TRACKS = [
  {
    title: 'Chill Bro',
    artist: 'Mixkit',
    url: 'https://assets.mixkit.co/music/preview/mixkit-chill-bro-89.mp3',
  },
  {
    title: 'Sleepy Cat',
    artist: 'Mixkit',
    url: 'https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3',
  },
  {
    title: 'Tech House Vibes',
    artist: 'Mixkit',
    url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
  },
  {
    title: 'Hip Hop 02',
    artist: 'Retro',
    url: 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3',
  },
  {
    title: 'Sun and His Daughter',
    artist: 'Mixkit',
    url: 'https://assets.mixkit.co/music/preview/mixkit-sun-and-his-daughter-580.mp3',
  },
];

export default function MusicPlayerApp() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);
  const track = TRACKS[currentTrack];

  // Initialize and handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Audio playback failed:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]); // Re-run when track changes to auto-play next

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrack((i) => (i + 1) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrack((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && duration > 0) {
      setProgress(audioRef.current.currentTime / duration);
    }
  }, [duration]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    nextTrack();
  }, [nextTrack]);

  const handleSeek = useCallback((e) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    const newTime = fraction * duration;
    audioRef.current.currentTime = newTime;
    setProgress(fraction);
  }, [duration]);

  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full gap-3 bg-os-window">
      {/* Native Audio Element */}
      <audio
        ref={audioRef}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => nextTrack()}
      />

      {/* Vinyl animation */}
      <div className="flex justify-center mt-2">
        <div
          className="border-2 border-os-ink p-1 bg-os-accent/20"
          style={{
            animation: isPlaying ? 'spin-vinyl 3s linear infinite' : 'none',
          }}
        >
          <img
            src={vinylGif}
            alt="Vinyl player"
            className="w-28 h-28"
            draggable={false}
          />
        </div>
      </div>

      {/* Track info */}
      <div className="text-center">
        <div className="font-display text-[12px] text-os-ink truncate">{track.title}</div>
        <div className="text-sm font-body text-os-ink/70 truncate">{track.artist}</div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 px-2">
        <span className="font-display text-[7px] text-os-ink w-8 text-right shrink-0">
          {formatTime(progress * duration)}
        </span>
        <div
          className="flex-1 h-3 border-2 border-os-ink bg-os-window cursor-pointer relative"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-os-accent pointer-events-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="font-display text-[7px] text-os-ink w-8 shrink-0">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prevTrack}
          className="w-8 h-8 border-2 border-os-ink font-display text-[10px] text-os-ink bg-os-window hover:bg-os-accent/30 active:shadow-retro-active shadow-retro-sm cursor-pointer"
          title="Previous"
        >
          ◀◀
        </button>
        <button
          onClick={togglePlay}
          className="w-12 h-12 border-2 border-os-ink font-display text-lg text-os-ink bg-os-accent hover:bg-os-accent/80 active:shadow-retro-active shadow-retro-sm cursor-pointer"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '▐▐' : '▶'}
        </button>
        <button
          onClick={nextTrack}
          className="w-8 h-8 border-2 border-os-ink font-display text-[10px] text-os-ink bg-os-window hover:bg-os-accent/30 active:shadow-retro-active shadow-retro-sm cursor-pointer"
          title="Next"
        >
          ▶▶
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 px-4 mt-1">
        <span className="font-display text-[7px] text-os-ink">VOL</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 cursor-pointer"
          style={{ height: '4px' }}
        />
        <span className="font-display text-[7px] text-os-ink w-6 text-right">
          {Math.round(volume * 100)}
        </span>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-auto retro-scrollbar border-t-2 border-os-ink pt-2 mt-2">
        <div className="font-display text-[8px] text-os-ink mb-1 px-2">PLAYLIST</div>
        {TRACKS.map((t, i) => (
          <div
            key={i}
            onClick={() => {
              setCurrentTrack(i);
              setProgress(0);
              setIsPlaying(true);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors ${
              i === currentTrack
                ? 'bg-os-accent/40 border-l-2 border-os-ink'
                : 'hover:bg-os-accent/20 border-l-2 border-transparent'
            }`}
          >
            <span className="font-display text-[8px] text-os-ink w-4 shrink-0 text-center">
              {i === currentTrack && isPlaying ? '♫' : `${i + 1}`}
            </span>
            <div className="min-w-0">
              <div className="font-body text-lg text-os-ink truncate leading-tight">{t.title}</div>
              <div className="font-display text-[6px] text-os-ink/60 truncate leading-tight">{t.artist}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS animation for vinyl spin */}
      <style>{`
        @keyframes spin-vinyl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Custom range slider styling for retro feel */
        input[type=range] {
          -webkit-appearance: none;
          background: var(--color-os-ink);
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 8px;
          height: 16px;
          background: var(--color-os-accent);
          border: 2px solid var(--color-os-ink);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
