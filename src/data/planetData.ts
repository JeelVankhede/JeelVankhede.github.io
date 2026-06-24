import { profile, projects as portfolioProjects, experience as portfolioExp } from './portfolio';

// ---------- Selection (panel) model ----------
export interface SkillContent {
  kind: 'skill';
  id: string;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
  accent: string;
}
export interface ExperienceContent {
  kind: 'experience';
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  accent: string;
}
export interface ProjectContent {
  kind: 'project';
  id: string;
  name: string;
  type: string;
  scope: string;
  impact: string;
  tags: string[];
  accent: string;
}
export interface IdentityContent {
  kind: 'identity';
  name: string;
  role: string;
  body: string;
  tags: string[];
  accent: string;
}
export interface ContactContent {
  kind: 'contact';
  email: string;
  links: { label: string; href: string }[];
  accent: string;
}
export interface StatContent {
  kind: 'stat';
  id: string;
  value: string;
  label: string;
  body: string;
  accent: string;
}
export type Selection =
  | SkillContent
  | ExperienceContent
  | ProjectContent
  | IdentityContent
  | ContactContent
  | StatContent;

// ---------- Islands (skill domains on land) ----------
export interface IslandDef {
  lat: number;
  lng: number;
  size: number; // base island radius (local units)
  seed: number; // shapes the irregular coastline
  land: string; // land clay color
  treeColor: string;
  treeCount: number;
  skill: SkillContent;
  building?: ExperienceContent; // optional office on this island
  chests?: SkillContent; // optional gold chests (data & storage) on this island
}

export const islands: IslandDef[] = [
  {
    lat: 35,
    lng: 45,
    size: 0.54,
    seed: 12,
    land: '#86c98a',
    treeColor: '#8fd0ff',
    treeCount: 9,
    skill: {
      kind: 'skill',
      id: 'frontend',
      title: 'Frontend',
      subtitle: 'Interfaces & experience',
      body: 'Production web apps with a strong type-safe core and offline-capable UX.',
      tags: ['React.js', 'Next.js', 'TypeScript', 'Angular', 'Redux', 'NgRx', 'Canvas APIs', 'PWA'],
      accent: '#8fd0ff',
    },
    building: {
      kind: 'experience',
      id: 'arinspect',
      company: portfolioExp[1].company,
      role: portfolioExp[1].role,
      period: portfolioExp[1].period,
      location: portfolioExp[1].location,
      bullets: portfolioExp[1].bullets,
      accent: '#ffd27a',
    },
  },
  {
    lat: -35,
    lng: -45,
    size: 0.62,
    seed: 27,
    land: '#9ad98a',
    treeColor: '#b6a8ff',
    treeCount: 12,
    skill: {
      kind: 'skill',
      id: 'backend',
      title: 'Backend',
      subtitle: 'Services & APIs',
      body: 'Service layers, APIs and event-driven jobs that scale with the product.',
      tags: ['Node.js', 'NestJS', 'Express.js', 'REST APIs', 'GraphQL', 'Event-driven jobs', 'API design'],
      accent: '#b6a8ff',
    },
    chests: {
      kind: 'skill',
      id: 'data',
      title: 'Data & Storage',
      subtitle: 'Datastores & persistence',
      body: 'Choosing the right datastore per job — relational, document and on-device — with offline-first sync.',
      tags: ['PostgreSQL', 'MongoDB', 'Oracle', 'SQLite', 'Room', 'IndexedDB', 'Offline sync'],
      accent: '#ffcf5a',
    },
  },
  {
    lat: 35,
    lng: -135,
    size: 0.54,
    seed: 41,
    land: '#8fcf86',
    treeColor: '#ffc98f',
    treeCount: 9,
    skill: {
      kind: 'skill',
      id: 'mobile',
      title: 'Mobile',
      subtitle: 'Native & cross-platform',
      body: 'From Android-native roots to cross-platform delivery, with offline-first reliability.',
      tags: ['React Native', 'Android', 'Kotlin', 'Java', 'Jetpack Compose', 'WorkManager', 'Koin'],
      accent: '#ffc98f',
    },
    building: {
      kind: 'experience',
      id: 'earlier',
      company: portfolioExp[2].company,
      role: portfolioExp[2].role,
      period: portfolioExp[2].period,
      location: portfolioExp[2].location,
      bullets: portfolioExp[2].bullets,
      accent: '#ffd27a',
    },
  },
  {
    lat: -35,
    lng: 135,
    size: 0.56,
    seed: 33,
    land: '#92d08a',
    treeColor: '#f4a8ff',
    treeCount: 12,
    skill: {
      kind: 'skill',
      id: 'ai',
      title: 'AI / Dev Productivity',
      subtitle: 'Structured AI workflows',
      body: 'Turning AI usage into a real engineering workflow — published npm CLI tooling for agent rules and project standards.',
      tags: ['Claude Code', 'AI-assisted workflows', 'Agent rules', 'Prompt engineering', 'Cursor', 'ChatGPT', 'CLI tooling'],
      accent: '#f4a8ff',
    },
    building: {
      kind: 'experience',
      id: 'rikoouu',
      company: portfolioExp[0].company,
      role: portfolioExp[0].role,
      period: portfolioExp[0].period,
      location: portfolioExp[0].location,
      bullets: portfolioExp[0].bullets,
      accent: '#ffd27a',
    },
  },
];

