import { getDB } from '../config/db.js';

export interface Subject {
  subject_id: number;
  user_id: number;
  subject_name: string;
}

export class SubjectModel {
  static async getAll(): Promise<Subject[]> {
    const db = await getDB();
    if (!db) throw new Error('DB Connection Failed');
    const [rows] = await db.execute('SELECT * FROM subjects');
    return rows as Subject[];
  }

  static async create(name: string): Promise<number> {
    const db = await getDB();
    if (!db) throw new Error('DB Connection Failed');
    const [result]: any = await db.execute(
      'INSERT INTO subjects (subject_name) VALUES (?)',
      [name]
    );
    return result.insertId;
  }

  static async delete(id: number | string): Promise<boolean> {
    const db = await getDB();
    if (!db) throw new Error('DB Connection Failed');
    await db.execute('DELETE FROM subjects WHERE subject_id = ?', [id]);
    return true;
  }
}
