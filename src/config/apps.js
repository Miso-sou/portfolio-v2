import AboutApp from '../apps/AboutApp';
import ProjectsApp from '../apps/ProjectsApp';
import TechStacksApp from '../apps/TechStacksApp';
import ConnectApp from '../apps/ConnectApp';
import ActivityMapApp from '../apps/ActivityMapApp';
import WeatherApp from '../apps/WeatherApp';
import MusicPlayerApp from '../apps/MusicPlayerApp';
import ResumeApp from '../apps/ResumeApp';

// Import icon PNGs from assets so Vite hashes & bundles them
import notesIcon from '../assets/notes.png';
import programIcon from '../assets/program.png';
import techStackIcon from '../assets/tech stack.png';
import envelopeIcon from '../assets/envelope.png';
import calendarIcon from '../assets/calendar.png';
import vinylIcon from '../assets/vinyl player.gif';
import folderIcon from '../assets/folder.png';
import resumeIcon from '../assets/resume.png';

export const APPS = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: notesIcon,
    component: AboutApp,
    defaultSize: { width: 950, height: 580 },
    minSize: { width: 625, height: 240 },
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: programIcon,
    component: ProjectsApp,
    defaultSize: { width: 800, height: 520 },
    minSize: { width: 460, height: 320 },
  },
  techstacks: {
    id: 'techstacks',
    title: 'Tech Stacks',
    icon: techStackIcon,
    component: TechStacksApp,
    defaultSize: { width: 600, height: 500 },
    minSize: { width: 320, height: 280 },
  },
  connect: {
    id: 'connect',
    title: 'Connect',
    icon: envelopeIcon,
    component: ConnectApp,
    defaultSize: { width: 580, height: 420 },
    minSize: { width: 350, height: 320 },
  },
  activity: {
    id: 'activity',
    title: 'Activity',
    icon: calendarIcon,
    component: ActivityMapApp,
    defaultSize: { width: 800, height: 560 },
    minSize: { width: 625, height: 320 },
  },
  weather: {
    id: 'weather',
    title: 'Weather',
    icon: null, // Dynamic — handled by WeatherIcon component
    dynamicIcon: true,
    component: WeatherApp,
    defaultSize: { width: 523, height: 568 },
    minSize: { width: 400, height: 200 },
  },
  music: {
    id: 'music',
    title: 'Music Player',
    icon: vinylIcon,
    component: MusicPlayerApp,
    defaultSize: { width: 460, height: 600 },
    minSize: { width: 300, height: 420 },
  },
  resume: {
    id: 'resume',
    title: 'Resume',
    icon: resumeIcon,
    component: ResumeApp,
    defaultSize: { width: 600, height: 600 },
    minSize: { width: 400, height: 500 },
  },
};