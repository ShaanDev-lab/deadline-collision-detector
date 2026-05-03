import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Save, Info } from "lucide-react";
import { useTasks } from "../contexts";
import { Priority, TaskType, Status } from "../types";

export default function AddTaskPage() {
  const navigate = useNavigate();
  const { addTask } = useTasks();

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    type: "Assignment" as TaskType,
    deadline: "",
    priority: "Medium" as Priority,
    status: "Pending" as Status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      ...formData,
      deadline: new Date(formData.deadline).toISOString(),
    });
    navigate("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className="bg-primary-600 px-8 py-6 text-white">
          <h1 className="text-2xl">Add New Task</h1>
          <p className="text-primary-100 text-sm mt-1">
            Keep track of your academic deadlines precisely.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">
                Task Title
              </label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="e.g. Final Year Thesis Report"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Subject
              </label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="e.g. Computer Networks"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Task Type
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as TaskType })
                }
              >
                <option value="Assignment">Assignment</option>
                <option value="Exam">Exam</option>
                <option value="Lab">Lab</option>
                <option value="Viva">Viva</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Deadline Date
              </label>
              <input
                type="date"
                required
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Priority Level
              </label>
              <div className="flex gap-2">
                {(["Low", "Medium", "High"] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                      formData.priority === p
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Initial Status
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Status })
                }
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Adding a task will automatically trigger the{" "}
              <strong>Collision Detector</strong> to check if this date clashes
              with other scheduled academic activities.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-100"
          >
            <Save className="w-5 h-5" />
            Save Task & Sync
          </button>
        </form>
      </motion.div>
    </div>
  );
}
