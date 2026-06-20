export default function AboutApp() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-sm">About Me</h1>
      <p>
        Hey there! I'm a developer who loves building things for the web.
        This pixel-art desktop is my little corner of the internet.
      </p>
      <p>
        I enjoy working with React, creative coding, and making interfaces
        that feel fun to use. When I'm not coding, you'll probably find me
        playing retro games or tinkering with new side projects.
      </p>
      <div className="border-2 border-os-ink p-2 bg-os-accent/30 mt-1">
        <p className="font-display text-[8px] mb-1">QUICK STATS</p>
        <ul className="list-none space-y-1">
          <li>☆ Frontend Developer</li>
          <li>☆ React / Next.js / Vite</li>
          <li>☆ Pixel art enthusiast</li>
          <li>☆ Open-source contributor</li>
        </ul>
      </div>
    </div>
  );
}
