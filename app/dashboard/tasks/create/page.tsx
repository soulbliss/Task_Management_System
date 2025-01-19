import { Metadata } from "next";
import TaskForm from "../components/task-form";

export const metadata: Metadata = {
  title: "Create Task | Task Management System",
  description: "Create a new task",
};

export default function CreateTaskPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create Task</h2>
      </div>
      <TaskForm />
    </div>
  );
} 