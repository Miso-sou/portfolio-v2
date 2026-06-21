import { useState, useRef, useCallback, useEffect } from 'react';
import ReactPlayer from 'react-player';
import vinylGif from '../assets/vinyl player.gif';

/**
 * Lo-fi beats music player.
 * Uses react-player to stream audio from YouTube (no backend needed).
 * Each track is a direct YouTube video URL with lo-fi music.
 */

const TRACKS = [
  {
    title: 'Coffee Shop Vibes',
    artist: 'Lofi Girl',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  },
  {
    title: 'Chill Study Beats',
    artist: 'Chillhop Music',
    url: 'https://www.youtube.com/watch?v=5yx6BWlEVcY',
  },
  {
    title: 'Rainy Jazz Cafe',
    artist: 'Cafe Music BGM',
    url: 'https://www.youtube.com/watch?v=DSGyEsJ17cI',
  },
  {
    title: 'Midnight City Lofi',
    artist: 'The Jazz Hop Café',
    url: 'https://www.youtube.com/watch?v=kgx4WGK0oNU',
  },
  {
    title: 'Autumn Chill',
    artist: 'Lofi Records',
    url: 'https://www.youtube.com/watch?v=7NOSDKb0HlU',
  },
];

export default function MusicPlayerApp() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const playerRef = useRef(null);

  const track = TRACKS[currentTrack];

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrack((i) => (i + 1) % TRACKS.length);
    setProgress(0);
    setReady(false);
    setIsPlaying(true);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrack((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setReady(false);
    setIsPlaying(true);
  }, []);

  const handleProgress = useCallback((state) => {
    setProgress(state.played);
  }, []);

  const handleDuration = useCallback((d) => {
    setDuration(d);
  }, []);

  const handleEnded = useCallback(() => {
    nextTrack();
  }, [nextTrack]);

  const handleSeek = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    playerRef.current?.seekTo(fraction, 'fraction');
    setProgress(fraction);
  }, []);

  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Hidden YouTube player (audio only) */}
      <ReactPlayer
        ref={playerRef}
        url={track.url}
        playing={isPlaying}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded}
        onReady={() => setReady(true)}
        onError={() => nextTrack()}
        width="0"
        height="0"
        style={{ display: 'none' }}
        config={{
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
          },
        }}
      />

      {/* Vinyl animation */}
      <div className="flex justify-center">
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
        <div className="font-display text-[9px] truncate">{track.title}</div>
        <div className="text-sm text-os-ink/70 truncate">{track.artist}</div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 px-1">
        <span className="font-display text-[7px] w-10 text-right shrink-0">
          {formatTime(progress * duration)}
        </span>
        <div
          className="flex-1 h-3 border-2 border-os-ink bg-os-window cursor-pointer relative"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-os-accent transition-all duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="font-display text-[7px] w-10 shrink-0">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={prevTrack}
          className="w-8 h-8 border-2 border-os-ink font-display text-[10px] bg-os-window hover:bg-os-accent/30 active:shadow-retro-active shadow-retro-sm cursor-pointer"
          title="Previous"
        >
          ◀◀
        </button>
        <button
          onClick={togglePlay}
          className="w-10 h-10 border-2 border-os-ink font-display text-sm bg-os-accent hover:bg-os-accent/80 active:shadow-retro-active shadow-retro-sm cursor-pointer"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '▐▐' : '▶'}
        </button>
        <button
          onClick={nextTrack}
          className="w-8 h-8 border-2 border-os-ink font-display text-[10px] bg-os-window hover:bg-os-accent/30 active:shadow-retro-active shadow-retro-sm cursor-pointer"
          title="Next"
        >
          ▶▶
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 px-3">
        <span className="font-display text-[7px]">VOL</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 accent-os-ink cursor-pointer"
          style={{ height: '6px' }}
        />
        <span className="font-display text-[7px] w-6 text-right">
          {Math.round(volume * 100)}
        </span>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-auto retro-scrollbar border-t-2 border-os-ink pt-2">
        <div className="font-display text-[7px] mb-1 px-1">PLAYLIST</div>
        {TRACKS.map((t, i) => (
          <div
            key={i}
            onClick={() => {
              setCurrentTrack(i);
              setProgress(0);
              setReady(false);
              setIsPlaying(true);
            }}
            className={`flex items-center gap-2 px-2 py-1 cursor-pointer transition-colors ${
              i === currentTrack
                ? 'bg-os-accent/40 border-l-2 border-os-ink'
                : 'hover:bg-os-accent/20 border-l-2 border-transparent'
            }`}
          >
            <span className="font-display text-[7px] w-4 shrink-0 text-center">
              {i === currentTrack && isPlaying ? '♫' : `${i + 1}`}
            </span>
            <div className="min-w-0">
              <div className="text-sm truncate leading-tight">{t.title}</div>
              <div className="text-[11px] text-os-ink/60 truncate leading-tight">{t.artist}</div>
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
      `}</style>
    </div>
  );
}
