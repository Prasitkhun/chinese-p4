import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Lesson {
  id: number;
  title: string;
  translation: string;
  pinyin: string;
  vocabulary: { word: string; pinyin: string; translation: string; audio?: string; hint?: string; icon?: string; page?: number }[];
  dialogues: { role: string; text: string; pinyin: string; translation: string }[];
  activities: any[];
  listeningActivities?: {
    id: number;
    title: string;
    objective: string;
    instruction: string;
    script: string;
    task: string;
    options?: string[];
    answer: string;
    skill: string;
    type: 'choice' | 'action' | 'matching' | 'fill' | 'sequence' | 'draw' | 'short';
  }[];
  keyConcepts?: string[];
  vocabFocus?: string[];
  illustration?: string;
  hideNumber?: boolean;
  isSpecial?: boolean;
}

export interface Progress {
  lessonId: number;
  completed: boolean;
  score: number;
  lastStudied: string;
}

export interface SyncQueue {
  id?: number;
  collection: string;
  docId: string;
  data: any;
  timestamp: number;
}

interface AppDB extends DBSchema {
  lessons: {
    key: number;
    value: Lesson;
  };
  progress: {
    key: number;
    value: Progress;
  };
  syncQueue: {
    key: number;
    value: SyncQueue;
    indexes: { 'by-timestamp': number };
  };
}

let dbPromise: Promise<IDBPDatabase<AppDB>>;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>('jiayou-db', 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('lessons')) {
          db.createObjectStore('lessons', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'lessonId' });
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          const store = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          store.createIndex('by-timestamp', 'timestamp');
        }
      },
    });
  }
  return dbPromise;
};
