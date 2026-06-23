export type NodeCategory =
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'cloud'
  | 'data'
  | 'ai'
  | 'leadership';

export interface StackNode {
  id: string;
  label: string;
  category: NodeCategory;
  weight: number;
}

export interface StackEdge {
  source: string;
  target: string;
  strength: number;
}

export const nodes: StackNode[] = [
  // Frontend
  { id: 'react', label: 'React.js', category: 'frontend', weight: 3 },
  { id: 'nextjs', label: 'Next.js', category: 'frontend', weight: 2 },
  { id: 'typescript', label: 'TypeScript', category: 'frontend', weight: 3 },
  { id: 'angular', label: 'Angular', category: 'frontend', weight: 2 },
  { id: 'redux', label: 'Redux', category: 'frontend', weight: 2 },
  { id: 'ngrx', label: 'NgRx', category: 'frontend', weight: 1 },
  { id: 'canvas', label: 'Canvas API', category: 'frontend', weight: 1 },
  { id: 'pwa', label: 'PWA', category: 'frontend', weight: 1 },

  // Backend
  { id: 'nodejs', label: 'Node.js', category: 'backend', weight: 3 },
  { id: 'nestjs', label: 'NestJS', category: 'backend', weight: 3 },
  { id: 'express', label: 'Express.js', category: 'backend', weight: 2 },
  { id: 'graphql', label: 'GraphQL', category: 'backend', weight: 2 },
  { id: 'rest', label: 'REST APIs', category: 'backend', weight: 3 },
  { id: 'eventjobs', label: 'Event-driven jobs', category: 'backend', weight: 2 },

  // Mobile
  { id: 'reactnative', label: 'React Native', category: 'mobile', weight: 3 },
  { id: 'android', label: 'Android', category: 'mobile', weight: 3 },
  { id: 'kotlin', label: 'Kotlin', category: 'mobile', weight: 3 },
  { id: 'java', label: 'Java', category: 'mobile', weight: 2 },
  { id: 'compose', label: 'Jetpack Compose', category: 'mobile', weight: 2 },
  { id: 'workmanager', label: 'WorkManager', category: 'mobile', weight: 1 },
  { id: 'koin', label: 'Koin', category: 'mobile', weight: 1 },

  // Cloud & DevOps
  { id: 'aws', label: 'AWS', category: 'cloud', weight: 3 },
  { id: 'sqs', label: 'AWS SQS', category: 'cloud', weight: 2 },
  { id: 'lambda', label: 'AWS Lambda', category: 'cloud', weight: 2 },
  { id: 'gcp', label: 'GCP', category: 'cloud', weight: 2 },
  { id: 'firebase', label: 'Firebase', category: 'cloud', weight: 2 },
  { id: 'docker', label: 'Docker', category: 'cloud', weight: 2 },
  { id: 'jenkins', label: 'Jenkins', category: 'cloud', weight: 1 },
  { id: 'gha', label: 'GitHub Actions', category: 'cloud', weight: 1 },

  // Data & Storage
  { id: 'postgres', label: 'PostgreSQL', category: 'data', weight: 2 },
  { id: 'mongodb', label: 'MongoDB', category: 'data', weight: 2 },
  { id: 'sqlite', label: 'SQLite', category: 'data', weight: 1 },
  { id: 'indexeddb', label: 'IndexedDB', category: 'data', weight: 1 },
  { id: 'offlinesync', label: 'Offline sync', category: 'data', weight: 2 },

  // AI / Dev Productivity
  { id: 'prompteng', label: 'Prompt Engineering', category: 'ai', weight: 2 },
  { id: 'agentrules', label: 'Agent Rules', category: 'ai', weight: 2 },
  { id: 'claudecode', label: 'Claude Code', category: 'ai', weight: 2 },
  { id: 'cursor', label: 'Cursor', category: 'ai', weight: 1 },
  { id: 'npmtools', label: 'npm CLI tooling', category: 'ai', weight: 2 },

  // Leadership
  { id: 'techleadership', label: 'Tech Leadership', category: 'leadership', weight: 3 },
  { id: 'architecture', label: 'Architecture', category: 'leadership', weight: 3 },
  { id: 'delivery', label: 'Delivery Planning', category: 'leadership', weight: 2 },
  { id: 'codereviews', label: 'Code Reviews', category: 'leadership', weight: 2 },
];

