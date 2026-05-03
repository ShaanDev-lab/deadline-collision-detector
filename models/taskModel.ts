import { getDB } from '../config/db.js';

export interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  category: string;
  priority: number;
  created_at?: string;
}

export class TaskModel {
  static async getAll(): Promise<Task[]> {
    const db = await getDB();
    if (!db) throw new Error('Database connection failed. Check your config.');
    const [rows] = await db.execute('SELECT * FROM tasks ORDER BY deadline ASC');
    return rows as Task[];
  }

  static async getById(id: string | number): Promise<Task | null> {
    const db = await getDB();
    if (!db) throw new Error('Database connection failed');
    const [rows]: any = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create(taskData: Omit<Task, 'id'>): Promise<number> {
    const { title, description, deadline, category, priority, subject_id } = taskData as any;
    const db = await getDB();
    if (!db) throw new Error('Database connection not available');
    
    const subId = subject_id && subject_id !== '' ? parseInt(subject_id) : null;

    const [result]: any = await db.execute(
      'INSERT INTO tasks (title, description, deadline, category, priority, subject_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, deadline, category, priority, subId]
    );
    return result.insertId;
  }

  static async update(id: string | number, taskData: Partial<Task>): Promise<boolean> {
    const { title, description, deadline, category, priority, subject_id } = taskData as any;
    const db = await getDB();
    if (!db) throw new Error('Database connection not available');
    
    const subId = subject_id && subject_id !== '' ? parseInt(subject_id) : null;

    await db.execute(
      'UPDATE tasks SET title = ?, description = ?, deadline = ?, category = ?, priority = ?, subject_id = ? WHERE id = ?',
      [title, description, deadline, category, priority, subId, id]
    );
    return true;
  }

  static async delete(id: string | number): Promise<boolean> {
    const db = await getDB();
    if (!db) throw new Error('Database connection not available');
    
    await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return true;
  }

  static async detectClashes(): Promise<any[]> {
    const db = await getDB();
    if (!db) throw new Error('Database connection not available');
    
    const [rows] = await db.execute(`
      SELECT 
        a.id as task1_id, a.title as task1_title, a.deadline as task1_deadline,
        b.id as task2_id, b.title as task2_title, b.deadline as task2_deadline
      FROM tasks a
      JOIN tasks b ON a.id < b.id
      WHERE ABS(TIMESTAMPDIFF(SECOND, a.deadline, b.deadline)) < 86400
      ORDER BY a.deadline ASC
    `);
    
    const clashes = rows as any[];

    // Import here to avoid circular dependency issues if any
    const { SuggestionModel } = await import('./suggestionModel.js');
    const allTasks = await this.getAll();

    for (const clash of clashes) {
      const task1 = allTasks.find(t => t.id === clash.task1_id);
      const task2 = allTasks.find(t => t.id === clash.task2_id);
      
      if (!task1 || !task2) continue;

      let taskToReschedule = task2;
      if (task1.priority < task2.priority) {
        taskToReschedule = task1;
      } else if (task1.priority === task2.priority) {
        if (new Date(task1.deadline) > new Date(task2.deadline)) {
          taskToReschedule = task1;
        }
      }

      // Check if it already has a pending suggestion
      const existing = await SuggestionModel.getSuggestionByTaskId(taskToReschedule.id);
      if (!existing) {
        let proposedDate = new Date(taskToReschedule.deadline);
        let found = false;
        
        while (!found) {
          proposedDate.setDate(proposedDate.getDate() + 1);
          
          let hasClash = false;
          for (const t of allTasks) {
            if (t.id === taskToReschedule.id) continue;
            
            const tDate = new Date(t.deadline);
            const diffHours = Math.abs(tDate.getTime() - proposedDate.getTime()) / (1000 * 60 * 60);
            
            if (diffHours < 24) {
              hasClash = true;
              break;
            }
          }
          
          if (!hasClash) {
            found = true;
          }
        }
        
        const formattedDate = proposedDate.toISOString().slice(0, 19).replace('T', ' ');
        await SuggestionModel.createSuggestion(taskToReschedule.id, formattedDate);
      }
    }
    
    return clashes;
  }
}
