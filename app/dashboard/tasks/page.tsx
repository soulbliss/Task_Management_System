import { Metadata } from "next";
import { TasksContent } from "./components/tasks-content";

export const metadata: Metadata = {
  title: "Tasks | Task Management System",
  description: "Manage and track your tasks",
};

export default function TasksPage() {
  return (
    <TasksContent />
  );
} 