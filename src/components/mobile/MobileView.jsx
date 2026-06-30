import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Mail, Briefcase, Terminal, Code, MapPin, Clock } from 'lucide-react';
import profilePic from '../../assets/me.png';
import codechefLogo from '../../assets/platforms/codechef.svg';
import leetcodeLogo from '../../assets/platforms/LeetCode_logo_black.png';
import codeforcesLogo from '../../assets/platforms/codeforces.webp';

/* ════════════════════════════════════════════
   ASCII HEADER — compact "DAIVIK" for mobile
   ════════════════════════════════════════════ */

const ASCII_HEADER = `\
             ██████╗  █████╗ ██╗██╗   ██╗██╗██╗  ██╗
             ██╔══██╗██╔══██╗██║██║   ██║██║██║ ██╔╝
             ██║  ██║███████║██║██║   ██║██║█████╔╝ 
             ██║  ██║██╔══██║██║╚██╗ ██╔╝██║██╔═██╗ 
             ██████╔╝██║  ██║██║ ╚████╔╝ ██║██║  ██╗
             ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝╚═╝  ╚═╝
                                                                 
██╗    ██╗ █████╗ ██████╗ ██╗  ██╗██╗    ██╗ █████╗ ███╗   ██╗██╗
██║    ██║██╔══██╗██╔══██╗██║  ██║██║    ██║██╔══██╗████╗  ██║██║
██║ █╗ ██║███████║██║  ██║███████║██║ █╗ ██║███████║██╔██╗ ██║██║
██║███╗██║██╔══██║██║  ██║██╔══██║██║███╗██║██╔══██║██║╚██╗██║██║
╚███╔███╔╝██║  ██║██████╔╝██║  ██║╚███╔███╔╝██║  ██║██║ ╚████║██║
 ╚══╝╚══╝ ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝`;

/* ═══════════════════════════════════════
   DATA — same as desktop apps, inlined
   ═══════════════════════════════════════ */

