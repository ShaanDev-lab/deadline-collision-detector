/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  X,
  Filter,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Show, UserButton, useUser } from '@clerk/react';
import LoginPage from './pages/LoginPage';

interface Subject {
  subject_id: number;
  subject_name: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  category: string;
  priority: number;
  created_at: string;
}

interface Clash {
  task1_id: number;
  task1_title: string;
  task1_deadline: string;
  task2_id: number;
  task2_title: string;
  task2_deadline: string;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clashes, setClashes] = useState<Clash[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Subject State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const { user } = useUser();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    category: 'General',
    priority: 1,
    subject_id: ''
  });

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }
      
      setTasks(data);
      setError(null);
      checkClashes();
      fetchSubjects();
    } catch (err: any) {
      setError(err.message || 'Could not connect to the database server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkClashes = async () => {
    try {
      const response = await fetch('/api/tasks/detect-clashes');
      if (response.ok) {
        const data = await response.json();
        setClashes(data);
      }
    } catch (err) {
      console.error('Clash detection failed', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects');
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch subjects', err);
    }
  };

  const syncUser = async () => {
    if (!user) return;
    try {
      await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.fullName || user.username || 'Student',
          email: user.primaryEmailAddress?.emailAddress
        })
      });
    } catch (err) {
      console.error('User sync failed', err);
    }
  };

  useEffect(() => {
    if (user) {
      syncUser();
      fetchTasks();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
      const method = editingTask ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save task');
      
      setFormData({ title: '', description: '', deadline: '', category: 'General', priority: 1, subject_id: '' });
      setShowForm(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err: any) {
      console.error('Submit failed:', err);
      alert('Error: ' + (err.message || 'Make sure your server/MySQL is running properly.'));
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubjectName })
      });
      if (res.ok) {
        setNewSubjectName('');
        fetchSubjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    if (!confirm('Deleting a subject will also delete all tasks associated with it. Continue?')) return;
    try {
      await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
      fetchSubjects();
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      deadline: new Date(task.deadline).toISOString().slice(0, 16),
      category: task.category,
      priority: task.priority || 1,
      subject_id: (task as any).subject_id ? (task as any).subject_id.toString() : ''
    });
    setShowForm(true);
  };

  const isClashing = (taskId: number) => {
    return clashes.some(c => c.task1_id === taskId || c.task2_id === taskId);
  };

  return (
    <>
      <Show when="signed-out">
        <LoginPage />
      </Show>
      <Show when="signed-in">
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Calendar className="text-blue-600" />
              Deadline Collision Detector
            </h1>
            <p className="text-slate-500 mt-1 uppercase text-xs font-semibold tracking-wider">DBMS Project - Phase 1</p>
          </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowSubjectForm(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all active:scale-95"
                >
                  <Plus size={18} />
                  New Subject
                </button>
                <button 
                  onClick={() => {
                    setEditingTask(null);
                    setFormData({ title: '', description: '', deadline: '', category: 'General', priority: 1, subject_id: subjects[0]?.subject_id?.toString() || '' });
                    setShowForm(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                  id="add-task-btn"
                >
                  <Plus size={20} />
                  Add New Task
                </button>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                  <UserButton />
                </div>
              </div>
            </header>

        {/* Alerts Section */}
        {clashes.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4 shadow-sm"
          >
            <div className="p-2 bg-amber-100 rounded-full text-amber-600 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-lg">Deadline Clashes Detected!</h3>
              <p className="text-amber-800 text-sm mt-1">
                The following tasks have deadlines within 24 hours of each other. Consider rescheduling.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {clashes.map((clash, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-amber-200 rounded-lg text-xs font-medium text-amber-700">
                    "{clash.task1_title}" vs "{clash.task2_title}"
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendation Section */}
        {(() => {
          const recommendedTask = tasks.length > 0 ? tasks.reduce((prev, current) => {
            if (current.priority > prev.priority) return current;
            if (current.priority === prev.priority && new Date(current.deadline) < new Date(prev.deadline)) return current;
            return prev;
          }) : null;

          if (!recommendedTask) return null;

          return (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-6 shadow-xl shadow-blue-200/50 text-white"
            >
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shrink-0">
                <Star size={32} className="text-yellow-300" fill="currentColor" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-blue-800/50 rounded-full text-xs font-bold uppercase tracking-widest mb-2 border border-blue-500/30">
                  Start This First
                </div>
                <h3 className="font-bold text-2xl mb-1">{recommendedTask.title}</h3>
                <p className="text-blue-100 text-sm mb-3">
                  Highest priority task with the soonest deadline.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-200 font-medium bg-blue-800/30 w-fit px-4 py-2 rounded-xl mx-auto md:mx-0">
                  <Clock size={16} />
                  <span className="text-sm">
                    Due: {new Date(recommendedTask.deadline).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl mb-8 text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
            <h3 className="font-bold text-red-900">Backend Connection Error</h3>
            <p className="text-red-700 text-sm max-w-lg mx-auto mt-2">
              The application is unable to connect to your MySQL database. 
              If you are testing this locally, make sure your MySQL server (XAMPP/MySQL) is running.
            </p>
          </div>
        )}

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {tasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group bg-white p-6 rounded-2xl border-2 transition-all hover:shadow-xl ${
                  isClashing(task.id) ? 'border-amber-200 shadow-amber-50' : 'border-slate-100 hover:border-blue-100'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      task.category === 'Exam' ? 'bg-red-100 text-red-700' :
                      task.category === 'Assignment' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {task.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ml-2 ${
                      task.priority === 3 ? 'bg-red-100 text-red-700' :
                      task.priority === 2 ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority === 3 ? 'High' : task.priority === 2 ? 'Med' : 'Low'}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(task)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{task.title}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px] italic">
                  {task.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Clock size={16} className={isClashing(task.id) ? 'text-amber-500' : 'text-blue-500'} />
                    <span className="text-sm">
                      {new Date(task.deadline).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  {isClashing(task.id) ? (
                    <div className="flex items-center gap-1 text-amber-600 font-bold text-[10px] uppercase">
                       <AlertTriangle size={12} />
                       Clash
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase">
                       <CheckCircle2 size={12} />
                       Clear
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {tasks.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Clock className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium font-mono">No tasks found. Time to add some deadlines!</p>
            </div>
          )}
        </div>

        {/* Modal Applet */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingTask ? 'Edit Task' : 'New Task'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Task Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., Final Year DBMS Viva"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Subject</label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all appearance-none"
                    value={formData.subject_id}
                    onChange={e => setFormData({...formData, subject_id: e.target.value})}
                  >
                    <option value="" disabled>Select a Subject</option>
                    {subjects.map(sub => (
                      <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name}</option>
                    ))}
                  </select>
                  {subjects.length === 0 && (
                    <p className="text-[10px] text-amber-600 font-bold px-1">Please add a subject first!</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Category</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all appearance-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>General</option>
                    <option>Assignment</option>
                    <option>Exam</option>
                    <option>Project</option>
                    <option>Quiz</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Priority</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all appearance-none"
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: parseInt(e.target.value)})}
                  >
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Deadline Date & Time</label>
                  <input 
                    required
                    type="datetime-local" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Description (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Brief details about the task..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 mt-4"
                >
                  {editingTask ? 'Apply Changes' : 'Create Task'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Subject Modal */}
        {showSubjectForm && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900">Manage Subjects</h2>
                <button onClick={() => setShowSubjectForm(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 max-h-60 overflow-y-auto space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Existing Subjects</label>
                {subjects.length === 0 ? (
                  <p className="text-sm text-slate-400 italic p-2">No subjects added yet.</p>
                ) : (
                  subjects.map(sub => (
                    <div key={sub.subject_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group">
                      <span className="font-medium text-slate-700">{sub.subject_name}</span>
                      <button 
                        onClick={() => handleDeleteSubject(sub.subject_id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddSubject} className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Add New</label>
                  <div className="flex gap-2">
                    <input 
                      required
                      type="text" 
                      placeholder="e.g., Mathematics"
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm"
                      value={newSubjectName}
                      onChange={e => setNewSubjectName(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-100"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </div>
    </div>
      </Show>
    </>
  );
}