// ---------- Orbiting satellites ----------
export interface OrbitDef {
  radius: number;
  speed: number; // radians/sec
  phase: number; // starting angle
  inclination: number; // tilt of orbit plane about X (radians)
  node?: number; // rotation of the orbit plane about Y (distinct planes)
}

export interface SatelliteDef {
  id: string;
  color: string;
  orbit: OrbitDef;
  content: ProjectContent | IdentityContent;
}

const PROJECT_ACCENTS = ['#7be0b0', '#8fd0ff', '#ffc98f', '#f4a8ff'];

export const identitySatellite: SatelliteDef = {
  id: 'identity',
  color: '#ffffff',
  orbit: { radius: 1.95, speed: 0.12, phase: 0.6, inclination: 0.5, node: 2.2 },
  content: {
    kind: 'identity',
    name: profile.name,
    role: profile.role,
    body: 'Engineer who still ships hands-on while leading teams — across web, mobile, backend and AI workflows. Led a 10-engineer mixed team and reached 1.1M+ people through public work.',
    tags: ['Tech Leadership', 'Architecture', 'Delivery Planning', 'Code Reviews'],
    accent: '#ffffff',
  },
};

export const projectSatellites: SatelliteDef[] = portfolioProjects.map((p, i) => ({
  id: `project-${i}`,
  color: PROJECT_ACCENTS[i % PROJECT_ACCENTS.length],
  orbit: {
    radius: 2.2 + (i % 3) * 0.32,
    speed: (0.16 - i * 0.02) * (i % 2 === 0 ? 1 : -1), // alternate direction too
    phase: (i / portfolioProjects.length) * Math.PI * 2,
    inclination: -0.5 + i * 0.42, // distinct tilts
    node: 0.5 + i * 1.7, // distinct orbital planes
  },
  content: {
    kind: 'project',
    id: `project-${i}`,
    name: p.name,
    type: p.type,
    scope: p.scope,
    impact: p.impact,
    tags: p.tags,
    accent: PROJECT_ACCENTS[i % PROJECT_ACCENTS.length],
  },
}));

// ---------- Stat asteroids (orbiting belt, click like a tree) ----------
export interface AsteroidDef {
  id: string;
  seed: number;
  rock: string;
  orbit: OrbitDef;
  content: StatContent;
}

const STAT_RING_RADIUS = 1.75;
const STAT_RING_INCL = 1.1;

// Curated stats; the three Stack Overflow metrics are consolidated into one.
const STATS: { value: string; label: string; body: string }[] = [
  {
    value: '9+',
    label: 'Years experience',
    body: 'Nine-plus years shipping across web, mobile, backend and AI tooling.',
  },
  {
    value: '10',
    label: 'Engineers led',
    body: 'Led a cross-functional team of 10 spanning web, mobile, backend and admin tooling.',
  },
  {
    value: '12k+',
    label: 'Stack Overflow',
    body: '12k+ reputation, 288 answers and 1.1M+ people reached across Android, Kotlin, architecture and Java topics.',
  },
  {
    value: '2',
    label: 'npm packages',
    body: 'Published frontend- and backend-ai-starter-recipes CLI tooling.',
  },
];