const PROJECTS = [
  {
    id: 'portfolio-v2',
    name: 'Retro OS Portfolio',
    status: 'DEPLOYED',
    category: 'WEB',
    year: '2026',
    tagline: 'A fully interactive, window-based developer portfolio modeled after retro operating systems.',
    highlights: [
      'Engineered a robust window management system using Zustand for global state and react-rnd for draggable, resizable application windows.',
      'Implemented a persistent, global background audio engine that continues playing live radio streams across app lifecycles.',
      'Designed a cohesive pixel-art aesthetic with custom Tailwind CSS utility tokens, responsive grid layouts, and polished micro-animations.',
      'Developed multiple interconnected mini-apps including a GitHub/LeetCode Activity Map, Music Player, and dynamic Tech Stack viewer.',
    ],
    stack: ['React', 'Tailwind CSS', 'Zustand', 'Vite', 'Lucide React'],
    github: 'https://github.com/Miso-sou/portfolio-v2',
    live: 'https://daivik-wadhwani.vercel.app',
  },
  {
    id: 'splitsmart',
    name: 'SplitSmart',
    status: 'DEPLOYED',
    category: 'WEB',
    year: '2026',
    tagline: 'AI-powered group expense splitter with real-time cooperative bill claiming and OCR receipt parsing.',
    highlights: [
      'Engineered a 3-phase greedy minimum cash flow algorithm reducing N debts to at most N-1 transactions.',
      'Integrated Gemini 2.5-Flash via zero-disk in-memory pipeline for receipt OCR.',
      'Implemented OCC with jitter-based retry backoff to resolve simultaneous item-claim race conditions across Socket.io clients.',
      'Optimised query performance with compound MongoDB indexes across 4 models, cutting expense doc scans from 6,021 to 15 and raw DB time from 9ms to 1ms.',
      'Hardened API with role-based JWT refresh flow, sparse unique indexing for frictionless guest onboarding, and rate limiting.',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Gemini API', 'JWT'],
    github: 'https://github.com/Miso-sou/splitSmart',
    live: 'https://split-smart-one-psi.vercel.app',
  },
  {
    id: 'bookish',
    name: 'Bookish',
    status: 'DEPLOYED',
    category: 'WEB',
    year: '2026',
    tagline: 'Full-stack book marketplace connecting buyers, sellers, and admins with role-based dashboards.',
    highlights: [
      'Integrated Upstash Redis cache-aside layer across 11 critical endpoints achieving 84.82% average latency reduction — warm cache hits consistently under 30ms.',
      'Implemented CI/CD pipeline with GitHub Actions running 48 Jest tests across 12 suites on every push.',
      'Added B-Tree indexing, field projections, and .lean() hydration bypass reducing CPU overhead by 35-50%.',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux Toolkit', 'Stripe', 'Upstash Redis', 'Jest'],
    github: 'https://github.com/Ayush-aps/books_react',
    live: 'https://books-react-frontend.vercel.app',
  },
  {
    id: 'halfbeat',
    name: 'HalfBeat',
    status: 'RESEARCH',
    category: 'RESEARCH',
    year: '2026',
    tagline: 'Accessible VR rhythm game designed for players with motor disabilities and limb differences.',
    highlights: [
      'Designed from firsthand experience with motor disabilities. Engineered a one-handed VR accessibility system with position mirroring, freeze-offset, and saber-swap modes.',
      'Conducted user study with 17 participants; NASA-TLX Raw TLX of 42.0 (low-to-moderate workload) and SUS of 65.8 (marginal usability).',
      '12 of 13 long-session participants showed a negative learning slope, confirming motor adaptation.',
      'Developed as research artifacts 1MAP and NERD targeting UIST 2026.',
    ],
    stack: ['Unity', 'C#', 'XR Interaction Toolkit', 'OpenXR', 'EzySlice'],
    github: 'https://github.com/Miso-sou/HalfBeat',
    live: null,
  },
  {
    id: 'powerpulse',
    name: 'PowerPulse',
    status: 'WIP',
    category: 'WEB',
    year: '2025',
    tagline: 'Serverless energy analytics system with rule-based and AI-driven insights.',
    highlights: [
      'Architected a fully serverless backend on AWS Lambda, API Gateway, Cognito, and DynamoDB — eliminating idle infrastructure cost and enabling automatic scaling.',
      'Devised caching strategy that cut AI response time from 1800ms to 200ms (89% faster) and reduced API costs by 70%.',
      'Integrated Hugging Face inference with fallback control.',
    ],
    stack: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'Cognito', 'Serverless'],
    github: 'https://github.com/Miso-sou/PowerPulse',
    live: null,
  },
];

const SKILLS = [
  { category: 'Languages', items: ['C', 'C++', 'C#', 'Java', 'JavaScript', 'HTML', 'CSS'] },
  { category: 'Frontend', items: ['React', 'Tailwind CSS', 'Zustand', 'Redux Toolkit', 'TanStack Query'] },
  { category: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs', 'Socket.io', 'JWT', 'Multer'] },
  { category: 'Cloud & Infra', items: ['AWS Lambda', 'API Gateway', 'Cognito', 'Cloudinary', 'Render', 'Vercel'] },
  { category: 'Databases', items: ['MongoDB', 'MySQL', 'DynamoDB', 'Upstash Redis'] },
  { category: 'Tools', items: ['Git', 'GitHub', 'Vite', 'Jest', 'GitHub Actions', 'Unity', 'OpenXR', 'XR Interaction Toolkit', 'Postman'] },
];

const CONNECT_LINKS = [
  { label: 'Email', value: 'work.wadhwani@gmail.com', icon: Mail, href: 'https://mail.google.com/mail/?view=cm&fs=1&to=work.wadhwani@gmail.com' },
  { label: 'LinkedIn', value: 'LinkedIn Profile', icon: Briefcase, href: 'https://linkedin.com/in/daivik-wadhwani' },
  { label: 'GitHub', value: 'Miso-sou', icon: Terminal, href: 'https://github.com/Miso-sou' },
  { label: 'LeetCode', value: 'LeetCode Profile', icon: Code, href: 'https://leetcode.com/u/miso_so/' },
  { label: 'Location', value: 'Indore, India', icon: MapPin, href: null },
  { label: 'Timezone', value: 'IST (UTC+5:30)', icon: Clock, href: null },
];

/* ═══════════════════════════════
   HEATMAP UTILITIES
   ═══════════════════════════════ */

const LEVELS = [
  'bg-[#E0F4F4] border border-os-ink/30',
  'bg-[#80D4D4] border border-os-ink/30',
  'bg-[#20A0A8] border border-os-ink/30',
  'bg-[#0A5860] border border-os-ink/30',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateStr(date) {
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

function getLevel(total) {
  if (total === 0) return 0;
  if (total <= 2) return 1;
  if (total <= 5) return 2;
  return 3;
}

/* ═══════════════════════════════
   NAV CONFIG
   ═══════════════════════════════ */

const NAV_ITEMS = [
  { id: 'about', label: 'ABOUT' },
  { id: 'projects', label: 'WORK' },
  { id: 'techstack', label: 'STACK' },
  { id: 'connect', label: 'LINKS' },
  { id: 'activity', label: 'LOG' },
  { id: 'dsastats', label: 'DSA' },
];

/* ═══════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════ */

function RetroDivider() {
  return (
    <div className="flex items-center gap-3 px-6 py-6">
      <div className="flex-1 h-[2px] bg-os-ink/25" />
      <span className="font-display text-[7px] text-os-ink/40 tracking-widest select-none">
        ◆ ◇ ◆
      </span>
      <div className="flex-1 h-[2px] bg-os-ink/25" />
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="bg-os-accent border-2 border-os-ink px-4 py-2.5 mb-4 shadow-retro-sm">
      <h2 className="font-display text-[11px] text-os-ink tracking-wider">// {title}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    DEPLOYED: 'bg-os-accent text-os-ink border-os-ink',
    RESEARCH: 'bg-os-window text-os-ink border-os-ink',
    WIP: 'bg-os-ink text-os-accent border-os-ink',
  };
  return (
    <span className={`font-display text-[6px] border px-1.5 py-0.5 ${styles[status] ?? styles.WIP}`}>
      {status}
    </span>
  );
}

function PlatformCard({ title, logo, handle, badge, stats, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="block border-2 border-os-ink bg-os-window p-3 shadow-[4px_4px_0px_var(--color-os-ink)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[1px_1px_0px_var(--color-os-ink)] transition-all"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <img src={logo} alt={title} className="h-5 object-contain" />
          <span className="font-display text-[10px] tracking-widest text-os-ink">{title}</span>
        </div>
        {badge && badge !== 'N/A' && (
          <span className="text-[7px] font-display uppercase px-2 py-1 bg-os-ink text-os-bg shrink-0">
            {badge}
          </span>
        )}
      </div>
      <div className="font-body text-lg font-bold text-[#20A0A8]">@{handle}</div>
      <div className="flex justify-between mt-2 pt-2 border-t border-os-ink/20">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col">
            <span className="font-display text-[7px] uppercase tracking-widest opacity-70">{s.label}</span>
            <span className="font-body font-bold mt-1 text-os-ink">{s.value || 'N/A'}</span>
          </div>
        ))}
      </div>
    </a>
  );
}

function MobileNavbar({ activeSection, onNavigate }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-os-ink/95 backdrop-blur-sm border-t-2 border-os-accent"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex justify-around items-center px-1 py-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 px-2 py-1 transition-colors cursor-pointer min-w-0 ${
              activeSection === item.id ? 'text-os-accent' : 'text-os-bg/50'
            }`}
          >
            <span className="font-display text-[6px] tracking-wider">{item.label}</span>
            {activeSection === item.id && <div className="w-1 h-1 bg-os-accent" />}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ═══════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════ */

export default function MobileView() {
  const [activeSection, setActiveSection] = useState('about');
  const [activityData, setActivityData] = useState({});
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Section refs
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const techstackRef = useRef(null);
  const connectRef = useRef(null);
  const activityRef = useRef(null);
  const dsastatsRef = useRef(null);
  const heatmapScrollRef = useRef(null);

  const sectionRefs = useMemo(
    () => ({
      about: aboutRef,
      projects: projectsRef,
      techstack: techstackRef,
      connect: connectRef,
      activity: activityRef,
      dsastats: dsastatsRef,
    }),
    []
  );

  /* ── Fetch activity + platform data ── */
  useEffect(() => {
    Promise.all([
      fetch('/activity-data.json').then((r) => r.json()),
      fetch('/platform-stats.json')
        .then((r) => r.json())
        .catch(() => null),
    ])
      .then(([activity, stats]) => {
        setActivityData(activity);
        setPlatformStats(stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ── Auto-scroll heatmap to end (show latest day) ── */
  useEffect(() => {
    if (!loading && heatmapScrollRef.current) {
      requestAnimationFrame(() => {
        if (heatmapScrollRef.current) {
          heatmapScrollRef.current.scrollLeft = heatmapScrollRef.current.scrollWidth;
        }
      });
    }
  }, [loading, activityData]);

  /* ── Scroll spy via IntersectionObserver ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -65% 0px', threshold: 0 }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [sectionRefs]);

  /* ── Bottom-of-page detection for last section ── */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setActiveSection('dsastats');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Nav click handler ── */
  const scrollTo = useCallback(
    (sectionId) => {
      sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [sectionRefs]
  );

  /* ── Activity stats ── */
  const stats = useMemo(() => {
    let totalCommits = 0;
    let problemsSolved = 0;
    const allDates = Object.keys(activityData).sort();

    allDates.forEach((date) => {
      totalCommits += activityData[date].github || 0;
      problemsSolved += activityData[date].cp || 0;
    });

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    if (allDates.length > 0) {
      const firstDate = new Date(allDates[0]);
      const end = new Date();
      for (let d = new Date(firstDate); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDateStr(d);
        const dayTotal = (activityData[dateStr]?.github || 0) + (activityData[dateStr]?.cp || 0);
        if (dayTotal > 0) {
          tempStreak++;
          if (tempStreak > maxStreak) maxStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
      }

      let checkDate = new Date();
      const todayStr = formatDateStr(checkDate);
      const todayTotal = (activityData[todayStr]?.github || 0) + (activityData[todayStr]?.cp || 0);
      if (todayTotal === 0) checkDate.setDate(checkDate.getDate() - 1);

      let foundMiss = false;
      while (!foundMiss) {
        const dStr = formatDateStr(checkDate);
        const t = (activityData[dStr]?.github || 0) + (activityData[dStr]?.cp || 0);
        if (t > 0) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          foundMiss = true;
        }
      }
    }

    return { totalCommits, problemsSolved, currentStreak, maxStreak };
  }, [activityData]);

  /* ── Heatmap grid ── */
  const gridData = useMemo(() => {
    const today = new Date();
    const endDay = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 52 * 7 - endDay);

    const weeks = [];
    let currentWeek = [];
    const monthsPos = [];
    let lastMonth = -1;

    for (let i = 0; i <= 52 * 7 + endDay; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = formatDateStr(d);
      const dayData = activityData[dateStr] || { github: 0, cp: 0 };
      const total = dayData.github + dayData.cp;

      if (d.getDay() === 0 && d.getDate() <= 7 && d.getMonth() !== lastMonth) {
        monthsPos.push({ name: MONTHS[d.getMonth()], index: weeks.length });
        lastMonth = d.getMonth();
      }

      currentWeek.push({
        date: d,
        dateStr,
        github: dayData.github,
        cp: dayData.cp,
        total,
        level: getLevel(total),
        isFuture: d > today,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push({ isFuture: true });
      weeks.push(currentWeek);
    }

    return { weeks, monthsPos };
  }, [activityData]);

  /* ═══════════════════════
     RENDER
     ═══════════════════════ */

  return (
    <div className="min-h-screen bg-os-bg pb-20">
      {/* ── ASCII Header ── */}
      <div className="pt-8 pb-2 px-4">
        <div className="overflow-x-auto retro-scrollbar">
          <pre className="font-mono text-os-ink leading-[1.2] text-[7px] whitespace-pre mx-auto w-fit select-all">
            {ASCII_HEADER}
          </pre>
        </div>
        <div className="text-center mt-4">
          <p className="font-body text-os-ink text-[20px]">
            Full-Stack Dev &nbsp;// &nbsp;XR Researcher
          </p>
          <p className="font-body text-os-ink text-[16px] mt-1 opacity-70">
            B.Tech CSE @ IIIT Sricity (2023–2027)
          </p>
        </div>
      </div>

      {/* ── Resume Link ── */}
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="block mx-4 mt-3 border-2 border-os-ink bg-os-accent px-4 py-2.5 font-display text-[9px] text-os-ink text-center shadow-retro-sm active:shadow-retro-active active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        ▸ VIEW RESUME (PDF)
      </a>

      {/* ═══════════════════════
         ABOUT
         ═══════════════════════ */}
      <RetroDivider />
      <section id="about" ref={aboutRef} className="px-4 mobile-section">
        <SectionTitle title="ABOUT ME" />

        {/* Profile pic */}
        <div className="flex justify-center mb-4">
          <div className="w-[140px] h-[140px] border-[3px] border-os-ink overflow-hidden bg-os-accent shadow-retro">
            <img
              src={profilePic}
              alt="Daivik Wadhwani"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Tagline box */}
        <div className="bg-os-accent border-2 border-os-ink px-3 py-2 mb-4">
          <p className="font-body text-os-ink text-[16px]">
            Specializing in the development of efficient &amp; secure backend infrastructure
            integrated with responsive &amp; user-centric frontend designs.
          </p>
          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="font-body text-os-ink text-[16px]">
              ▸ Open to SDE &amp; Full-Stack roles <span className="about-cursor" />
            </p>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-os-ink bg-os-window px-2 py-1.5 font-display text-[7px] text-os-ink shadow-[2px_2px_0px_var(--color-os-ink)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--color-os-ink)] transition-all shrink-0 text-center"
            >
              RESUME
            </a>
          </div>
        </div>

        {/* Bio */}
        <div className="border-l-[3px] border-os-ink pl-3 ml-1">
          <div className="font-body leading-relaxed text-os-ink space-y-3 text-[16px]">
            <p>
              Hi! I'm a B.Tech CSE student at IIIT Sricity (2023–2027). This pixel-art desktop is my
              little corner on the internet.
            </p>
            <p>
              As a full-stack developer, I focus heavily on engineering efficient &amp; scalable
              backend systems, but I also can pair them with intuitive and polished frontends. I
              usually build projects to solve real problems I've faced firsthand, always aiming to
              craft memorable user experiences that make them stick around.
            </p>
            <p>
              Beyond web development, I explore the intersection of people and technology. I serve as
              the XR Lead for the IOTA Club and actively contribute to our campus HCI Lab, where my
              work spans from Extended Reality to co-authoring a paper on multimodal accessibility
              interfaces.
            </p>
            <p>
              If you like my work and want to get in touch, feel free to reach out at{' '}
              <a
                href="https://mail.google.com/mail/?view=cm&to=work.wadhwani@gmail.com"
                className="underline decoration-2 underline-offset-2 hover:bg-os-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                work.wadhwani@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════
         PROJECTS
         ═══════════════════════ */}
      <RetroDivider />
      <section id="projects" ref={projectsRef} className="px-4 mobile-section">
        <SectionTitle title="PROJECTS" />
        <div className="flex flex-col gap-5">
          {PROJECTS.map((project) => (
            <div key={project.id} className="border-2 border-os-ink shadow-retro-sm">
              {/* Title bar */}
              <div className="bg-os-ink px-3 py-2 flex items-center justify-between">
                <span className="font-display text-[11px] text-os-accent">{project.name}</span>
                <StatusBadge status={project.status} />
              </div>
              {/* Tagline */}
              <div className="px-3 py-2.5 bg-os-window border-b-2 border-os-ink">
                <p className="font-body text-os-ink leading-snug text-[17px]">{project.tagline}</p>
              </div>
              {/* Highlights */}
              <div className="px-3 py-2.5 border-b-2 border-os-ink">
                <div className="font-display text-[8px] text-os-ink opacity-60 mb-2">
                  // HIGHLIGHTS
                </div>
                <div className="flex flex-col gap-1.5">
                  {project.highlights.map((h, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="font-display text-[6px] text-os-ink shrink-0 mt-1.5">▸</span>
                      <span className="font-body text-os-ink leading-tight text-[15px]">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Stack */}
              <div className="px-3 py-2.5 border-b-2 border-os-ink bg-os-window">
                <div className="font-display text-[8px] text-os-ink opacity-60 mb-2">// STACK</div>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-body text-os-ink border border-os-ink px-2 py-0.5 bg-os-bg/30 text-[14px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              {/* Links */}
              <div className="px-3 py-2.5 flex gap-2 flex-wrap">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-[7px] border-2 border-os-ink px-3 py-1.5 text-os-ink active:bg-os-ink active:text-os-accent transition-colors"
                >
                  ▸ GITHUB
                </a>
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-[7px] border-2 border-os-ink px-3 py-1.5 bg-os-accent text-os-ink active:bg-os-ink active:text-os-accent transition-colors"
                  >
                    ▸ LIVE DEMO
                  </a>
                ) : (
                  <span className="font-display text-[7px] border-2 border-os-ink px-3 py-1.5 text-os-ink opacity-40">
                    NO LIVE DEMO
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════
         TECH STACK
         ═══════════════════════ */}
      <RetroDivider />
      <section id="techstack" ref={techstackRef} className="px-4 mobile-section">
        <SectionTitle title="TECH STACK" />
        <div className="flex flex-col gap-4">
          {SKILLS.map((group) => (
            <div key={group.category} className="border-2 border-os-ink">
              <div className="bg-os-accent px-3 py-1.5 border-b-2 border-os-ink">
                <span className="font-display text-[9px] text-os-ink uppercase">
                  // {group.category}
                </span>
              </div>
              <div className="px-3 py-2.5 flex flex-wrap gap-1.5">
                {group.items.map((tech) => (
                  <span
                    key={tech}
                    className="font-body text-os-ink border border-os-ink px-2 py-0.5 bg-os-window text-[15px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════
         CONNECT
         ═══════════════════════ */}
      <RetroDivider />
      <section id="connect" ref={connectRef} className="px-4 mobile-section">
        <SectionTitle title="CONNECT" />
        <p className="font-body text-os-ink opacity-80 mb-3 text-[16px]">
          Feel free to reach out for collaborations or just a quick chat!
        </p>
        <div className="flex flex-col gap-3">
          {CONNECT_LINKS.map((link, i) => {
            const IconComponent = link.icon;
            const content = (
              <div className="flex items-center gap-3 p-3 border-2 border-os-ink bg-os-window shadow-[3px_3px_0px_var(--color-os-ink)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[1px_1px_0px_var(--color-os-ink)] transition-all">
                <div className="bg-os-ink text-os-bg p-2 shrink-0">
                  <IconComponent size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display text-[8px] uppercase tracking-wider text-os-ink mb-0.5">
                    {link.label}
                  </span>
                  <span className="font-body text-[15px] text-os-ink truncate">{link.value}</span>
                </div>
              </div>
            );

            if (link.href) {
              return (
                <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="block">
                  {content}
                </a>
              );
            }
            return <div key={i}>{content}</div>;
          })}
        </div>
      </section>

      {/* ═══════════════════════
         ACTIVITY CALENDAR
         ═══════════════════════ */}
      <RetroDivider />
      <section id="activity" ref={activityRef} className="px-4 mobile-section">
        <SectionTitle title="ACTIVITY CALENDAR" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'Total Commits', value: stats.totalCommits },
            { label: 'Problems Solved', value: stats.problemsSolved },
            { label: 'Current Streak', value: `${stats.currentStreak} days`, highlight: true },
            { label: 'Max Streak', value: `${stats.maxStreak} days`, highlight: true },
          ].map((s) => (
            <div key={s.label} className="border-2 border-os-ink bg-os-window p-2.5 text-center">
              <div className="font-display text-[7px] uppercase tracking-widest text-os-ink opacity-70 mb-1">
                {s.label}
              </div>
              <div
                className={`font-body text-lg font-bold ${s.highlight ? 'text-[#20A0A8]' : 'text-os-ink'}`}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className="font-display text-[9px] animate-pulse text-os-ink">
              Loading data...
            </span>
          </div>
        ) : (
          <div className="border-2 border-os-ink bg-os-window p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-[13px] text-os-ink opacity-80">Last 12 Months</span>
              <div className="flex items-center gap-1">
                <span className="font-display text-[6px] opacity-70">Less</span>
                {LEVELS.map((cls, i) => (
                  <div key={i} className={`w-2.5 h-2.5 ${cls}`} />
                ))}
                <span className="font-display text-[6px] opacity-70">More</span>
              </div>
            </div>

            <div ref={heatmapScrollRef} className="overflow-x-auto retro-scrollbar pb-2">
              <div className="relative w-max mt-4">
                {/* Month labels */}
                <div className="flex absolute top-[-16px] left-[20px]">
                  {gridData.monthsPos.map((m, i) => (
                    <span
                      key={i}
                      className="font-display text-[6px] absolute opacity-70 text-os-ink"
                      style={{ left: m.index * 13 }}
                    >
                      {m.name}
                    </span>
                  ))}
                </div>

                <div className="flex gap-[2px]">
                  {/* Day labels */}
                  <div className="flex flex-col gap-[2px] mr-1">
                    {WEEK_DAYS.map((d, i) => (
                      <span
                        key={i}
                        className="font-display text-[5px] h-[10px] leading-[10px] opacity-60 text-os-ink"
                      >
                        {i % 2 !== 0 ? d : ''}
                      </span>
                    ))}
                  </div>

                  {/* Grid cells */}
                  {gridData.weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[2px]">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          className={`w-[10px] h-[10px] ${
                            day.isFuture ? 'bg-transparent' : LEVELS[day.level]
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-os-ink/20">
              <span className="font-body text-[12px] text-os-ink opacity-60">
                Combined GitHub commits + CP/DSA submissions. Scroll ← for older data.
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════
         DSA / CP STATS
         ═══════════════════════ */}
      <RetroDivider />
      <section id="dsastats" ref={dsastatsRef} className="px-4 mobile-section">
        <SectionTitle title="DSA / CP STATS" />
        {platformStats ? (
          <div className="flex flex-col gap-4">
            {platformStats.codeforces && (
              <PlatformCard
                title="Codeforces"
                logo={codeforcesLogo}
                handle={platformStats.codeforces.handle}
                badge={platformStats.codeforces.rank}
                link={`https://codeforces.com/profile/${platformStats.codeforces.handle}`}
                stats={[
                  { label: 'Rating', value: platformStats.codeforces.rating },
                  { label: 'Max Rating', value: platformStats.codeforces.maxRating },
                ]}
              />
            )}
            {platformStats.codechef && (
              <PlatformCard
                title="CodeChef"
                logo={codechefLogo}
                handle={platformStats.codechef.handle}
                badge={platformStats.codechef.stars}
                link={`https://www.codechef.com/users/${platformStats.codechef.handle}`}
                stats={[
                  { label: 'Rating', value: platformStats.codechef.rating },
                  { label: 'Max Rating', value: platformStats.codechef.maxRating },
                ]}
              />
            )}
            {platformStats.leetcode && (
              <PlatformCard
                title="LeetCode"
                logo={leetcodeLogo}
                handle={platformStats.leetcode.handle}
                badge={platformStats.leetcode.badge}
                link={`https://leetcode.com/u/${platformStats.leetcode.handle}`}
                stats={[
                  { label: 'Solved', value: platformStats.leetcode.solved },
                  { label: 'Rating', value: platformStats.leetcode.rating },
                ]}
              />
            )}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <span className="font-display text-[9px] animate-pulse text-os-ink">
              Loading stats...
            </span>
          </div>
        ) : (
          <p className="font-body text-os-ink opacity-60 text-[15px]">Stats unavailable.</p>
        )}
      </section>

    {/* ── Desktop Disclaimer ── */}
      <div className="mx-4 mt-3 border-2 border-os-ink bg-os-window p-3 shadow-retro-sm">
        <div className="flex items-start gap-2">
          <span className="text-[16px] shrink-0 mt-0.5">🖥️</span>
          <p className="font-body text-os-ink text-[15px] leading-snug">
            This portfolio is best experienced on a desktop monitor. Visit on a larger screen for the
            full interactive Pixel&nbsp;OS experience!
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-8 mb-4 px-4 text-center">
        <div className="border-t-2 border-os-ink/20 pt-4">
          <p className="font-display text-[7px] text-os-ink opacity-30 mt-1">
            My little corner on the Internet ^_^
          </p>
        </div>
      </div>

      {/* ── Bottom Navbar ── */}
      <MobileNavbar activeSection={activeSection} onNavigate={scrollTo} />
    </div>
  );
}
