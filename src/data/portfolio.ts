export const profile = {
  name: 'Jeel Vankhede',
  initials: 'JV',
  role: 'Lead Full Stack Engineer',
  location: 'Ahmedabad, Gujarat, India',
  email: 'jeelvankhede@gmail.com',
  phone: '+91 7874442754',
  resumeUrl: 'https://flowcv.me/jeelvankhede',
  links: {
    github: 'https://github.com/JeelVankhede',
    linkedin: 'https://www.linkedin.com/in/jeel-vankhede-b42887165',
    stackOverflow: 'https://stackoverflow.com/users/10271334/jeel-vankhede',
  },
};

export const navItems = ['Work', 'Credibility', 'Skills', 'Experience', 'Contact'];

export const metrics = [
  { value: '9+', label: 'Years engineering experience' },
  { value: '10', label: 'Engineers led in a mixed team' },
  { value: '12k+', label: 'Stack Overflow reputation' },
  { value: '1.1M+', label: 'People reached' },
  { value: '288', label: 'Stack Overflow answers' },
  { value: '2', label: 'Published npm packages' },
];

export const credibility = [
  {
    title: 'Stack Overflow footprint',
    value: '12k+ reputation, 1.1M+ people reached, 288 answers',
    description: 'Public proof across Android, Kotlin, architecture, Java, LiveData, and ViewModel topics.',
    href: profile.links.stackOverflow,
  },
  {
    title: 'Published AI workflow packages',
    value: 'frontend-ai-starter-recipes and backend-ai-starter-recipes',
    description: 'npm-published CLI tooling for structured AI-assisted frontend/backend development workflows.',
    href: 'https://www.npmjs.com/~jeelvankhede',
  },
  {
    title: 'GitHub engineering portfolio',
    value: 'AI tooling, Android architecture, Kotlin/Java utilities, TypeScript CLI work',
    description: 'Public project footprint that supports the resume instead of simply repeating it.',
    href: profile.links.github,
  },
];

export const projects = [
  {
    name: 'AI Starter Recipes — Frontend & Backend',
    type: 'Published npm packages · TypeScript · CLI tooling',
    problem: 'Most AI-assisted coding setups start with vague prompts and inconsistent project-level rules.',
    role: 'Creator and maintainer of published frontend/backend npm CLI packages.',
    scope: 'Generates AI agent rules, workflows, project standards, context, tracking, and IDE adapters for frontend/backend teams.',
    impact: 'Turns AI usage into a structured engineering workflow instead of ad-hoc assistant prompting.',
    tags: ['TypeScript', 'CLI', 'AI workflows', 'Developer productivity'],
    links: [
      { label: 'Frontend repo', href: 'https://github.com/JeelVankhede/frontend-ai-starter-recipes' },
      { label: 'Backend repo', href: 'https://github.com/JeelVankhede/backend-ai-starter-recipes' },
      { label: 'Frontend npm', href: 'https://www.npmjs.com/package/frontend-ai-starter-recipes' },
      { label: 'Backend npm', href: 'https://www.npmjs.com/package/backend-ai-starter-recipes' },
    ],
  },
  {
    name: 'ARInspect / Compliance Management Platform',
    type: 'Angular · Android · Node.js/Express · Offline-first',
    problem: 'Paper-based inspection workflows were slow, fragile, and unreliable for inspectors working in remote areas.',
    role: 'Led a 10-engineer mixed team across web, mobile, backend, admin tooling, and delivery execution.',
    scope: 'Offline sync, compliance tooling, backend APIs, web modules, canvas annotations, PDF generation, local storage, and route optimization.',
    impact: 'Delivered a large spin-off module estimated at 9 months within 6 months; client-reported efficiency improvement reached up to 300%.',
    tags: ['Offline-first', 'Compliance', 'Angular', 'Android', 'Node.js'],
    links: [],
  },
  {
    name: 'YieldClub / DeFi P2P Lending App',
    type: 'React Native · NestJS · AWS · GitHub Actions',
    problem: 'Crypto lending workflows needed reliable mobile-first user journeys, wallet flows, and backend jobs.',
    role: 'Led an 8-engineer team as project manager and IC across mobile and backend modules.',
    scope: 'React Native app flows, NestJS backend modules, wallet onramp/offramp refactors, Expo CI/CD, AWS SQS/Lambda jobs.',
    impact: 'Helped scale the product from 0 to 5k active users while improving maintainability around wallet flows and builds.',
    tags: ['React Native', 'NestJS', 'AWS', 'DeFi'],
    links: [],
  },
  {
    name: 'Gaimplan',
    type: 'AI lifestyle management · React Native · NestJS · GCP',
    problem: 'Calendar-heavy lifestyle apps need reliable sync, suggestions, conflict handling, and fast event loading.',
    role: 'Led a 6-engineer team while contributing as backend IC and project manager.',
    scope: 'NestJS APIs, GCP-heavy infrastructure, pub/sub and cron-based sync services, architecture and code reviews.',
    impact: 'Improved calendar event loading, data reliability, sync behavior, delivery planning, and implementation flow.',
    tags: ['GCP', 'NestJS', 'Calendar sync', 'AI product'],
    links: [],
  },
];

