'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Task } from '@/lib/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AsyncBoundary } from '@/components/async-boundary';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [optimisticTask, setOptimisticTask] = useState<Task | null>(null);

  const displayedTask = optimisticTask || task;

  const fetchTask = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tasks/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }

      const data = await response.json();
      setTask(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchTask();
  }, [params.id, fetchTask]);

  async function updateTaskStatus(newStatus: string) {
    if (!task) return;

    // Optimistically update the UI
    setOptimisticTask({ ...task, status: newStatus as Task['status'] });
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      const updatedTask = await response.json();
      setTask(updatedTask);
      setOptimisticTask(null);
      toast({
        title: 'Status updated',
        description: `Task status changed to ${newStatus}`,
      });
    } catch (err) {
      // Revert optimistic update on error
      setOptimisticTask(null);
      toast({
        title: 'Error updating status',
        description: 'Failed to update task status. Please try again.',
        variant: 'destructive',
      });
      console.error('Error updating task status:', err);
    } finally {
      setIsUpdating(false);
    }
  }

  async function deleteTask() {
    if (!task) return;

    // Optimistically hide the task
    setOptimisticTask({ ...task, deleted: true });
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      toast({
        title: 'Task deleted',
        description: 'Task has been successfully deleted',
      });
      router.push('/dashboard/tasks');
      router.refresh();
    } catch (err) {
      // Revert optimistic update on error
      setOptimisticTask(null);
      setIsDeleting(false);
      toast({
        title: 'Error deleting task',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
      console.error('Error deleting task:', err);
    }
  }

  return (
    <AsyncBoundary
      isLoading={isLoading}
      errorMessage={error || undefined}
      onRetry={fetchTask}
    >
      {displayedTask?.deleted ? (
        <div className="text-center p-4">
          Task deleted. Redirecting...
        </div>
      ) : displayedTask ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">{displayedTask.title}</h2>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/tasks/${displayedTask.id}/edit`)}
              >
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      task and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteTask}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{displayedTask.description}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Status</h3>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        displayedTask.status === 'completed'
                          ? 'default'
                          : displayedTask.status === 'in_progress'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {displayedTask.status}
                    </Badge>
                    <Select
                      value={displayedTask.status}
                      onValueChange={updateTaskStatus}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Start Date</h3>
                    <p className="text-muted-foreground">
                      {format(new Date(displayedTask.start_time), 'PPP')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">End Date</h3>
                    <p className="text-muted-foreground">
                      {format(new Date(displayedTask.end_time), 'PPP')}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Time Tracking</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p>{format(new Date(displayedTask.created_at), 'PPP')}</p>
                    </div>
                    {displayedTask.updated_at && (
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p>{format(new Date(displayedTask.updated_at), 'PPP')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </AsyncBoundary>
  );
} 