import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Trash2, Edit, AlertCircle } from 'lucide-react';
import { useTasks } from '../TaskContext';

export default function TasksPage() {
  const { tasks, deleteTask, collisions } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || task.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const subjects = ['All', ...new Set(tasks.map(t => t.subject))];

  const hasCollision = (taskId: string) => {
    return collisions.some(c => c.taskId1 === taskId || c.taskId2 === taskId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl text-slate-900">All Academic Tasks</h1>
        <p className="text-slate-500">Manage and filter your upcoming deadlines.</p>
      </header>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tasks or subjects..."
            className="w-full bg-slate-50 border border-slate-100 py-2.5 pl-11 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            className="bg-slate-50 border border-slate-100 py-2.5 px-4 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Task Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No tasks match your current filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, idx) => (
                  <motion.tr 
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         <span className="font-bold text-slate-900">{task.title}</span>
                         {hasCollision(task.id) && (
                           <div className="group relative">
                             <AlertCircle className="w-4 h-4 text-red-500" />
                             <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                               Collision Alert!
                             </span>
                           </div>
                         )}
                       </div>
                       <span className="text-xs text-slate-400 block">{task.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-medium">{task.subject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">
                        {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                        task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        task.status === 'Completed' ? 'text-emerald-600' :
                        task.status === 'In Progress' ? 'text-blue-600' : 'text-slate-500'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                           task.status === 'Completed' ? 'bg-emerald-600' :
                           task.status === 'In Progress' ? 'bg-blue-600' : 'bg-slate-500'
                        }`} />
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                           <Edit className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => deleteTask(task.id)}
                           className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
