import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Clock, Calendar, AlertCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTasks } from "../contexts";
import { StatsCard } from "../components/features/dashboard";
import { CollisionAlert } from "../components/features/collision";

export default function DashboardPage() {
  const { tasks, collisions } = useTasks();

  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const totalTasks = tasks.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl text-slate-900">Welcome Back, Student! 👋</h1>
          <p className="text-slate-500 mt-1">
            Here's an overview of your academic deadlines and tasks.
          </p>
        </div>
        <Link
          to="/add-task"
          className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 w-fit"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </Link>
      </header>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          icon={Calendar}
          colorClass="bg-blue-100 text-blue-600"
          delay={0.1}
        />
        <StatsCard
          title="Pending"
          value={pendingTasks}
          icon={Clock}
          colorClass="bg-amber-100 text-amber-600"
          delay={0.2}
        />
        <StatsCard
          title="Completed"
          value={completedTasks}
          icon={CheckCircle2}
          colorClass="bg-emerald-100 text-emerald-600"
          delay={0.3}
        />
        <StatsCard
          title="Collision Alerts"
          value={collisions.length}
          icon={AlertCircle}
          colorClass={
            collisions.length > 0
              ? "bg-red-100 text-red-600"
              : "bg-slate-100 text-slate-600"
          }
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Collision Alerts Section */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-xl">Collision Alerts</h2>
          </div>

          <div className="space-y-4">
            {collisions.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-emerald-800 font-medium">
                  No collisions detected! You're good to go.
                </p>
              </div>
            ) : (
              collisions.map((collision, idx) => (
                <CollisionAlert
                  key={idx}
                  taskId1={collision.taskId1}
                  taskId2={collision.taskId2}
                  reason={collision.reason}
                  index={idx}
                />
              ))
            )}
          </div>
        </div>

        {/* Recent Tasks List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-primary-600 font-semibold hover:underline text-sm"
            >
              View All
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {tasks.length === 0 ? (
              <div className="p-12 text-center">
                <Plus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  No tasks yet. Start by adding one!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2 h-12 rounded-full ${
                          task.priority === "High"
                            ? "bg-red-400"
                            : task.priority === "Medium"
                              ? "bg-amber-400"
                              : "bg-blue-400"
                        }`}
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                          {task.title}
                        </h4>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs text-slate-500 font-medium">
                            {task.subject}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          task.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : task.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
