import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { ThemeToggle } from "./ThemeToggle";
import { Calendar, LayoutDashboard, ListTodo, PieChart } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b-4 border-black dark:border-white">
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-2xl uppercase tracking-tighter text-black dark:text-white">
              ⚡ Collision <span className="hidden sm:inline">Detector</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 border-2 border-black dark:border-white font-bold uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 border-2 border-black dark:border-white font-bold uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`
              }
            >
              <ListTodo size={18} />
              Tasks
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 border-2 border-black dark:border-white font-bold uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`
              }
            >
              <Calendar size={18} />
              Calendar
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 border-2 border-black dark:border-white font-bold uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`
              }
            >
              <PieChart size={18} />
              Analytics
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="bg-white dark:bg-black p-2 border-2 border-black dark:border-white flex items-center justify-center">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden border-t-2 border-black dark:border-white bg-white dark:bg-black overflow-x-auto">
        <div className="flex justify-start gap-2 p-3 min-w-max">
           <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 border-2 border-black dark:border-white font-bold uppercase tracking-widest text-xs transition-colors ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 border-2 border-black dark:border-white font-bold uppercase tracking-widest text-xs transition-colors ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`
              }
            >
              Tasks
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 border-2 border-black dark:border-white font-bold uppercase tracking-widest text-xs transition-colors ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`
              }
            >
              Calendar
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 border-2 border-black dark:border-white font-bold uppercase tracking-widest text-xs transition-colors ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`
              }
            >
              Analytics
            </NavLink>
        </div>
      </div>
    </nav>
  );
}
