import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, PlusCircle, LogOut, Bell } from 'lucide-react';
import { useTasks } from '../TaskContext';

export default function Navbar() {
  const { collisions } = useTasks();

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Bell className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 hidden sm:block">
              Deadline <span className="text-primary-600">Detector</span>
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-1 sm:gap-6">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">Dashboard</span>
              </NavLink>
              <NavLink 
                to="/tasks" 
                className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'}`}
              >
                <ListTodo className="w-4 h-4" />
                <span className="hidden md:inline">Tasks</span>
              </NavLink>
              <NavLink 
                to="/add-task" 
                className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'}`}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden md:inline">Add Task</span>
              </NavLink>
            </div>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-5 h-5 text-slate-500 cursor-pointer hover:text-primary-600 transition-colors" />
                {collisions.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                )}
              </div>
              <NavLink to="/" className="text-slate-500 hover:text-red-600">
                <LogOut className="w-5 h-5" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
