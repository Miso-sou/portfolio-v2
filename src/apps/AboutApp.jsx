import profilePic from '../assets/me.png';  

const stack = [
  'React', 'Node.js', 'Express', 'MongoDB',
  'TypeScript', 'Tailwind CSS', 'Redis',
  'Socket.io', 'Unity', 'C#', 'Python',
  'Git', 'Docker',
];

const ASCII_NAME = `
██████╗  █████╗ ██╗██╗   ██╗██╗██╗  ██╗        ██╗    ██╗ █████╗ ██████╗ ██╗  ██╗██╗    ██╗ █████╗ ███╗   ██╗██╗
██╔══██╗██╔══██╗██║██║   ██║██║██║ ██╔╝        ██║    ██║██╔══██╗██╔══██╗██║  ██║██║    ██║██╔══██╗████╗  ██║██║
██║  ██║███████║██║██║   ██║██║█████╔╝         ██║ █╗ ██║███████║██║  ██║███████║██║ █╗ ██║███████║██╔██╗ ██║██║
██║  ██║██╔══██║██║╚██╗ ██╔╝██║██╔═██╗         ██║███╗██║██╔══██║██║  ██║██╔══██║██║███╗██║██╔══██║██║╚██╗██║██║
██████╔╝██║  ██║██║ ╚████╔╝ ██║██║  ██╗        ╚███╔███╔╝██║  ██║██████╔╝██║  ██║╚███╔███╔╝██║  ██║██║ ╚████║██║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝╚═╝  ╚═╝         ╚══╝╚══╝ ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝
`;

export default function AboutApp() {
  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Section 1 — Profile + ASCII name banner (horizontal) */}
      <div className="border-b-2 border-os-ink pb-3">
        <div className="flex gap-3 items-stretch">
          {/* Profile image */}
          <div className="shrink-0 w-[160px] border-[3px] border-os-ink overflow-hidden bg-os-accent shadow-[4px_4px_0px_var(--color-os-ink)]">
            <img
              src={profilePic}
              alt="Daivik Wadhwani"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* ASCII name + tagline */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <pre className="font-mono text-os-ink leading-[1.15] text-[10px] overflow-x-auto retro-scrollbar whitespace-pre select-all">
              {ASCII_NAME}
            </pre>
            <div className="bg-os-accent border-[2px] border-os-ink px-3 py-2 mt-2">
              <p className="font-body text-os-ink text-[16px]">
                Full-Stack Dev &nbsp;// &nbsp;XR Researcher
              </p>
              <p className="font-body text-os-ink text-[14px] mt-0.5 opacity-80">
                Specializing in the development of efficient &amp; secure backend infrastructure integrated with responsive &amp; user-centric frontend designs.
              </p>
              <p className="font-body text-os-ink text-[16px] mt-0.5">
                ▸ Open to SDE &amp; Full-Stack roles <span className="about-cursor" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 — Bio */}
      <div>
        <div className="border-l-[3px] border-os-ink pl-3 ml-1">
          <div className="font-body leading-relaxed text-os-ink space-y-3">
            <p>
              Hi! I'm a B.Tech CSE student at IIIT Sricity (2023–2027). This pixel-art desktop is my little corner on the internet.
            </p>
            <p>
              As a full-stack developer, I focus heavily on engineering efficient & scalable backend systems, but I also can pair them with intuitive and polished frontends. I usually build projects to solve real problems I've faced firsthand, always aiming to craft memorable user experiences that make them stick around.
            </p>
            <p>
              Beyond web development, I explore the intersection of people and technology. I serve as the XR Lead for the IOTA Club and actively contribute to our campus HCI Lab, where my work spans from Extended Reality to co-authoring a paper on multimodal accessibility interfaces.
            </p>
            <p>
              If you like my work and want to get in touch, feel free to reach out at <a href="https://mail.google.com/mail/?view=cm&amp;to=work.wadhwani@gmail.com" className="underline decoration-2 underline-offset-2 hover:bg-os-accent transition-colors" target="_blank" rel="noopener noreferrer">work.wadhwani@gmail.com</a>, or head over to my contact section ^_^
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
