import AboutApp from '../apps/AboutApp';
import ProjectsApp from '../apps/ProjectsApp';
import LinksApp from '../apps/LinksApp';
import ActivityMapApp from '../apps/ActivityMapApp';

export const APPS = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: '/icons/about.png',
    component: AboutApp,
    defaultSize: { width: 420, height: 380 },
    minSize: { width: 300, height: 240 },
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: '/icons/projects.png',
    component: ProjectsApp,
    defaultSize: { width: 620, height: 460 },
    minSize: { width: 360, height: 280 },
  },
  links: {
    id: 'links',
    title: 'Links',
    icon: '/icons/links.png',
    component: LinksApp,
    defaultSize: { width: 320, height: 280 },
    minSize: { width: 260, height: 200 },
  },
  activity: {
    id: 'activity',
    title: 'Activity Map',
    icon: '/icons/activity.png',
    component: ActivityMapApp,
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 420, height: 320 },
  },
};