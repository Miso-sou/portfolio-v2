import { useState, useEffect, useRef } from 'react';
import './GifClockWidget.css';

/**
 * GifClockWidget
 * 
 * Retro desktop widget showing:
 *  - Date (DD/M/YYYY) above
 *  - A looping video with vertical Japanese text on its left edge
 *  - A live clock (HH:MM:SS) below
 * 
 * Positioned on the right side of the desktop.
 */

const LETTER_SPACING = 4; // px – matches the inline letterSpacing
const MAX_FONT_SIZE = 22; // px – cap so short strings don't overflow

export default function GifClockWidget() {
  const [time, setTime] = useState(new Date());
  const [jpFontSize, setJpFontSize] = useState(14);
  const [videoH, setVideoH] = useState(230);
  const videoRef = useRef(null);

  // Japanese text that runs vertically alongside the video
  const japaneseText = 'にんたい。';

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Observe the video container's height and recalculate the JP text font size.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const recalc = () => {
      const containerH = el.offsetHeight;
      setVideoH(containerH);

      const charCount = [...japaneseText].length;
      if (charCount === 0) return;

      // totalHeight ≈ charCount * fontSize + (charCount - 1) * letterSpacing
      const size = (containerH - (charCount - 1) * LETTER_SPACING) / charCount;
      setJpFontSize(Math.max(8, Math.min(MAX_FONT_SIZE, Math.floor(size))));
    };

    recalc();

    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [japaneseText]);

  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <div className="gif-clock-widget" id="gif-clock-widget">
      {/* Date */}
      <p className="widget-date">{dateStr}</p>

      {/* Video area with vertical Japanese text */}
      <div className="widget-gif-row">
        {/* Vertical Japanese text – height locked to video, font-size dynamic */}
        <span
          className="widget-jp-text"
          aria-label="Japanese decorative text"
          style={{
            fontSize: `${jpFontSize}px`,
            letterSpacing: `${LETTER_SPACING}px`,
            height: `${videoH}px`,
          }}
        >
          {japaneseText}
        </span>

        {/* Video + clock column */}
        <div className="widget-gif-col">
          <div className="widget-gif-placeholder" ref={videoRef}>
            <video
              className="widget-video"
              src="/widget-clip.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          {/* Clock */}
          <p className="widget-time">{timeStr}</p>
        </div>
      </div>
    </div>
  );
}
