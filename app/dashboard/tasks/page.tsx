import { Metadata } from "next";
import TaskList from "./components/task-list";
import TaskFilters from "./components/task-filters";

export const metadata: Metadata = {
  title: "Tasks | Task Management System",
  description: "Manage and track your tasks",
};

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
      </div>

      <div className="space-y-4">
        <TaskFilters />
        <TaskList />
      </div>
    </div>
  );
} 