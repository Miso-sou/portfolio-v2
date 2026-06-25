import { useWindowStore } from '../store/windowStore.js';
import { useProjectStore } from '../store/projectStore.js';
import { APPS } from '../config/apps.js';

const SKILLS = [
  {
    category: 'Languages',
    items: ['C', 'C++', 'C#', 'Java', 'JavaScript', 'HTML', 'CSS']
  },
  {
    category: 'Frontend',
    items: ['React', 'Tailwind CSS', 'Redux Toolkit', 'TanStack Query']
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js', 'REST APIs', 'Socket.io', 'JWT', 'Multer']
  },
  {
    category: 'Cloud & Infra',
    items: ['AWS Lambda', 'API Gateway', 'Cognito', 'Cloudinary', 'Render', 'Vercel']
  },
  {
    category: 'Databases',
    items: ['MongoDB', 'MySQL', 'DynamoDB', 'Upstash Redis']
  },
  {
    category: 'Tools',
    items: ['Git', 'GitHub', 'Jest', 'GitHub Actions', 'Unity', 'OpenXR', 'XR Interaction Toolkit', 'Postman']
  }
];

export default function TechStacksApp() {
  const { openWindow } = useWindowStore();
  const { setTechFilter } = useProjectStore();

  const handleTechClick = (tech) => {
    setTechFilter(tech);
    openWindow('projects', APPS.projects);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b-2 border-os-ink pb-2">
        <h2 className="font-display text-[16px] text-os-ink ml-1">Technical Skills</h2>
      </div>

      <div className="flex flex-col gap-4">
        {SKILLS.map((group) => (
          <div key={group.category} className="border-2 border-os-ink">
            <div className="bg-os-accent px-3 py-1.5 border-b-2 border-os-ink">
              <span className="font-display text-[12px] text-os-ink uppercase">// {group.category}</span>
            </div>
            <div className="px-3 py-3 flex flex-wrap gap-2">
              {group.items.map(tech => (
                <button
                  key={tech}
                  onClick={() => handleTechClick(tech)}
                  className="font-body text-os-ink border border-os-ink px-2 py-0.5 bg-os-window hover:bg-os-ink hover:text-os-accent transition-colors cursor-pointer text-left"
                  style={{ fontSize: '18px' }}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
