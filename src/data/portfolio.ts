export const profile = {
  name: 'Jeel Vankhede',
  role: 'Lead Full Stack Engineer',
  location: 'Ahmedabad, Gujarat, India',
  email: 'jeelvankhede@gmail.com',
  phone: '+91 7874442754',
  links: {
    github: 'https://github.com/JeelVankhede',
    linkedin: 'https://www.linkedin.com/in/jeel-vankhede-b42887165',
    stackOverflow: 'https://stackoverflow.com/users/10271334/jeel-vankhede',
  },
};

export const metrics = [
  { value: '9+', label: 'Years engineering experience' },
  { value: '10', label: 'Engineers led in a mixed team' },
  { value: '12k+', label: 'Stack Overflow reputation' },
  { value: '1.1M+', label: 'People reached' },
  { value: '288', label: 'Stack Overflow answers' },
  { value: '2', label: 'Published npm packages' },
];

export const projects = [
  {
    name: 'AI Starter Recipes — Frontend & Backend',
    type: 'Published npm packages · TypeScript · CLI tooling',
    summary:
      'Developer tooling for generating AI agent rules, workflows, project standards, context, tracking, and IDE adapters for frontend/backend teams.',
    impact: ['Published npm CLI packages', 'Supports Cursor, Claude Code, Copilot, Antigravity, and Windsurf', 'Generates structured .ai workflows and agent guidance'],
    tags: ['TypeScript', 'CLI', 'AI workflows', 'Developer productivity'],
  },
  {
    name: 'ARInspect / Compliance Management Platform',
    type: 'Angular · Android · Node.js/Express · Offline-first',
    summary:
      'Offline-first inspection and compliance platform used by US government inspectors and enterprise teams to replace slow paper-based workflows.',
    impact: ['Led 10-engineer mixed team', '9-month module delivered in 6 months', 'Client-reported 300% efficiency improvement'],
    tags: ['Offline-first', 'Compliance', 'Angular', 'Android', 'Node.js'],
  },
  {
    name: 'YieldClub / DeFi P2P Lending App',
    type: 'React Native · NestJS · AWS · GitHub Actions',
    summary:
      'Crypto-based peer-to-peer lending application with wallet flows, mobile-first journeys, CI/CD, and nightly interest-calculation jobs.',
    impact: ['Led 8-engineer team', 'Scaled from 0 to 5k active users', 'AWS SQS/Lambda + Expo CI/CD'],
    tags: ['React Native', 'NestJS', 'AWS', 'DeFi'],
  },
  {
    name: 'Gaimplan',
    type: 'AI lifestyle management · React Native · NestJS · GCP',
    summary:
      'AI-powered lifestyle and calendar management application focused on synchronization, event suggestions, and conflict resolution.',
    impact: ['Led 6-engineer team', 'Architected NestJS backend APIs', 'Improved calendar sync via pub/sub and cron services'],
    tags: ['GCP', 'NestJS', 'Calendar sync', 'AI product'],
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
