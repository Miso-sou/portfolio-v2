const LINKS = [
  { label: 'GitHub', url: '#', icon: '◈' },
  { label: 'Twitter / X', url: '#', icon: '◆' },
  { label: 'LinkedIn', url: '#', icon: '◇' },
  { label: 'Email', url: '#', icon: '✉' },
  { label: 'Resume (PDF)', url: '#', icon: '▤' },
];

export default function LinksApp() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-sm">Links</h1>
      <div className="flex flex-col gap-1.5">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border-2 border-os-ink px-2 py-1.5 hover:bg-os-accent/30 transition-colors cursor-pointer no-underline text-os-ink"
          >
            <span className="text-lg leading-none">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