export const skills = [
  { title: 'Frontend', items: ['React.js', 'Next.js', 'TypeScript', 'Angular', 'Redux', 'NgRx', 'Canvas APIs', 'PWA'] },
  { title: 'Backend', items: ['Node.js', 'NestJS', 'Express.js', 'REST APIs', 'GraphQL', 'Event-driven jobs', 'API design'] },
  { title: 'Mobile', items: ['React Native', 'Android', 'Kotlin', 'Java', 'Jetpack Compose', 'WorkManager', 'Koin'] },
  { title: 'Cloud & DevOps', items: ['AWS', 'AWS SQS', 'AWS Lambda', 'GCP', 'Firebase', 'Docker', 'Jenkins', 'GitHub Actions'] },
  { title: 'Data & Storage', items: ['PostgreSQL', 'Oracle', 'MongoDB', 'SQLite', 'Room', 'IndexedDB', 'Offline sync'] },
  { title: 'AI / Dev Productivity', items: ['AI-assisted workflows', 'Agent rules', 'Prompt engineering', 'Cursor', 'Claude Code', 'ChatGPT', 'CLI tooling'] },
];

export const experience = [
  {
    company: 'Rikoouu Technologies',
    role: 'Lead Software Engineer',
    period: 'Nov 2023 – Present',
    location: 'Remote',
    bullets: [
      'Lead delivery across social, AI lifestyle, DeFi, and gaming products while contributing hands-on across mobile, backend, architecture, planning, and reviews.',
      'Led teams of 4–8 engineers across OP3N, Gaimplan, YieldClub, and BoredButton.',
      'Worked on 25k+ contact sync fixes, calendar sync, WebView memory optimization, wallet onramp/offramp refactors, CI/CD, AWS SQS/Lambda jobs, and Firebase integrations.',
    ],
  },
  {
    company: 'ARInspect',
    role: 'Android Developer → Senior Software Engineer → Lead Software Engineer',
    period: 'Dec 2019 – Oct 2023',
    location: 'Ahmedabad',
    bullets: [
      'Promoted from Android Developer to Lead Software Engineer by expanding ownership into full-stack engineering, architecture, leadership, and cross-platform execution.',
      'Led a 10-engineer mixed team across Angular/TypeScript, Android Kotlin/Java, Node.js/Express, admin dashboards, backend APIs, and offline-first inspection workflows.',
      'Delivered a large web/backend module estimated at 9 months within 6 months and contributed to outcomes backed by a client testimonial reporting up to 300% efficiency improvement.',
    ],
  },
  {
    company: 'Earlier Android Engineering Roles',
    role: 'Universal Software · Spyveb Solutions · Zaptech Solutions',
    period: 'Aug 2016 – Dec 2019',
    location: 'Ahmedabad',
    bullets: [
      'Built Android products across test preparation, volunteering, life-goal management, audio processing, skilled-worker discovery, and parental achievement tracking.',
      'Worked with Java, Kotlin, WorkManager, offline support, Superpowered SDK, API integrations, unit tests, and Espresso-based UI tests.',
    ],
  },
];
