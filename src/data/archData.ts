export type ArchNodeType =
  | 'client'       // user-facing clients (mobile, web)
  | 'gateway'      // API gateways, load balancers
  | 'service'      // backend services
  | 'queue'        // message queues, async jobs
  | 'storage'      // databases, caches
  | 'infra'        // cloud infra, CI/CD
  | 'ai'           // AI/tooling layer
  | 'leadership';  // meta: leadership, architecture

export interface ArchNode {
  id: string;
  label: string;        // category label shown small above title
  title: string;        // main display name
  sub?: string;         // optional subtitle
  type: ArchNodeType;
  techs: string[];      // technologies in this box
  // Layout: percentage-based so it works at any viewport
  x: number;           // left % (0–100)
  y: number;           // top % (0–100)
  w: number;           // width in px
  h: number;           // height in px
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;       // e.g. "REST", "GraphQL", "SQS"
  animated: boolean;    // whether to show flowing packet
  dashed?: boolean;
}

export const archNodes: ArchNode[] = [
  // --- Top row: Clients ---
  {
    id: 'web-client',
    label: 'Client',
    title: 'Web App',
    sub: 'React · Next.js · TypeScript',
    type: 'client',
    techs: ['React.js', 'Next.js', 'TypeScript', 'Redux', 'PWA'],
    x: 8, y: 12, w: 160, h: 80,
  },
  {
    id: 'mobile-rn',
    label: 'Client',
    title: 'React Native',
    sub: 'iOS · Android',
    type: 'client',
    techs: ['React Native', 'TypeScript', 'Offline sync', 'Firebase'],
    x: 30, y: 12, w: 160, h: 80,
  },
  {
    id: 'android-native',
    label: 'Client',
    title: 'Android Native',
    sub: 'Kotlin · Jetpack Compose',
    type: 'client',
    techs: ['Kotlin', 'Java', 'Jetpack Compose', 'WorkManager', 'SQLite'],
    x: 52, y: 12, w: 160, h: 80,
  },
  {
    id: 'angular-client',
    label: 'Client',
    title: 'Angular Web',
    sub: 'NgRx · Canvas · Offline-first',
    type: 'client',
    techs: ['Angular', 'NgRx', 'Canvas API', 'IndexedDB', 'PWA'],
    x: 74, y: 12, w: 160, h: 80,
  },

  // --- Second row: Gateway / Leadership ---
  {
    id: 'api-gateway',
    label: 'Gateway',
    title: 'API Gateway',
    sub: 'REST · GraphQL',
    type: 'gateway',
    techs: ['REST APIs', 'GraphQL', 'NestJS', 'Express.js'],
    x: 30, y: 32, w: 160, h: 80,
  },
  {
    id: 'leadership',
    label: 'Meta',
    title: 'Tech Leadership',
    sub: 'Architecture · Delivery · Reviews',
    type: 'leadership',
    techs: ['System design', 'Team leadership (10 engineers)', 'Code reviews', 'Delivery planning'],
    x: 62, y: 32, w: 180, h: 80,
  },

  // --- Third row: Services ---
  {
    id: 'nestjs-svc',
    label: 'Service',
    title: 'NestJS Backend',
    sub: 'Node.js · Event-driven',
    type: 'service',
    techs: ['NestJS', 'Node.js', 'TypeScript', 'Event-driven jobs'],
    x: 12, y: 52, w: 170, h: 80,
  },
  {
    id: 'express-svc',
    label: 'Service',
    title: 'Express.js API',
    sub: 'Node.js · REST',
    type: 'service',
    techs: ['Express.js', 'Node.js', 'REST APIs'],
    x: 38, y: 52, w: 160, h: 80,
  },
  {
    id: 'ai-layer',
    label: 'AI / Dev Tools',
    title: 'AI Workflow Layer',
    sub: 'Claude Code · Prompt Eng.',
    type: 'ai',
    techs: ['Claude Code', 'Prompt Engineering', 'Agent Rules', 'Cursor', 'npm CLI tooling'],
    x: 65, y: 52, w: 180, h: 80,
  },

  // --- Fourth row: Queues + Storage ---
  {
    id: 'sqs-queue',
    label: 'Queue',
    title: 'AWS SQS',
    sub: 'Async jobs · Lambda',
    type: 'queue',
    techs: ['AWS SQS', 'AWS Lambda', 'Event-driven jobs'],
    x: 8, y: 72, w: 150, h: 80,
  },
  {
    id: 'postgres-db',
    label: 'Storage',
    title: 'PostgreSQL',
    sub: 'Primary datastore',
    type: 'storage',
    techs: ['PostgreSQL', 'SQL'],
    x: 30, y: 72, w: 140, h: 80,
  },
  {
    id: 'mongo-db',
    label: 'Storage',
    title: 'MongoDB',
    sub: 'Document store',
    type: 'storage',
    techs: ['MongoDB', 'NoSQL'],
    x: 48, y: 72, w: 140, h: 80,
  },
  {
    id: 'firebase',
    label: 'Storage / Cloud',
    title: 'Firebase',
    sub: 'Realtime · Auth · Push',
    type: 'storage',
    techs: ['Firebase', 'Realtime DB', 'Push notifications'],
    x: 66, y: 72, w: 140, h: 80,
  },
  {
    id: 'infra',
    label: 'Infra',
    title: 'Cloud & CI/CD',
    sub: 'AWS · GCP · Docker · GHA',
    type: 'infra',
    techs: ['AWS', 'GCP', 'Docker', 'GitHub Actions', 'Jenkins'],
    x: 82, y: 72, w: 150, h: 80,
  },
];

export const archEdges: ArchEdge[] = [
  // Clients → Gateway
  { from: 'web-client', to: 'api-gateway', animated: true, label: 'REST' },
  { from: 'mobile-rn', to: 'api-gateway', animated: true, label: 'REST' },
  { from: 'android-native', to: 'firebase', animated: true, label: 'SDK' },
  { from: 'angular-client', to: 'api-gateway', animated: true, label: 'REST' },

  // Gateway → Services
  { from: 'api-gateway', to: 'nestjs-svc', animated: true, label: 'Route' },
  { from: 'api-gateway', to: 'express-svc', animated: true, label: 'Route' },

  // Leadership cross-cut
  { from: 'leadership', to: 'nestjs-svc', animated: false, dashed: true },
  { from: 'leadership', to: 'android-native', animated: false, dashed: true },
  { from: 'leadership', to: 'ai-layer', animated: false, dashed: true },

  // Services → Storage
  { from: 'nestjs-svc', to: 'postgres-db', animated: true, label: 'SQL' },
  { from: 'nestjs-svc', to: 'mongo-db', animated: true, label: 'ODM' },
  { from: 'nestjs-svc', to: 'sqs-queue', animated: true, label: 'Publish' },
  { from: 'nestjs-svc', to: 'firebase', animated: true, label: 'SDK' },
  { from: 'express-svc', to: 'postgres-db', animated: false },
  { from: 'express-svc', to: 'mongo-db', animated: false },

  // Queue → Services (feedback loop)
  { from: 'sqs-queue', to: 'nestjs-svc', animated: true, label: 'Consume', dashed: true },

  // Services → Infra
  { from: 'nestjs-svc', to: 'infra', animated: false, dashed: true },
  { from: 'express-svc', to: 'infra', animated: false, dashed: true },

  // AI layer links
  { from: 'ai-layer', to: 'infra', animated: false, dashed: true },
];
