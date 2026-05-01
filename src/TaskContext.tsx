import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Collision } from './types';
import { isSameDay, parseISO } from 'date-fns';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
  collisions: Collision[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const DUMMY_DATA: Task[] = [
  {
    id: '1',
    title: 'DBMS Project Submission',
    subject: 'Database Systems',
    type: 'Assignment',
    deadline: new Date().toISOString(),
    priority: 'High',
    status: 'In Progress',
  },
  {
    id: '2',
    title: 'Algorithm Final Exam',
    subject: 'Algorithms',
    type: 'Exam',
    deadline: new Date().toISOString(),
    priority: 'High',
    status: 'Pending',
  },
  {
    id: '3',
    title: 'UI/UX Design Lab',
    subject: 'Human Computer Interaction',
    type: 'Lab',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: '4',
    title: 'OS Viva Voce',
    subject: 'Operating Systems',
    type: 'Viva',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    priority: 'Medium',
    status: 'Pending',
  }
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(DUMMY_DATA);
  const [collisions, setCollisions] = useState<Collision[]>([]);

  useEffect(() => {
    // Logic to detect collisions (tasks on the same day)
    const newCollisions: Collision[] = [];
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        const dateA = parseISO(tasks[i].deadline);
        const dateB = parseISO(tasks[j].deadline);
        
        if (isSameDay(dateA, dateB)) {
          newCollisions.push({
            taskId1: tasks[i].id,
            taskId2: tasks[j].id,
            reason: `Duplicate deadlines on ${dateA.toLocaleDateString()}`
          });
        }
      }
    }
    setCollisions(newCollisions);
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, collisions }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
}
