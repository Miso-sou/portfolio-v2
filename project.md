---

**Context:** React 19 + Vite + Tailwind CSS 4 portfolio OS. Design tokens: `--color-os-bg` (#96A5C7), `--color-os-window` (#D2D0E7), `--color-os-ink` (#3C5564), `--color-os-accent` (#F1DAEC). Fonts: `--font-display` (Press Start 2P), `--font-body` (VT323). Font smoothing is globally disabled. The window content area already provides `overflow-auto`, `retro-scrollbar`, and container-query font scaling.

**Task:** Create `apps/ProjectsApp.jsx` — a two-pane file explorer for portfolio projects.

---

**Data — hardcode at the top of the file:**

```js
const PROJECTS = [
  {
    id: 'splitsmart',
    name: 'SplitSmart',
    status: 'DEPLOYED',
    category: 'WEB',
    year: '2024',
    tagline: 'Real-time group expense splitter with AI receipt parsing and minimum cash flow settlement.',
    highlights: [
      'Socket.io real-time item claiming with OCC + jitter-based retry',
      'Gemini Vision receipt parsing pipeline',
      'Minimum cash flow debt settlement algorithm',
      'Compound MongoDB indexing with benchmarked query reduction',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Gemini API'],
    github: 'https://github.com/daivik05/SplitSmart',
    live: 'https://splitsmart.vercel.app',
  },
  {
    id: 'bookish',
    name: 'Bookish',
    status: 'DEPLOYED',
    category: 'WEB',
    year: '2024',
    tagline: 'Book discovery platform with Redis-cached recommendations and full CI/CD pipeline.',
    highlights: [
      '84.82% latency reduction via Redis cache-aside pattern',
      '48 Jest tests with GitHub Actions CI/CD pipeline',
      'Google Books API integration with smart deduplication',
    ],
    stack: ['React', 'Node.js', 'MongoDB', 'Redis', 'Jest', 'GitHub Actions'],
    github: 'https://github.com/daivik05/Bookish',
    live: null,
  },
  {
    id: '1map-nerd',
    name: '1MAP & NERD',
    status: 'RESEARCH',
    category: 'RESEARCH',
    year: '2025',
    tagline: 'VR remapping toolkit for unilateral motor impairment with EEG-based cognitive load evaluation.',
    highlights: [
      'Unity + Meta Quest 2 — 5 one-handed control modes',
      'NASA-TLX Raw 42.0 · SUS 65.8 across N=17 user study',
      'EEG-based cognitive load framework via NERD pipeline',
      'Submitted UIST 2026 · Preparing CHI 2027 resubmission',
    ],
    stack: ['Unity', 'C#', 'Meta Quest 2', 'EEG', 'Python'],
    github: 'https://github.com/daivik05/1MAP',
    live: null,
  },
  {
    id: 'powerpulse',
    name: 'PowerPulse',
    status: 'DEPLOYED',
    category: 'WEB',
    year: '2024',
    tagline: 'Fitness tracking platform with workout logging, progress analytics, and custom plan builder.',
    highlights: [
      'JWT auth with refresh token rotation',
      'Interactive progress charts with historical trends',
      'Custom workout plan builder with exercise library',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/daivik05/PowerPulse',
    live: null,
  },
];
```

---

**Overall structure:**

```jsx
<div className="flex h-full w-full overflow-hidden">
  {/* Left sidebar */}
  {/* Resize handle */}
  {/* Right preview pane */}
</div>
```

The window content area is already `overflow-auto` — set `overflow-hidden` on this root div and handle scrolling per-pane internally.

---

**Left sidebar — resizable:**

Sidebar width is controlled by a `useState` initialized to `180`. Min `120px`, max `260px`. The resize handle is a `4px` wide vertical strip between the two panes — `cursor-col-resize`, `bg-os-ink`, `hover:bg-os-accent`. Implement drag resizing with `onMouseDown` on the handle that attaches `mousemove` and `mouseup` listeners to `window`, calculates delta from `e.clientX`, clamps to `[120, 260]`, and updates the width state. Remove listeners on `mouseup`.

Sidebar layout:
```jsx
<div
  style={{ width: sidebarWidth, minWidth: 120, maxWidth: 260 }}
  className="flex flex-col h-full border-r-2 border-os-ink shrink-0 overflow-hidden"
>
  {/* Header */}
  <div className="px-2 py-1.5 border-b-2 border-os-ink bg-os-accent">
    <span className="font-display text-[7px] text-os-ink">PROJECTS</span>
  </div>

  {/* Filter toggles */}
  <div className="flex gap-1 px-2 py-1.5 border-b border-os-ink">
    {['ALL', 'WEB', 'RESEARCH'].map(cat => (
      <button
        key={cat}
        onClick={() => setFilter(cat)}
        className={`font-display text-[5px] px-1.5 py-0.5 border border-os-ink
          ${filter === cat ? 'bg-os-ink text-os-accent' : 'bg-os-window text-os-ink hover:bg-os-accent'}`}
      >
        {cat}
      </button>
    ))}
  </div>

  {/* Project list */}
  <div className="flex-1 overflow-y-auto retro-scrollbar">
    {filtered.map(project => (
      <button
        key={project.id}
        onClick={() => setSelected(project.id)}
        className={`w-full flex items-center gap-2 px-2 py-2 border-b border-os-ink text-left
          ${selected === project.id ? 'bg-os-accent' : 'hover:bg-os-window'}`}
      >
        {/* Diamond folder SVG icon */}
        <FolderDiamond isOpen={selected === project.id} />
        <span className="font-body text-os-ink truncate" style={{ fontSize: '17px' }}>
          {project.name}
        </span>
        <span className="font-display text-[5px] text-os-ink opacity-50 ml-auto shrink-0">
          {project.year}
        </span>
      </button>
    ))}
  </div>
</div>
```

`filter` state is `'ALL'` by default. `filtered` is `PROJECTS.filter(p => filter === 'ALL' || p.category === filter)`. `selected` state initializes to `PROJECTS[0].id`.

---

**`FolderDiamond` component — inline SVG, defined in the same file:**

A pixel-art diamond shape. Two states: closed (outline only) and open (filled with `os-accent`).

```jsx
function FolderDiamond({ isOpen }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ imageRendering: 'pixelated', flexShrink: 0 }}>
      <rect x="5" y="1" width="8" height="2" fill="#3C5564"/>
      <rect x="3" y="3" width="2" height="2" fill="#3C5564"/>
      <rect x="13" y="3" width="2" height="2" fill="#3C5564"/>
      <rect x="1" y="5" width="2" height="2" fill="#3C5564"/>
      <rect x="15" y="5" width="2" height="2" fill="#3C5564"/>
      <rect x="1" y="7" width="16" height="4" fill={isOpen ? '#F1DAEC' : 'none'} stroke="none"/>
      <rect x="1" y="5" width="16" height="8" fill={isOpen ? '#F1DAEC' : 'none'}/>
      <rect x="1" y="5" width="2" height="8" fill="#3C5564"/>
      <rect x="15" y="5" width="2" height="8" fill="#3C5564"/>
      <rect x="3" y="13" width="2" height="2" fill="#3C5564"/>
      <rect x="13" y="13" width="2" height="2" fill="#3C5564"/>
      <rect x="5" y="15" width="8" height="2" fill="#3C5564"/>
    </svg>
  );
}
```

---

**Right preview pane:**

```jsx
<div className="flex-1 overflow-y-auto retro-scrollbar p-4 flex flex-col gap-4 min-w-0">
  <ProjectPreview project={PROJECTS.find(p => p.id === selected)} />
</div>
```

---

**`ProjectPreview` component — defined in same file:**

Receives the selected `project` object. Layout is a series of retro bordered sections stacked vertically with consistent `border-2 border-os-ink` boxes:

**Block 1 — Title bar box:**
```jsx
<div className="border-2 border-os-ink">
  <div className="bg-os-ink px-3 py-1.5 flex items-center justify-between">
    <span className="font-display text-[9px] text-os-accent">{project.name}</span>
    <StatusBadge status={project.status} />
  </div>
  <div className="px-3 py-2 bg-os-window">
    <p className="font-body text-os-ink leading-snug" style={{ fontSize: '18px' }}>
      {project.tagline}
    </p>
  </div>
</div>
```

**Block 2 — Highlights box:**
```jsx
<div className="border-2 border-os-ink">
  <div className="bg-os-accent px-3 py-1 border-b-2 border-os-ink">
    <span className="font-display text-[7px] text-os-ink">// HIGHLIGHTS</span>
  </div>
  <div className="px-3 py-2 flex flex-col gap-1">
    {project.highlights.map((h, i) => (
      <div key={i} className="flex gap-2 items-start">
        <span className="font-display text-[7px] text-os-ink shrink-0 mt-0.5">▸</span>
        <span className="font-body text-os-ink leading-tight" style={{ fontSize: '17px' }}>{h}</span>
      </div>
    ))}
  </div>
</div>
```

**Block 3 — Stack box:**
```jsx
<div className="border-2 border-os-ink">
  <div className="bg-os-accent px-3 py-1 border-b-2 border-os-ink">
    <span className="font-display text-[7px] text-os-ink">// STACK</span>
  </div>
  <div className="px-3 py-2 flex flex-wrap gap-1.5">
    {project.stack.map(tech => (
      <span
        key={tech}
        className="font-body text-os-ink border border-os-ink px-2 py-0.5 bg-os-window"
        style={{ fontSize: '16px' }}
      >
        {tech}
      </span>
    ))}
  </div>
</div>
```

**Block 4 — Links strip:**
```jsx
<div className="flex gap-3 pt-1">
  
    href={project.github}
    target="_blank"
    rel="noopener noreferrer"
    className="font-display text-[7px] border-2 border-os-ink px-3 py-1.5 text-os-ink hover:bg-os-ink hover:text-os-accent transition-colors"
  >
    ▸ GITHUB
  </a>
  {project.live ? (
    
      href={project.live}
      target="_blank"
      rel="noopener noreferrer"
      className="font-display text-[7px] border-2 border-os-ink px-3 py-1.5 bg-os-accent text-os-ink hover:bg-os-ink hover:text-os-accent transition-colors"
    >
      ▸ LIVE DEMO
    </a>
  ) : (
    <span className="font-display text-[7px] border-2 border-os-ink px-3 py-1.5 text-os-ink opacity-40 cursor-not-allowed">
      NO LIVE DEMO
    </span>
  )}
</div>
```

---

**`StatusBadge` component — inline in same file:**

```jsx
function StatusBadge({ status }) {
  const styles = {
    DEPLOYED:  'bg-os-accent text-os-ink border-os-ink',
    RESEARCH:  'bg-os-window text-os-ink border-os-ink',
    WIP:       'bg-os-ink text-os-accent border-os-ink',
  };
  return (
    <span className={`font-display text-[5px] border px-1.5 py-0.5 ${styles[status] ?? styles.WIP}`}>
      {status}
    </span>
  );
}
```

---

**Update `config/apps.js`:**

```js
projects: {
  ...
  defaultSize: { width: 680, height: 480 },
  minSize:     { width: 460, height: 320 },
},
```

---

**Do not:**
- Add routing or multi-level folder drilling
- Add animations beyond `transition-colors` on buttons
- Add new npm packages
- Touch `Window.jsx`, stores, or `index.css`
- Make links open in the same tab — always `target="_blank"`