export const edges: StackEdge[] = [
  // Frontend cluster
  { source: 'react', target: 'typescript', strength: 3 },
  { source: 'react', target: 'redux', strength: 2 },
  { source: 'react', target: 'nextjs', strength: 2 },
  { source: 'angular', target: 'typescript', strength: 2 },
  { source: 'angular', target: 'ngrx', strength: 2 },
  { source: 'react', target: 'pwa', strength: 1 },
  { source: 'react', target: 'canvas', strength: 1 },

  // Backend cluster
  { source: 'nodejs', target: 'nestjs', strength: 3 },
  { source: 'nodejs', target: 'express', strength: 2 },
  { source: 'nodejs', target: 'typescript', strength: 3 },
  { source: 'nestjs', target: 'rest', strength: 2 },
  { source: 'nestjs', target: 'graphql', strength: 2 },
  { source: 'nestjs', target: 'eventjobs', strength: 2 },

  // Mobile cluster
  { source: 'reactnative', target: 'react', strength: 3 },
  { source: 'reactnative', target: 'typescript', strength: 2 },
  { source: 'android', target: 'kotlin', strength: 3 },
  { source: 'android', target: 'java', strength: 2 },
  { source: 'kotlin', target: 'compose', strength: 2 },
  { source: 'kotlin', target: 'workmanager', strength: 1 },
  { source: 'kotlin', target: 'koin', strength: 1 },
  { source: 'android', target: 'offlinesync', strength: 2 },
  { source: 'reactnative', target: 'offlinesync', strength: 2 },

  // Cloud cross-links
  { source: 'aws', target: 'sqs', strength: 2 },
  { source: 'aws', target: 'lambda', strength: 2 },
  { source: 'nestjs', target: 'gcp', strength: 2 },
  { source: 'nestjs', target: 'sqs', strength: 2 },
  { source: 'nestjs', target: 'firebase', strength: 2 },
  { source: 'reactnative', target: 'firebase', strength: 2 },
  { source: 'nodejs', target: 'docker', strength: 2 },
  { source: 'docker', target: 'jenkins', strength: 1 },
  { source: 'gha', target: 'docker', strength: 1 },

  // Data cross-links
  { source: 'nestjs', target: 'postgres', strength: 2 },
  { source: 'nestjs', target: 'mongodb', strength: 2 },
  { source: 'android', target: 'sqlite', strength: 2 },
  { source: 'react', target: 'indexeddb', strength: 1 },
  { source: 'offlinesync', target: 'sqlite', strength: 2 },
  { source: 'offlinesync', target: 'indexeddb', strength: 2 },

  // AI cluster
  { source: 'prompteng', target: 'agentrules', strength: 3 },
  { source: 'agentrules', target: 'claudecode', strength: 3 },
  { source: 'claudecode', target: 'cursor', strength: 2 },
  { source: 'agentrules', target: 'npmtools', strength: 2 },
  { source: 'nodejs', target: 'npmtools', strength: 2 },
  { source: 'typescript', target: 'npmtools', strength: 2 },

  // Leadership cross-domain links
  { source: 'techleadership', target: 'architecture', strength: 3 },
  { source: 'techleadership', target: 'delivery', strength: 2 },
  { source: 'techleadership', target: 'codereviews', strength: 2 },
  { source: 'architecture', target: 'nestjs', strength: 2 },
  { source: 'architecture', target: 'android', strength: 2 },
  { source: 'architecture', target: 'react', strength: 2 },
  { source: 'delivery', target: 'gha', strength: 1 },
  { source: 'codereviews', target: 'typescript', strength: 1 },

  // AI + Leadership
  { source: 'techleadership', target: 'prompteng', strength: 2 },
  { source: 'agentrules', target: 'architecture', strength: 2 },
];
