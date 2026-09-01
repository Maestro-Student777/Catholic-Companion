export type Mode = 'study' | 'question' | 'note' | 'history' | 'glossary' | 'crossref';

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  sourceUrl?: string;
  category?: string;
}

export interface Snapshot {
  url: string;
  timestamp: string;
  text: string;
  title?: string;
}

export type GlossaryCategory = 
  | 'dogma'
  | 'sacraments'
  | 'liturgy'
  | 'canon_law'
  | 'patristics'
  | 'moral'
  | 'scripture'
  | 'latin_phrases'
  | 'general';

export interface GlossaryEntry {
  id: string;
  term: string;
  latinOrGreek?: string;
  category: GlossaryCategory;
  definition: string;
  catechismRef?: string;
  scriptureOrPatristicRef?: string;
  theologicalContext?: string;
  source?: 'curated' | 'ai';
  timestamp?: number;
}

export type CrossReferenceType = 
  | 'scripture'
  | 'catechism'
  | 'encyclical'
  | 'patristic'
  | 'canon_law'
  | 'council';

export interface CrossReference {
  id: string;
  type: CrossReferenceType;
  title: string;
  citation: string;
  authorOrSource: string;
  summary: string;
  connectionToSnapshot: string;
  directQuote?: string;
  url?: string;
  yearOrEra?: string;
}

export interface CrossReferenceAnalysis {
  snapshotSummary: string;
  identifiedThemes: string[];
  crossReferences: CrossReference[];
  timestamp: number;
}
