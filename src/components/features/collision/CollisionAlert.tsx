import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, XCircle } from "lucide-react";
import { useTasks } from "../../../contexts";

interface CollisionAlertProps {
  taskId1: string;
  taskId2: string;
  reason: string;
  index: number;
}

const CollisionAlert: React.FC<CollisionAlertProps> = ({
  taskId1,
  taskId2,
  reason,
  index,
}) => {
  const { tasks } = useTasks();
  const task1 = tasks.find((t) => t.id === taskId1);
  const task2 = tasks.find((t) => t.id === taskId2);

  if (!task1 || !task2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-4 mb-4"
    >
      <div className="bg-red-100 p-2 rounded-lg">
        <AlertTriangle className="text-red-600 w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-red-900 font-semibold text-sm">
          Deadline Collision Detected!
        </h4>
        <p className="text-red-700 text-sm mt-1">
          <strong>{task1.title}</strong> and <strong>{task2.title}</strong> have
          overlapping deadlines.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">
            Issue: {reason}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CollisionAlert;
