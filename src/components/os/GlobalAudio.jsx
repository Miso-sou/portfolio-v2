import { useEffect, useRef, useCallback } from 'react';
import { useMusicStore, TRACKS } from '../../store/musicStore';

export default function GlobalAudio() {
  const audioRef = useRef(null);
  
  const currentTrackIndex = useMusicStore((s) => s.currentTrackIndex);
  const isPlaying = useMusicStore((s) => s.isPlaying);
  const volume = useMusicStore((s) => s.volume);
  
  const setIsPlaying = useMusicStore((s) => s.setIsPlaying);
  const setProgress = useMusicStore((s) => s.setProgress);
  const setDuration = useMusicStore((s) => s.setDuration);
  const nextTrack = useMusicStore((s) => s.nextTrack);
  const duration = useMusicStore((s) => s.duration);
  
  const track = TRACKS[currentTrackIndex];

  // Expose the audio element to window for seeking from UI
  useEffect(() => {
    window.__globalAudioRef = audioRef.current;
    return () => {
      window.__globalAudioRef = null;
    };
  }, []);

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
  }, [isPlaying, currentTrackIndex, volume, setIsPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && duration > 0 && isFinite(duration)) {
      setProgress(audioRef.current.currentTime / duration);
    }
  }, [duration, setProgress]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, [setDuration]);

  const handleEnded = useCallback(() => {
    nextTrack();
  }, [nextTrack]);

  return (
    <audio
      ref={audioRef}
      src={track.url}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={handleEnded}
      onError={() => nextTrack()}
    />
  );
}
