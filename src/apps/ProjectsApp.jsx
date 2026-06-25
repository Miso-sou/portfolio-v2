import { useState, useCallback, useEffect } from 'react';
import openFolderIcon from '../assets/open folder.png';
import { useProjectStore } from '../store/projectStore';

const PROJECTS = [
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
      'Hardened API with role-based JWT refresh flow, sparse unique indexing for frictionless guest onboarding, and rate limiting.'
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
      'Added B-Tree indexing, field projections, and .lean() hydration bypass reducing CPU overhead by 35-50%.'
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
      'Developed as research artifacts 1MAP and NERD targeting UIST 2026.'
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
      'Integrated Hugging Face inference with fallback control.'
    ],
    stack: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'Cognito', 'Serverless'],
    github: 'https://github.com/Miso-sou/PowerPulse',
    live: null,
  },
];

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

function ProjectPreview({ project }) {
  if (!project) return null;
  return (
    <div className="flex-1 overflow-y-auto retro-scrollbar p-4 flex flex-col gap-4 min-w-0">
      <div className="border-2 border-os-ink">
        <div className="bg-os-ink px-3 py-1.5 flex items-center justify-between">
          <span className="font-display text-[9px] text-os-accent">{project.name}</span>
          <StatusBadge status={project.status} />
        </div>
        <div className="px-3 py-3 bg-os-window">
          <p className="font-body text-os-ink leading-snug" style={{ fontSize: '22px' }}>
            {project.tagline}
          </p>
        </div>
      </div>
      
      <div className="border-2 border-os-ink">
        <div className="bg-os-accent px-3 py-1.5 border-b-2 border-os-ink">
          <span className="font-display text-[7px] text-os-ink">// HIGHLIGHTS</span>
        </div>
        <div className="px-3 py-3 flex flex-col gap-2">
          {project.highlights.map((h, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="font-display text-[7px] text-os-ink shrink-0 mt-1.5">▸</span>
              <span className="font-body text-os-ink leading-tight" style={{ fontSize: '20px' }}>{h}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-2 border-os-ink">
        <div className="bg-os-accent px-3 py-1.5 border-b-2 border-os-ink">
          <span className="font-display text-[7px] text-os-ink">// STACK</span>
        </div>
        <div className="px-3 py-3 flex flex-wrap gap-2">
          {project.stack.map(tech => (
            <span
              key={tech}
              className="font-body text-os-ink border border-os-ink px-2 py-0.5 bg-os-window"
              style={{ fontSize: '18px' }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex gap-3 pt-1">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-[7px] border-2 border-os-ink px-3 py-2 text-os-ink hover:bg-os-ink hover:text-os-accent transition-colors"
        >
          ▸ GITHUB
        </a>
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[7px] border-2 border-os-ink px-3 py-2 bg-os-accent text-os-ink hover:bg-os-ink hover:text-os-accent transition-colors"
          >
            ▸ LIVE DEMO
          </a>
        ) : (
          <span className="font-display text-[7px] border-2 border-os-ink px-3 py-2 text-os-ink opacity-40 cursor-not-allowed">
            NO LIVE DEMO
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProjectsApp() {
  const [sidebarWidth, setSidebarWidth] = useState(180);
  const { techFilter, setTechFilter } = useProjectStore();
  
  const filteredProjects = techFilter
    ? PROJECTS.filter(p => p.stack.includes(techFilter))
    : PROJECTS;

  const [selected, setSelected] = useState(PROJECTS[0].id);

  useEffect(() => {
    if (filteredProjects.length > 0 && !filteredProjects.find(p => p.id === selected)) {
      setSelected(filteredProjects[0].id);
    }
  }, [techFilter, filteredProjects, selected]);
  
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.min(Math.max(startWidth + deltaX, 120), 260);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [sidebarWidth]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div
        style={{ width: sidebarWidth, minWidth: 120, maxWidth: 260 }}
        className="flex flex-col h-full border-r-2 border-os-ink shrink-0 overflow-hidden"
      >
        {techFilter && (
          <div className="bg-os-accent border-b-2 border-os-ink px-2 py-1.5 flex items-center justify-between shrink-0">
            <span className="font-display text-[7px] text-os-ink truncate mr-2 flex-1">
              FILTER: {techFilter}
            </span>
            <button 
              onClick={() => setTechFilter(null)}
              className="border border-os-ink font-display text-[5px] px-1 py-0.5 hover:bg-os-window transition-colors shrink-0 cursor-pointer"
            >
              CLEAR
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto retro-scrollbar">
          {filteredProjects.length === 0 ? (
            <div className="p-4 flex flex-col items-center justify-center h-full text-center gap-2">
              <span className="font-display text-[8px] text-os-ink opacity-70">NO MATCHES</span>
            </div>
          ) : (
            filteredProjects.map(project => (
              <button
                key={project.id}
                onClick={() => setSelected(project.id)}
                className={`w-full flex items-center gap-2 px-3 py-3 border-b border-os-ink text-left cursor-pointer
                  ${selected === project.id ? 'bg-os-accent' : 'hover:bg-os-bg'}`}
              >
                <img 
                  src={openFolderIcon} 
                  alt="Folder" 
                  className={`w-[18px] h-[18px] object-contain ${selected !== project.id ? 'opacity-50' : ''}`}
                  style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                />
                <span className="font-body text-os-ink truncate" style={{ fontSize: '18px' }}>
                  {project.name}
                </span>
                <span className="font-display text-[5px] text-os-ink opacity-50 ml-auto shrink-0 mt-0.5">
                  {project.year}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
      
      <div 
        className="w-[4px] cursor-col-resize bg-os-ink hover:bg-os-accent shrink-0"
        onMouseDown={handleMouseDown}
      />
      
      <ProjectPreview project={filteredProjects.find(p => p.id === selected)} />
    </div>
  );
}
