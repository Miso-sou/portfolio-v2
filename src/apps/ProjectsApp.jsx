const PROJECTS = [
  { name: 'Pixel OS Portfolio', desc: 'This very site! A retro desktop OS built with React + Vite.', tag: 'React' },
  { name: 'Dungeon Mapper', desc: 'A procedural dungeon generator with pixel-art tiles.', tag: 'Canvas' },
  { name: 'Chiptune Player', desc: 'Web-based chiptune music player with waveform viz.', tag: 'Web Audio' },
  { name: 'Retro Chat', desc: 'Real-time chat app with a 90s AOL aesthetic.', tag: 'Socket.io' },
];

export default function ProjectsApp() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-sm">Projects</h1>
      <div className="flex flex-col gap-2">
        {PROJECTS.map((p) => (
          <div
            key={p.name}
            className="border-2 border-os-ink p-2 hover:bg-os-accent/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-display text-[8px]">{p.name}</span>
              <span className="font-display text-[6px] border border-os-ink px-1 py-0.5">
                {p.tag}
              </span>
            </div>
            <p className="text-sm leading-snug">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
