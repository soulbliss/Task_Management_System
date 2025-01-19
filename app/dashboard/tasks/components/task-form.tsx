'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['pending', 'in_progress', 'completed']),
  start_time: z.date({
    required_error: "Start date is required",
  }),
  end_time: z.date({
    required_error: "End date is required",
  }),
}).refine((data) => {
  const start = new Date(data.start_time);
  const end = new Date(data.end_time);
  return end > start;
}, {
  message: "End date must be after start date",
  path: ["end_time"],
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  initialData?: TaskFormValues;
}

export default function TaskForm({ initialData }: TaskFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      status: 'pending',
      start_time: new Date(),
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    },
  });

  async function onSubmit(data: TaskFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          start_time: data.start_time.toISOString(),
          end_time: data.end_time.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      router.push('/dashboard/tasks');
      router.refresh();
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            {...form.register('title')}
            placeholder="Task title"
            className="w-full"
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            {...form.register('description')}
            placeholder="Task description"
            className="w-full resize-none"
          />
          {form.formState.errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            onValueChange={(value) => form.setValue('status', value as TaskFormValues['status'])}
            defaultValue={form.getValues('status')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.status && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.status.message}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <div className="relative">
              <DayPicker
                mode="single"
                selected={form.getValues('start_time')}
                onSelect={(date) => date && form.setValue('start_time', date)}
                className="border rounded-md p-3"
              />
            </div>
            {form.formState.errors.start_time && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.start_time.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <div className="relative">
              <DayPicker
                mode="single"
                selected={form.getValues('end_time')}
                onSelect={(date) => date && form.setValue('end_time', date)}
                disabled={(date) => date < form.getValues('start_time')}
                className="border rounded-md p-3"
              />
            </div>
            {form.formState.errors.end_time && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.end_time.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating...' : 'Create Task'}
      </Button>
    </form>
  );
} 