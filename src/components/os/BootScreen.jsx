import { useState, useEffect, useCallback, useRef } from 'react';
import './BootScreen.css';

/* ── Boot sequence script ── */
const BOOT_LINES = [
  { type: 'header', text: 'PIXEL OS --v2.0' },
  { type: 'sub', text: '(C) 2026 Portfolio Systems Inc.' },
  { type: 'blank' },
  { type: 'text', text: 'RUNNING SYSTEM DIAGNOSTICS...' },
  { type: 'blank' },
  { type: 'check', label: 'CPU', result: 'OK' },
  { type: 'check', label: 'MEMORY', result: '640K OK' },
  { type: 'check', label: 'DISPLAY', result: 'OK' },
  { type: 'check', label: 'GPU', result: 'PIXELATED' },
  { type: 'check', label: 'NETWORK', result: 'OK' },
  { type: 'check', label: 'AUDIO', result: 'OK' },
  { type: 'blank' },
  { type: 'text', text: 'LOADING ASSETS...' },
  { type: 'progress' },
  { type: 'blank' },
  { type: 'text', text: 'MOUNTING DESKTOP ENVIRONMENT...' },
  { type: 'check', label: 'WINDOW MANAGER', result: 'OK' },
  { type: 'check', label: 'ICON RENDERER', result: 'OK' },
  { type: 'check', label: 'WEATHER SERVICE', result: 'ONLINE' },
  { type: 'blank' },
  { type: 'welcome' },
];

const LINE_DELAY = 150; // ms between lines (slowed down)
const PROGRESS_DURATION = 1000; // ms for progress bar to fill (slowed down)
const FADE_DURATION = 800; // ms for fade-out

const SESSION_KEY = 'boot-screen-seen';

export default function BootScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('booting'); // 'booting' | 'waiting' | 'exit'
  const timerRef = useRef(null);
  const doneRef = useRef(false);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom as new lines appear
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [visibleLines, progress]);

  // Check if already booted this session
  const alreadySeen = useRef(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  const enterDesktop = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch { /* ignore */ }

    setPhase('exit');
    setTimeout(() => onComplete(), FADE_DURATION);
  }, [onComplete]);

  // Run boot sequence (no skip during boot)
  useEffect(() => {
    if (alreadySeen.current()) {
      onComplete();
      return;
    }

    let lineIndex = 0;

    const showNextLine = () => {
      if (doneRef.current) return;

      if (lineIndex >= BOOT_LINES.length) {
        // All lines shown — enter "waiting" phase
        setPhase('waiting');
        return;
      }

      const line = BOOT_LINES[lineIndex];
      lineIndex++;
      setVisibleLines(lineIndex);

      if (line.type === 'progress') {
        let p = 0;
        const steps = 25;
        const stepTime = PROGRESS_DURATION / steps;
        const progressInterval = setInterval(() => {
          if (doneRef.current) {
            clearInterval(progressInterval);
            return;
          }
          p += 100 / steps;
          setProgress(Math.min(100, Math.round(p)));
          if (p >= 100) {
            clearInterval(progressInterval);
            timerRef.current = setTimeout(showNextLine, LINE_DELAY);
          }
        }, stepTime);
      } else {
        timerRef.current = setTimeout(showNextLine, LINE_DELAY);
      }
    };

    // Initial delay before starting
    timerRef.current = setTimeout(showNextLine, 600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onComplete]);

  // Listen for key/click ONLY in the "waiting" phase
  useEffect(() => {
    if (phase !== 'waiting') return;

    const handle = () => enterDesktop();
    window.addEventListener('keydown', handle);
    window.addEventListener('click', handle);
    return () => {
      window.removeEventListener('keydown', handle);
      window.removeEventListener('click', handle);
    };
  }, [phase, enterDesktop]);

  // If already seen, render nothing
  if (alreadySeen.current()) return null;

  const renderLine = (line, i) => {
    switch (line.type) {
      case 'header':
        return (
          <div key={i} className="boot-line boot-header">
            {line.text}
          </div>
        );
      case 'sub':
        return (
          <div key={i} className="boot-line boot-subheader">
            {line.text}
          </div>
        );
      case 'blank':
        return <div key={i} className="boot-line">&nbsp;</div>;
      case 'text':
        return (
          <div key={i} className="boot-line">
            {line.text}
          </div>
        );
      case 'check': {
        const dots = '.'.repeat(Math.max(2, 20 - line.label.length));
        return (
          <div key={i} className="boot-line">
            {'> '}{line.label} <span className="boot-dots">{dots}</span>{' '}
            <span className="boot-ok">{line.result}</span>
          </div>
        );
      }
      case 'progress':
        return (
          <div key={i} className="boot-line">
            <div className="boot-progress-container">
              <div className="boot-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="boot-progress-text">{progress}% COMPLETE</div>
          </div>
        );
      case 'welcome':
        return (
          <div key={i} className="boot-line boot-welcome">
            {'>'} SYSTEM READY. WELCOME. <span className="boot-cursor" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`boot-screen ${phase === 'exit' ? 'boot-exit' : ''}`}>
      <div className="boot-terminal">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => renderLine(line, i))}
        <div ref={bottomRef} />
      </div>
      {phase === 'waiting' && (
        <div className="boot-skip">PRESS ANY KEY TO CONTINUE</div>
      )}
    </div>
  );
}