export const statAsteroids: AsteroidDef[] = STATS.map((s, i) => ({
  id: `stat-${i}`,
  seed: 100 + i * 13,
  rock: ['#b9a98f', '#a9a0bf', '#9fb0a0', '#bfa9a0'][i % 4],
  orbit: {
    radius: STAT_RING_RADIUS + (i % 2) * 0.18,
    speed: (0.06 + i * 0.012) * (i % 2 === 0 ? 1 : -1),
    phase: (i / STATS.length) * Math.PI * 2,
    inclination: STAT_RING_INCL - 0.4 + i * 0.32, // distinct tilts
    node: i * 1.25, // distinct planes
  },
  content: {
    kind: 'stat',
    id: `stat-${i}`,
    value: s.value,
    label: s.label,
    body: s.body,
    accent: '#ffd9a0',
  },
}));

// ---------- Contact beacon (landmark) ----------
export const contactBeacon = {
  lat: 68,
  lng: 165,
  content: {
    kind: 'contact' as const,
    email: profile.email,
    links: [
      { label: 'GitHub', href: profile.links.github },
      { label: 'LinkedIn', href: profile.links.linkedin },
      { label: 'Stack Overflow', href: profile.links.stackOverflow },
    ],
    accent: '#ff9fb0',
  } satisfies ContactContent,
};

// ---------- Link rockets (external) ----------
export interface Rocket {
  id: string;
  lat: number;
  lng: number;
  bodyColor: string;
  finColor: string;
  label: string;
  href: string;
  external: boolean;
}

export const rockets: Rocket[] = [
  { id: 'github', lat: 70, lng: 20, bodyColor: '#f5f0ff', finColor: '#b6a8ff', label: 'GitHub', href: profile.links.github, external: true },
  { id: 'linkedin', lat: -58, lng: -55, bodyColor: '#f5f0ff', finColor: '#8fd0ff', label: 'LinkedIn', href: profile.links.linkedin, external: true },
  { id: 'stackoverflow', lat: -18, lng: 175, bodyColor: '#f5f0ff', finColor: '#ffc98f', label: 'Stack Overflow', href: profile.links.stackOverflow, external: true },
  { id: 'resume', lat: 38, lng: 150, bodyColor: '#f5f0ff', finColor: '#7be0b0', label: 'Résumé', href: profile.resumeUrl, external: false },
  { id: 'blog', lat: -42, lng: 12, bodyColor: '#f5f0ff', finColor: '#ff9fb0', label: 'Blog', href: 'https://jeelvankhede.hashnode.dev/', external: true },
];

// ---------- Clouds = Cloud & DevOps (interactive) ----------
export const cloudSkill: SkillContent = {
  kind: 'skill',
  id: 'cloud',
  title: 'Cloud & DevOps',
  subtitle: 'Infra, CI/CD & delivery',
  body: 'Shipping on AWS and GCP with containers, queues and automated pipelines.',
  tags: ['AWS', 'GCP', 'Firebase', 'Docker', 'GitHub Actions', 'Jenkins', 'AWS SQS', 'AWS Lambda'],
  accent: '#bfe0ff',
};

export interface CloudPuff {
  lat: number;
  lng: number;
  altitude: number;
  scale: number;
}
export const cloudPuffs: CloudPuff[] = [
  { lat: 35, lng: 30, altitude: 0.5, scale: 0.9 },
  { lat: -25, lng: -25, altitude: 0.45, scale: 0.75 },
  { lat: 55, lng: 150, altitude: 0.55, scale: 1.0 },
  { lat: -48, lng: -120, altitude: 0.45, scale: 0.8 },
  { lat: 8, lng: -175, altitude: 0.52, scale: 0.7 },
  { lat: 50, lng: 80, altitude: 0.5, scale: 0.95 },
];
