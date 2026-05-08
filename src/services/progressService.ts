import { initDB, Progress } from '../lib/db';

export class ProgressService {
  static async recordProgress(progress: Progress) {
    const db = await initDB();
    await db.put('progress', progress);
    
    // Update XP in LocalStorage
    const currentXp = Number(localStorage.getItem('user_xp') || 0);
    localStorage.setItem('user_xp', (currentXp + progress.score).toString());
    
    // Trigger "Fake" background sync check (just keeps local stores healthy)
    console.log("Progress saved locally:", progress);
  }

  static async getProgress(lessonId: number) {
    const db = await initDB();
    return await db.get('progress', lessonId);
  }

  static async getAllProgress() {
    const db = await initDB();
    return await db.getAll('progress');
  }

  static getXP() {
    return Number(localStorage.getItem('user_xp') || 0);
  }

  static getLevel() {
    const xp = this.getXP();
    return Math.floor(xp / 100) + 1;
  }
}
