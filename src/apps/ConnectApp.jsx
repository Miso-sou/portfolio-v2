import { Mail, Briefcase, Terminal, Code, MapPin, Clock } from 'lucide-react';

export default function ConnectApp() {
  const links = [
    { 
      label: 'Email', 
      value: 'work.wadhwani@gmail.com', 
      icon: Mail, 
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=work.wadhwani@gmail.com' 
    },
    { 
      label: 'LinkedIn', 
      value: 'LinkedIn Profile', 
      icon: Briefcase, 
      href: 'https://linkedin.com/in/daivik-wadhwani' 
    },
    { 
      label: 'GitHub', 
      value: 'Miso-sou', 
      icon: Terminal, 
      href: 'https://github.com/Miso-sou' 
    },
    { 
      label: 'LeetCode', 
      value: 'LeetCode Profile', 
      icon: Code, 
      href: 'https://leetcode.com/u/miso_so/' 
    },
    { 
      label: 'Location', 
      value: 'Indore, India', 
      icon: MapPin, 
      href: null 
    },
    { 
      label: 'Timezone', 
      value: 'IST (UTC+5:30)', 
      icon: Clock, 
      href: null 
    },
  ];

  return (
    <div className="flex flex-col gap-4 h-full p-1">
      <div className="border-b-[3px] border-os-ink pb-3 mb-2 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl text-os-ink tracking-wide">Let's Connect</h1>
          <p className="font-body text-os-ink opacity-80 mt-1 text-sm">
            Feel free to reach out for collaborations or just a quick chat!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link, i) => {
          const content = (
            <div className="flex items-center gap-3 p-3 border-[2px] border-os-ink bg-os-window shadow-[3px_3px_0px_var(--color-os-ink)] hover:bg-os-accent hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[1px_1px_0px_var(--color-os-ink)] transition-all cursor-pointer h-full">
              <div className="bg-os-ink text-os-bg p-2 shrink-0 border-2 border-os-ink">
                <link.icon size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display text-[9px] uppercase tracking-wider text-os-ink mb-0.5">{link.label}</span>
                <span className="font-body text-[15px] font-medium text-os-ink truncate">{link.value}</span>
              </div>
            </div>
          );

          if (link.href) {
            return (
              <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="block outline-none h-full">
                {content}
              </a>
            );
          }
          
          return <div key={i} className="h-full">{content}</div>;
        })}
      </div>
    </div>
  );
}
