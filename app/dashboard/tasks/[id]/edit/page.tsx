'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TaskForm from '../../components/task-form';
import { Task } from '@/lib/types/task';

export default function EditTaskPage() {
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        const response = await fetch(`/api/tasks/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }
        const data = await response.json();
        setTask(data);
      } catch (err) {
        setError('Failed to load task');
        console.error('Error fetching task:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTask();
  }, [params.id]);

  if (isLoading) {
    return <div className="text-center p-4">Loading task...</div>;
  }

  if (error || !task) {
    return (
      <div className="text-red-500 text-center p-4">
        {error || 'Task not found'}
      </div>
    );
  }

  const initialData = {
    title: task.title,
    description: task.description,
    status: task.status,
    start_time: new Date(task.start_time),
    end_time: new Date(task.end_time),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Task</h2>
      </div>
      <TaskForm initialData={initialData} />
    </div>
  );
} 